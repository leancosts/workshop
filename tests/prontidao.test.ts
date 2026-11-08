import { describe, expect, it } from "vitest";
import { avaliarProntidao, type Documento } from "../src/prontidao.js";

const hoje = "2026-11-10";
const doc = (tipo: Documento["tipo"], validoAte: string, situacao: Documento["situacao"] = "ativo"): Documento => ({
  tipo,
  validoAte,
  situacao,
});
const emDia = "2027-06-01";
const todos = [doc("certificado_medico", emDia), doc("habilitacao_de_tipo", emDia), doc("treinamento_periodico", emDia)];

describe("regra de prontidão", () => {
  it("falta um documento exigido: incompleto", () => {
    expect(avaliarProntidao("comissario", [doc("certificado_medico", emDia)], hoje)).toBe("incompleto");
  });

  it("algum documento suspenso: bloqueado", () => {
    expect(avaliarProntidao("comandante", [...todos.slice(1), doc("certificado_medico", emDia, "suspenso")], hoje)).toBe("bloqueado");
  });

  it("um documento venceu há 10 dias: não apto", () => {
    expect(avaliarProntidao("copiloto", [...todos.slice(1), doc("certificado_medico", "2026-10-31")], hoje)).toBe("nao_apto");
  });

  it("o primeiro a vencer vence em 20 dias: apto, vence em breve", () => {
    expect(avaliarProntidao("copiloto", [...todos.slice(1), doc("certificado_medico", "2026-11-30")], hoje)).toBe("apto_vence_em_breve");
  });

  it("todos vencem em mais de 30 dias: apto", () => {
    expect(avaliarProntidao("comandante", todos, hoje)).toBe("apto");
  });

  it("comissário não precisa de habilitação de tipo", () => {
    expect(avaliarProntidao("comissario", [todos[0]!, todos[2]!], hoje)).toBe("apto");
  });

  it("a borda ainda não foi decidida: a função recusa em vez de escolher um lado", () => {
    expect(() => avaliarProntidao("comandante", [...todos.slice(1), doc("certificado_medico", hoje)], hoje)).toThrow(/a decidir na spec/);
  });
});
