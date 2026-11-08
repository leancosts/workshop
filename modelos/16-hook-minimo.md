# Modelo: hook mínimo de formatação

Um ponto de partida para adaptar, não uma configuração pronta. O hook roda depois de cada edição do agente, lê do JSON que chega no stdin o caminho do arquivo editado e formata só esse arquivo. Ele nunca falha a ação do agente. No caso, `.claude/hooks/eslint-fix.mjs` faz o mesmo com o ESLint em arquivos `.ts` e `.tsx`.

Em `.claude/settings.json`, versionado com o repositório:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command", "command": "dotnet run \"$CLAUDE_PROJECT_DIR/.claude/hooks/formatar-arquivo.cs\"" }]
      }
    ]
  }
}
```

Em `.claude/hooks/formatar-arquivo.cs`:

```csharp
// Formata só o arquivo que o agente acabou de editar. Nunca falha a ação.
using System.Diagnostics;
using System.Text.Json.Nodes;

try
{
    var arquivo = JsonNode.Parse(Console.In.ReadToEnd())?["tool_input"]?["file_path"]?.GetValue<string>();
    if (arquivo?.EndsWith(".cs") == true)
    {
        using var processo = Process.Start("dotnet", ["format", "whitespace", "--folder", "--include", arquivo]);
        processo.WaitForExit();
    }
}
catch (Exception)
{
    // Um hook de formatação não interrompe o agente.
}

return 0;
```

Para adaptar:

- troque o `dotnet format` e a extensão pelo formatador do projeto (por exemplo, `ruff check --fix` para Python);
- `--folder` formata sem carregar a solução, e por isso responde em poucos segundos; as regras de estilo que dependem de compilação ficam para `dotnet run scripts/verificar.cs`;
- teste o hook à mão antes de versionar: desalinhe de propósito um arquivo `.cs` e rode `echo '{"tool_input":{"file_path":"src/Prontidao/Exemplo.cs"}}' | dotnet run .claude/hooks/formatar-arquivo.cs`, com o caminho desse arquivo. Confira que ele foi corrigido: o hook sai com 0 mesmo quando não formata nada.
