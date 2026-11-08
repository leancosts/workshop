// Teste de acesso antes do dia 1 (capítulo 13 do minibook): dotnet run scripts/checar-ambiente.cs
using System.Diagnostics;

(string Nome, string Comando)[] passos =
[
    ("git", "git --version"),
    ("Claude Code", "claude --version"),
    ("acesso ao repositório remoto", "git ls-remote origin HEAD"),
    ("formatação, build e testes", "dotnet run scripts/verificar.cs"),
];

var (shell, flag) = OperatingSystem.IsWindows() ? ("cmd", "/c") : ("sh", "-c");
var falhou = false;

Console.WriteLine($"ok     .NET {Environment.Version}");
foreach (var (nome, comando) in passos)
{
    var inicio = new ProcessStartInfo(shell) { RedirectStandardOutput = true, RedirectStandardError = true };
    inicio.ArgumentList.Add(flag);
    inicio.ArgumentList.Add(comando);
    using var processo = Process.Start(inicio)!;
    var saida = processo.StandardOutput.ReadToEndAsync();
    var erro = processo.StandardError.ReadToEndAsync();
    processo.WaitForExit();

    var ok = processo.ExitCode == 0;
    Console.WriteLine($"{(ok ? "ok    " : "FALHOU")} {nome}");
    if (!ok)
    {
        falhou = true;
        var linhas = $"{await saida}{await erro}".Trim().Split('\n');
        Console.WriteLine($"       comando: {comando}\n{string.Join('\n', linhas.TakeLast(5))}");
    }
}

Console.WriteLine(falhou ? "\nAnote o que falhou na lista de obstáculos e avise os facilitadores." : "\nAmbiente pronto.");
return falhou ? 1 : 0;
