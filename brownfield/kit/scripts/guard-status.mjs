#!/usr/bin/env node
// Hook PreToolUse do Claude Code (Edit, Write, MultiEdit): impede o agente de escrever "status: stable" num
// documento Markdown. Só uma pessoa muda o status para stable, no editor. Sem dependências. Qualquer entrada
// inesperada termina com 0 (o hook nunca trava o trabalho por causa de um JSON que ele não entende).
// Entrada (stdin): JSON com tool_name e tool_input (file_path e content, ou old_string e new_string, ou edits).
// Saída: código 2 e a mensagem em stderr quando a escrita introduz a linha; 0 nos demais casos.
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";

const STABLE = /^status:[ \t]*["']?stable["']?[ \t]*\r?$/m;
const MESSAGE = "Só uma pessoa muda o status para stable. Peça a alguém do time que leia o documento e mude a linha no editor.";

const text = (v) => (typeof v === "string" ? v : "");
const frontmatter = (s) => /^﻿?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(s)?.[1] ?? "";

function introduces(input, base) {
  const path = text(input.file_path);
  if (!/\.md$/i.test(path)) return false;
  if (typeof input.content === "string") {
    if (!STABLE.test(frontmatter(input.content))) return false;
    const file = isAbsolute(path) ? path : resolve(base, path);
    let before = "";
    try { if (existsSync(file)) before = readFileSync(file, "utf8"); } catch { /* arquivo ilegível: conta como inexistente */ }
    return !STABLE.test(frontmatter(before));
  }
  const edits = Array.isArray(input.edits) ? input.edits : [input];
  return edits.some((e) => e && STABLE.test(text(e.new_string)) && !STABLE.test(text(e.old_string)));
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
      blocked = introduces(call.tool_input, text(call.cwd) || process.env.CLAUDE_PROJECT_DIR || process.cwd());
    }
  } catch { /* qualquer falha: deixa passar */ }
  if (blocked) {
    process.stderr.write(MESSAGE + "\n");
    process.exit(2);
  }
  process.exit(0);
});
