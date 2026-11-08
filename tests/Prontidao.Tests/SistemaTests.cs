namespace Prontidao.Tests;

public class SistemaTests
{
    [Fact]
    public void Os_testes_rodam_com_um_comando()
    {
        Assert.Equal("Prontidão da tripulação", Sistema.Nome);
    }
}
