namespace Prontidao;

public enum Funcao { Comandante, Copiloto, Comissario }

public enum TipoDocumento { CertificadoMedico, HabilitacaoDeTipo, TreinamentoPeriodico }

public enum Situacao { Ativo, Suspenso }

public enum EstadoProntidao { Incompleto, Bloqueado, NaoApto, AptoVenceEmBreve, Apto }

public sealed record Documento(TipoDocumento Tipo, DateOnly ValidoAte, Situacao Situacao);

public static class RegraDeProntidao
{
    private const int DiasParaVencerEmBreve = 30;

    private static readonly TipoDocumento[] DaCabine =
        [TipoDocumento.CertificadoMedico, TipoDocumento.HabilitacaoDeTipo, TipoDocumento.TreinamentoPeriodico];

    private static readonly TipoDocumento[] DoComissario =
        [TipoDocumento.CertificadoMedico, TipoDocumento.TreinamentoPeriodico];

    /// <summary>Vale a primeira situação que se aplica, na ordem da tabela do modelo 08.</summary>
    public static EstadoProntidao Avaliar(Funcao funcao, IEnumerable<Documento> documentos, DateOnly dataDeReferencia)
    {
        var exigidos = funcao == Funcao.Comissario ? DoComissario : DaCabine;
        var presentes = documentos.Where(d => exigidos.Contains(d.Tipo)).ToList();

        if (exigidos.Except(presentes.Select(d => d.Tipo)).Any())
        {
            return EstadoProntidao.Incompleto;
        }

        if (presentes.Any(d => d.Situacao == Situacao.Suspenso))
        {
            return EstadoProntidao.Bloqueado;
        }

        var dias = presentes.Select(d => d.ValidoAte.DayNumber - dataDeReferencia.DayNumber).ToList();
        if (dias.Any(d => d < 0))
        {
            return EstadoProntidao.NaoApto;
        }

        if (dias.Contains(0))
        {
            throw new InvalidOperationException("Documento vale até a data de referência: caso de borda a decidir na spec.");
        }

        return dias.Min() <= DiasParaVencerEmBreve ? EstadoProntidao.AptoVenceEmBreve : EstadoProntidao.Apto;
    }
}
