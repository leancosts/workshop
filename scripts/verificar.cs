// Formatação, build e testes com um comando: dotnet run scripts/verificar.cs
using System.Diagnostics;

string[] passos = ["format --verify-no-changes", "build", "test --no-build"];

foreach (var passo in passos)
{
    Console.WriteLine($"> dotnet {passo}");
    using var processo = Process.Start("dotnet", passo);
    processo.WaitForExit();
    if (processo.ExitCode != 0)
    {
        Console.WriteLine($"FALHOU: dotnet {passo}");
        return processo.ExitCode;
    }
}

Console.WriteLine("Tudo verde.");
return 0;
