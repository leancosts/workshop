# Modelo: hook mínimo de lint

Um ponto de partida para adaptar, não uma configuração pronta. O hook roda depois de cada edição do agente, lê do JSON que chega no stdin o caminho do arquivo editado e roda o linter do projeto só nesse arquivo. Ele nunca falha a ação do agente: sai sempre com 0. No caso, `.claude/hooks/eslint-fix.mjs` faz o mesmo com o ESLint em arquivos `.ts` e `.tsx`.

Em `.claude/settings.json`, versionado com o repositório:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/lint-arquivo.mjs\"" }]
      }
    ]
  }
}
```

Em `.claude/hooks/lint-arquivo.mjs`:

```js
// Roda o linter só no arquivo que o agente acabou de editar. Nunca falha a ação.
import { spawnSync } from "node:child_process";
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let file = "";
  try { file = JSON.parse(raw)?.tool_input?.file_path ?? ""; } catch { process.exit(0); }
  if (/\.(js|jsx|ts|tsx)$/.test(file)) spawnSync("npx", ["eslint", "--fix", file], { stdio: "ignore" });
  process.exit(0);
});
```

Para adaptar:

- troque `npx eslint --fix` e a lista de extensões pelo linter do projeto (por exemplo, `ruff check --fix` para Python);
- no Windows, chame `npx.cmd` no lugar de `npx`;
- teste o hook à mão antes de versionar: `echo '{"tool_input":{"file_path":"src/a.ts"}}' | node .claude/hooks/lint-arquivo.mjs`.
