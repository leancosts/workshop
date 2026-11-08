namespace Prontidao.Tests;

public class RegraDeProntidaoTests
{
    private static readonly DateOnly Hoje = new(2026, 11, 10);
    private static readonly DateOnly EmDia = new(2027, 6, 1);

    private static Documento Doc(TipoDocumento tipo, DateOnly validoAte, Situacao situacao = Situacao.Ativo) =>
        new(tipo, validoAte, situacao);

    private static List<Documento> TodosComMedicoAte(DateOnly validade, Situacao situacao = Situacao.Ativo) =>
    [
        Doc(TipoDocumento.CertificadoMedico, validade, situacao),
        Doc(TipoDocumento.HabilitacaoDeTipo, EmDia),
        Doc(TipoDocumento.TreinamentoPeriodico, EmDia),
    ];

    [Fact]
    public void Falta_um_documento_exigido_incompleto()
    {
        var documentos = new[] { Doc(TipoDocumento.CertificadoMedico, EmDia) };
        Assert.Equal(EstadoProntidao.Incompleto, RegraDeProntidao.Avaliar(Funcao.Comissario, documentos, Hoje));
    }

    [Fact]
    public void Algum_documento_suspenso_bloqueado()
    {
        var documentos = TodosComMedicoAte(EmDia, Situacao.Suspenso);
        Assert.Equal(EstadoProntidao.Bloqueado, RegraDeProntidao.Avaliar(Funcao.Comandante, documentos, Hoje));
    }

    [Fact]
    public void Um_documento_venceu_ha_10_dias_nao_apto()
    {
        var documentos = TodosComMedicoAte(Hoje.AddDays(-10));
        Assert.Equal(EstadoProntidao.NaoApto, RegraDeProntidao.Avaliar(Funcao.Copiloto, documentos, Hoje));
    }

    [Fact]
    public void O_primeiro_a_vencer_vence_em_20_dias_apto_vence_em_breve()
    {
        var documentos = TodosComMedicoAte(Hoje.AddDays(20));
        Assert.Equal(EstadoProntidao.AptoVenceEmBreve, RegraDeProntidao.Avaliar(Funcao.Copiloto, documentos, Hoje));
    }

    [Fact]
    public void Todos_vencem_em_mais_de_30_dias_apto()
    {
        Assert.Equal(EstadoProntidao.Apto, RegraDeProntidao.Avaliar(Funcao.Comandante, TodosComMedicoAte(EmDia), Hoje));
    }

    [Fact]
    public void Comissario_nao_precisa_de_habilitacao_de_tipo()
    {
        var documentos = new[] { Doc(TipoDocumento.CertificadoMedico, EmDia), Doc(TipoDocumento.TreinamentoPeriodico, EmDia) };
        Assert.Equal(EstadoProntidao.Apto, RegraDeProntidao.Avaliar(Funcao.Comissario, documentos, Hoje));
    }

    [Fact]
    public void A_borda_ainda_nao_foi_decidida_a_regra_recusa_em_vez_de_escolher_um_lado()
    {
        var erro = Assert.Throws<InvalidOperationException>(() =>
            RegraDeProntidao.Avaliar(Funcao.Comandante, TodosComMedicoAte(Hoje), Hoje));
        Assert.Contains("a decidir na spec", erro.Message);
    }
}
