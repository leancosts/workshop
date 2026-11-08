// Teste de acesso antes do dia 1 (capítulo 13 do minibook). Só lê e roda os testes locais.
import { spawnSync } from "node:child_process";

const passos = [
  ["Node.js 22 ou mais novo", "node --version", (s) => Number(/v(\d+)/.exec(s)?.[1]) >= 22],
  ["git", "git --version"],
  ["Claude Code", "claude --version"],
  ["acesso ao repositório remoto", "git ls-remote origin HEAD"],
  ["instalar dependências", "npm ci"],
  ["lint, tipos e testes", "npm run verificar"],
];

let falhou = false;
for (const [nome, comando, confere] of passos) {
  const r = spawnSync(comando, { shell: true, encoding: "utf8" });
  const saida = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const ok = r.status === 0 && (!confere || confere(saida));
  console.log(`${ok ? "ok    " : "FALHOU"} ${nome}`);
  if (!ok) {
    falhou = true;
    console.log(`       comando: ${comando}\n${saida.trim().split("\n").slice(-5).join("\n")}`);
  }
}
console.log(falhou ? "\nAnote o que falhou na lista de obstáculos e avise os facilitadores." : "\nAmbiente pronto.");
process.exitCode = falhou ? 1 : 0;
