#!/usr/bin/env node
// Confere o frontmatter de todo Markdown em docs/ (OKF v0.2 mais a política local da empresa).
// Uso: node scripts/check-docs.mjs [docs]   sai com 1 e lista cada problema.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Política local: ajuste estas listas para a empresa.
const TYPES = ["Arquitetura", "Regra de Negócio", "Processo", "Feature", "Jornada", "Guia", "Conceito",
  "Runbook", "Decisão", "Glossário", "Spec", "Plano", "Pesquisa", "PRD", "Visão", "Design"];
const NEEDS_SOURCES = ["Feature", "Regra de Negócio", "Decisão", "Pesquisa"];
const NEEDS_STALE_AFTER = ["Runbook"];
const STATUS = ["draft", "stable", "deprecated"];
// Arquivos da raiz que levam o mesmo bloco. Vazio: nenhum. Num legado, onde eles também nascem gerados por
// agente: ["VISION.md", "ARCHITECTURE.md", "DESIGN.md"].
const ROOT_FILES = ["VISION.md", "ARCHITECTURE.md", "DESIGN.md"];
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const ACTOR = /^(human:|process:)\S+$|^[^\s:/]+\/\S+$/;

const root = process.argv[2] ?? "docs";
const problems = [];
const say = (file, msg) => problems.push(`${relative(process.cwd(), file)}: ${msg}`);

// Leitor de YAML para frontmatter: escalares, [a, b], { k: v }, blocos aninhados e listas deles.
const scalar = (v) => {
  v = v.trim();
  if (/^".*"$|^'.*'$/.test(v)) return v.slice(1, -1);
  if (v.startsWith("[") && v.endsWith("]")) return v.slice(1, -1).split(",").map(scalar).filter((x) => x !== "");
  if (v.startsWith("{") && v.endsWith("}")) {
    const o = {};
    for (const part of v.slice(1, -1).split(",")) {
      const i = part.indexOf(":");
      if (i > 0) o[part.slice(0, i).trim()] = scalar(part.slice(i + 1));
    }
    return o;
  }
  return v;
};
function parse(lines, indent = 0) {
  let out = null;
  while (lines.length) {
    const line = lines[0];
    if (!line.trim() || line.trim().startsWith("#")) { lines.shift(); continue; }
    const ind = line.length - line.trimStart().length;
    if (ind < indent) break;
    const t = line.trim();
    if (t.startsWith("- ")) {
      out ??= [];
      lines.shift();
      const rest = t.slice(2);
      const kv = /^([\w.-]+):\s*(.*)$/.exec(rest);
      if (kv && !rest.startsWith("{")) {
        const item = { [kv[1]]: kv[2] ? scalar(kv[2]) : parse(lines, ind + 4) };
        const more = parse(lines, ind + 2);
        out.push(more && !Array.isArray(more) ? { ...item, ...more } : item);
      } else out.push(scalar(rest));
    } else {
      const kv = /^([\w.-]+):\s*(.*)$/.exec(t);
      if (!kv) { lines.shift(); continue; }
      out ??= {};
      lines.shift();
      out[kv[1]] = kv[2] ? scalar(kv[2]) : parse(lines, ind + 1);
    }
  }
  return out;
}
function frontmatter(text) {
  text = text.replace(/^\uFEFF/, ""); // um BOM UTF-8 (comum no Windows) não pode esconder o frontmatter
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  return m ? parse(m[1].split(/\r?\n/)) ?? {} : null;
}
const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const checkEvent = (file, field, e) => {
  if (typeof e !== "object" || !e.by || !e.at) return say(file, `${field} precisa de { by, at }`);
  if (!ACTOR.test(e.by)) say(file, `${field}.by "${e.by}" não é human:<id>, process:<id> nem <ferramenta>/<versão>`);
  if (!ISO.test(e.at)) say(file, `${field}.at "${e.at}" não é data e hora ISO 8601 com fuso`);
};

function checkFields(file, fm) {
  if (!fm) return say(file, "sem bloco de frontmatter (--- na primeira linha)");
  if (!fm.type) say(file, "type é obrigatório");
  else if (!TYPES.includes(fm.type)) say(file, `type "${fm.type}" não está na lista da empresa`);
  for (const k of ["title", "description", "status"]) if (!fm[k]) say(file, `${k} é obrigatório`);
  if (fm.status && !STATUS.includes(fm.status)) say(file, `status "${fm.status}" não é draft, stable nem deprecated`);
  if (NEEDS_SOURCES.includes(fm.type)) {
    const src = asList(fm.sources);
    if (!src.length) say(file, `sources é obrigatório em ${fm.type}`);
    for (const s of src) if (typeof s !== "object" || !s.id || !s.resource) say(file, "cada fonte precisa de id e resource");
  }
  if (fm.generated !== undefined) checkEvent(file, "generated", fm.generated);
  for (const v of asList(fm.verified)) checkEvent(file, "verified", v);
  if (NEEDS_STALE_AFTER.includes(fm.type) && !fm.stale_after) say(file, `stale_after é obrigatório em ${fm.type}`);
  if (fm.stale_after && !ISO.test(fm.stale_after)) say(file, `stale_after "${fm.stale_after}" não é data e hora ISO 8601 com fuso`);
}

function walk(dir) {
  const entries = readdirSync(dir);
  const docs = entries.filter((f) => f.endsWith(".md") && f !== "index.md" && f !== "log.md");
  const subdirs = entries.filter((f) => statSync(join(dir, f)).isDirectory());
  const indexFile = join(dir, "index.md");
  let index = "";
  try { index = readFileSync(indexFile, "utf8"); } catch { if (docs.length) say(indexFile, "falta o index.md: toda pasta com documentos tem um"); }
  if (index) {
    const fm = frontmatter(index);
    if (fm && (dir !== root || Object.keys(fm).some((k) => k !== "okf_version")))
      say(indexFile, "index.md não tem frontmatter (só o da raiz pode ter okf_version)");
  }
  for (const f of docs) {
    const file = join(dir, f);
    const fm = frontmatter(readFileSync(file, "utf8"));
    if (index && !index.includes(`](${f})`) && !index.includes(`](./${f})`)) say(file, `não está listado em ${relative(process.cwd(), indexFile)}`);
    checkFields(file, fm);
  }
  for (const d of subdirs) walk(join(dir, d));
}

walk(root);
for (const file of ROOT_FILES) {
  let text = null;
  try { text = readFileSync(file, "utf8"); } catch { continue; } // um arquivo que não existe não é cobrado
  checkFields(file, frontmatter(text));
}
if (problems.length) {
  console.error(`docs: ${problems.length} problema(s)\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`docs: todos os documentos de ${root}/ estão válidos`);
