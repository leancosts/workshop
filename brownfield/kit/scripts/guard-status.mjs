#!/usr/bin/env node
// Hook PreToolUse do Claude Code (Edit, Write, MultiEdit e Bash): impede o agente de colocar "status: stable" num
// documento Markdown. Só uma pessoa muda o status para stable, no editor. Sem dependências. Qualquer entrada
// inesperada termina com 0 (o hook nunca trava o trabalho por causa de um JSON que ele não entende).
// Entrada (stdin): JSON com tool_name e tool_input (file_path e content, ou old_string e new_string, ou edits, ou,
// no Bash, command).
// Saída: código 2 e a mensagem em stderr quando a escrita faz o status passar a stable; 0 nos demais casos.
// Write, Edit e MultiEdit: o hook monta o arquivo como ficaria (lê o atual, aplica as trocas) e compara o status do
// frontmatter antes e depois; trocar só a palavra draft por stable também é recusado.
// Bash: o comando é recusado quando escreve em arquivo (sed -i, perl -i, tee, redirecionamento, um interpretador como
// python ou node) e contém "status: stable" ou troca draft por stable num .md; um comando que só lê passa. A mensagem
// de um git commit não conta, e cada parte de um comando (separada por &&, || ou ;) é julgada à parte.
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

const STABLE = /^status:[ \t]*["']?stable["']?[ \t]*\r?$/m;
const MESSAGE = "Só uma pessoa muda o status para stable. Peça a alguém do time que leia o documento e mude a linha no editor.";

const BASH_STABLE = /status:[ \t]*["']?stable/i;
// "draft" seguido de "stable" logo depois (s/draft/stable/, replace("draft", "stable"), -replace 'draft','stable'), num .md.
const BASH_SWAP = /\bdraft\b[\s\S]{0,60}?\bstable\b/i;
// Redirecionamentos que não gravam em documento (2>&1, 2>/dev/null) saem antes de procurar um ">" de gravação.
const HARMLESS_REDIRECT = /\d*>&\d+|&?\d*>>?[ \t]*\/dev\/null/g;
const COMMIT_MESSAGE = /(?:^|\s)(?:-[a-zA-Z]*m|--message)(?:[ \t]+|=)(?:"(?:[^"\\]|\\.)*"|'[^']*')/g;
const BASH_WRITES = [
  /\bsed\b[^|;&\n]*\s(?:-[a-zA-Z]*i|--in-place)/,
  /\bperl\b[^|;&\n]*\s-[a-zA-Z]*i/,
  /\bawk\b[^|;&\n]*\s-i\s*inplace/,
  /\btee\b/,
  /\b(?:python3?|py|node|ruby|php|pwsh|powershell)\b/,
  /\b(?:Set-Content|Add-Content|Out-File|WriteAllText)\b|-replace\b/i,
  /(?<![=<>-])>(?![=&])/
];

const text = (v) => (typeof v === "string" ? v : "");
const frontmatter = (s) => /^﻿?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(s)?.[1] ?? "";
const stableOf = (s) => STABLE.test(frontmatter(s));

// Parte o comando em &&, || e ; fora de aspas. Com um heredoc, a quebra de linha não separa (o corpo é do comando).
function segments(command) {
  const parts = [];
  const breakOnNewline = !command.includes("<<");
  let cur = "";
  let quote = "";
  for (let i = 0; i < command.length; i++) {
    const c = command[i];
    if (quote) {
      cur += c;
      if (c === "\\" && quote === '"' && i + 1 < command.length) cur += command[++i];
      else if (c === quote) quote = "";
      continue;
    }
    if (c === '"' || c === "'") { quote = c; cur += c; continue; }
    const two = command.slice(i, i + 2);
    if (two === "&&" || two === "||") { parts.push(cur); cur = ""; i++; continue; }
    if (c === ";" || (c === "\n" && breakOnNewline)) { parts.push(cur); cur = ""; continue; }
    cur += c;
  }
  parts.push(cur);
  return parts;
}

// Um .md em .tmp/ (a descrição de um pull request, um roteiro) não é documento da base: pode citar a linha do status.
const inTmp = (path) => /(^|[\\/])\.tmp[\\/]/.test(path);

function segmentIntroduces(segment) {
  const clean = segment.replace(COMMIT_MESSAGE, " ").replace(HARMLESS_REDIRECT, "");
  const mds = clean.match(/[\w.\\/-]+\.md\b/gi) ?? [];
  if (mds.length && mds.every(inTmp)) return false;
  const names = BASH_STABLE.test(clean) || (BASH_SWAP.test(clean) && /\.md\b/i.test(clean));
  return names && BASH_WRITES.some((w) => w.test(clean));
}

const bashIntroduces = (input) => segments(text(input.command)).some(segmentIntroduces);

function applyEdit(content, e, replaceAll) {
  const from = text(e.old_string);
  if (!from || !content.includes(from)) return null;
  const to = text(e.new_string);
  return replaceAll ? content.split(from).join(to) : content.replace(from, () => to);
}

function introduces(input, base) {
  const path = text(input.file_path);
  if (!/\.md$/i.test(path) || inTmp(path)) return false;
  const file = isAbsolute(path) ? path : resolve(base, path);
  let before = null;
  try { if (existsSync(file)) before = readFileSync(file, "utf8"); } catch { /* arquivo ilegível: conta como inexistente */ }
  if (typeof input.content === "string") return stableOf(input.content) && !stableOf(before ?? "");
  const edits = Array.isArray(input.edits) ? input.edits : [input];
  let content = before;
  for (const e of edits) {
    if (!e) continue;
    const next = content === null ? null : applyEdit(content, e, e.replace_all === true || input.replace_all === true);
    if (next === null) {
      // Sem arquivo para conferir (ou a troca não casa): só o texto da própria edição vale.
      if (STABLE.test(text(e.new_string)) && !STABLE.test(text(e.old_string))) return true;
      continue;
    }
    content = next;
  }
  return content !== null && stableOf(content) && !stableOf(before ?? "");
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let call = null;
  try { call = JSON.parse(raw); } catch { /* JSON inesperado */ }
  let blocked = false;
  try {
    if (call && typeof call.tool_input === "object" && call.tool_input) {
      blocked =
        call.tool_name === "Bash"
          ? bashIntroduces(call.tool_input)
          : introduces(call.tool_input, text(call.cwd) || process.env.CLAUDE_PROJECT_DIR || process.cwd());
    }
  } catch { /* qualquer falha: deixa passar */ }
  if (blocked) {
    process.stderr.write(MESSAGE + "\n");
    process.exit(2);
  }
  process.exit(0);
});
