# Modelo: checagem do frontmatter de docs/

O script abaixo roda em Node e fica para o acompanhamento, fora dos laboratórios. Num repositório .NET, peça ao agente a mesma checagem em C#, num arquivo como `scripts/verificar.cs`.

Um portão para a base de conhecimento: um script em Node, sem dependências, que confere cada Markdown de `docs/` contra o padrão do método (OKF v0.2 mais a política local da empresa), lista cada problema com o arquivo e sai com erro quando há algum. Copie para `scripts/check-docs.mjs` e ajuste as listas do topo.

O que ele confere:

- todo documento (menos `index.md` e `log.md`) tem frontmatter, `type` da lista da empresa, `title`, `description` e `status` (`draft`, `stable` ou `deprecated`);
- Feature, Regra de Negócio e Decisão têm `sources`, cada fonte com `id` e `resource`;
- `generated` e cada `verified` têm `{ by, at }`, com `by` no formato `human:<id>`, `process:<id>` ou `<ferramenta>/<versão>` e `at` em ISO 8601 com fuso;
- Runbook tem `stale_after`, em ISO 8601 com fuso;
- `index.md` não tem frontmatter (só o da raiz pode ter `okf_version`), e todo documento da pasta está listado nele.

Um BOM UTF-8 no início do arquivo, comum em editores do Windows, é ignorado. `VISION.md`, `ARCHITECTURE.md` e `CLAUDE.md` ficam na raiz do repositório, fora de `docs/`, e não passam por este script.

```js
#!/usr/bin/env node
// Confere o frontmatter de todo Markdown em docs/ (OKF v0.2 mais a política local da empresa).
// Uso: node scripts/check-docs.mjs [docs]   sai com 1 e lista cada problema.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Política local: ajuste estas listas para a empresa.
const TYPES = ["Arquitetura", "Regra de Negócio", "Processo", "Feature", "Jornada", "Guia", "Conceito",
  "Runbook", "Decisão", "Glossário", "Spec", "Plano", "Pesquisa"];
const NEEDS_SOURCES = ["Feature", "Regra de Negócio", "Decisão", "Pesquisa"];
const NEEDS_STALE_AFTER = ["Runbook"];
const STATUS = ["draft", "stable", "deprecated"];
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
    if (!fm) { say(file, "sem bloco de frontmatter (--- na primeira linha)"); continue; }
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
  for (const d of subdirs) walk(join(dir, d));
}

walk(root);
if (problems.length) {
  console.error(`docs: ${problems.length} problema(s)\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`docs: todos os documentos de ${root}/ estão válidos`);
```

## No push

```sh
#!/bin/sh
# .githooks/pre-push (ative uma vez por clone: git config core.hooksPath .githooks)
node scripts/check-docs.mjs docs || exit 1
```

O mesmo comando roda no CI, para que um push que pulou o hook não passe. Quando a empresa muda a lista de tipos, muda o script e o capítulo da base de conhecimento no mesmo commit.

O script foi testado num conjunto de exemplos: documentos válidos passam, inclusive um arquivo com BOM; sem frontmatter, `type` fora da lista, `status` inválido, fonte sem `resource`, `generated` sem `{ by, at }`, data sem fuso e documento fora do índice são recusados, cada um com uma linha que diz o arquivo e o problema.
