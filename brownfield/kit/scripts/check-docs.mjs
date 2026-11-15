#!/usr/bin/env node
// Confere o frontmatter de todo Markdown em docs/ (OKF v0.2 mais a política local da empresa), que cada caminho de
// sources existe, que nenhum documento cita número de linha e que nenhum marcador ficou sem preencher.
// Uso: node scripts/check-docs.mjs [docs]   sai com 1 e lista cada problema.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Política local: ajuste estas listas para a empresa.
const TYPES = ["Arquitetura", "Regra de Negócio", "Processo", "Feature", "Jornada", "Guia", "Conceito",
  "Runbook", "Decisão", "Glossário", "Spec", "Plano", "Pesquisa", "PRD", "Visão", "Design"];
const NEEDS_SOURCES = ["Feature", "Regra de Negócio", "Decisão", "Pesquisa", "Arquitetura", "Visão"];
const NEEDS_STALE_AFTER = ["Runbook"];
const STATUS = ["draft", "stable", "deprecated"];
// Arquivos da raiz que levam o mesmo bloco. Vazio: nenhum. Num legado, onde eles também nascem gerados por
// agente: ["VISION.md", "ARCHITECTURE.md", "DESIGN.md"].
const ROOT_FILES = ["VISION.md", "ARCHITECTURE.md", "DESIGN.md"];
// Documentos sem frontmatter, conferidos só nas checagens de texto (número de linha e marcador esquecido).
const TEXT_FILES = ["CLAUDE.md", "README.md"];
// Número de linha numa citação: arquivo.ext:123, arquivo.ext#L123, arquivo.ext, linha 123, arquivo.ext (linha 123),
// arquivo.ext, l. 123 ou linha 123 de arquivo.ext (também linhas 10 a 20). A linha muda a cada commit.
const EXT = "(?:js|jsx|ts|tsx|mjs|cjs|py|rb|java|kt|go|rs|cs|php|sql|pks|pkb|pls|sh|md|ya?ml|json|xml|html|css|csv|conf|properties)";
const FILE = String.raw`[\w./-]+\.${EXT}`;
const LINE_CITATION = new RegExp(
  String.raw`${FILE}[\x60'")]*(?::\d+|#L\d+|,?\s*\(?\s*(?:linhas?|l\.)\s*\d+)(?!\w)|\b(?:linhas?|l\.)\s*\d+(?:\s*(?:a|e|-)\s*\d+)?\s+(?:de|do|em)\s+${FILE}`,
  "i");
// Marcadores que um modelo ou um comando deixou no texto (fora de código inline e de blocos de código).
const LEFTOVERS = [
  [/"\+\w+\+"/, 'marcador de código esquecido ("+nome+")'],
  [/<preencha/i, "<preencha ...> sem preencher"],
  [/\bTODO:/, "TODO: esquecido"],
  [/\]\([^)]*NNN[^)]*\)/, "link com NNN no lugar do número"],
];
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

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

// Só um resource que parece caminho de arquivo do repositório é conferido: tem "/" ou termina numa extensão de arquivo.
// Fora disso: endereço, SHA de commit, nome de tabela ou de package, curinga, texto com espaço e caminho que sai do
// repositório ("../"). Um sufixo ":símbolo" (src/a.js:emitir) sai antes de conferir.
function checkSourcePath(file, resource) {
  const path = resource.split("#")[0].replace(/:[^\s/\\:]+$/, "");
  if (!path || /\s|[*?[\]{}]|^@|^\.\.\/|^[a-z][a-z0-9+.-]*:\/\/|^[a-z]+:[^/\\]/i.test(path)) return;
  if (!path.includes("/") && !new RegExp(`\\.${EXT}$`, "i").test(path)) return;
  if (!existsSync(path)) say(file, `sources aponta para "${resource}", que não existe no repositório`);
}

// As linhas de um texto fora dos blocos de código, com o número de cada uma.
function proseLines(text) {
  let fence = false;
  const out = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    else if (!fence) out.push([i + 1, line]);
  });
  return out;
}
function checkText(file, text) {
  for (const [n, line] of proseLines(text)) {
    if (LINE_CITATION.test(line)) say(file, `linha ${n}: citação com número de linha; cite o arquivo e a função, a tabela ou a rota`);
    for (const [re, what] of LEFTOVERS) if (re.test(line.replace(/`[^`]*`/g, ""))) say(file, `linha ${n}: ${what}`);
  }
}

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
  for (const s of asList(fm.sources)) if (typeof s === "object" && s.resource) checkSourcePath(file, String(s.resource));
  if (NEEDS_STALE_AFTER.includes(fm.type) && !fm.stale_after) say(file, `stale_after é obrigatório em ${fm.type}`);
  if (fm.stale_after && !ISO.test(fm.stale_after)) say(file, `stale_after "${fm.stale_after}" não é data e hora ISO 8601 com fuso`);
}

function walk(dir) {
  const entries = readdirSync(dir);
  const mds = entries.filter((f) => f.endsWith(".md"));
  const docs = mds.filter((f) => f !== "index.md" && f !== "log.md");
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
  for (const f of mds) {
    const file = join(dir, f);
    if (f.includes("NNN")) say(file, "o nome do arquivo tem NNN no lugar do número");
    checkText(file, readFileSync(file, "utf8"));
  }
  for (const d of subdirs) walk(join(dir, d));
}

walk(root);
for (const file of ROOT_FILES) {
  let text = null;
  try { text = readFileSync(file, "utf8"); } catch { continue; } // um arquivo que não existe não é cobrado
  checkFields(file, frontmatter(text));
  checkText(file, text);
}
for (const file of TEXT_FILES) {
  let text = null;
  try { text = readFileSync(file, "utf8"); } catch { continue; }
  checkText(file, text);
}
if (problems.length) {
  console.error(`docs: ${problems.length} problema(s)\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`docs: todos os documentos de ${root}/ estão válidos`);
