export type Funcao = "comandante" | "copiloto" | "comissario";
export type TipoDocumento = "certificado_medico" | "habilitacao_de_tipo" | "treinamento_periodico";
export type Prontidao = "incompleto" | "bloqueado" | "nao_apto" | "apto_vence_em_breve" | "apto";

export interface Documento {
  tipo: TipoDocumento;
  validoAte: string;
  situacao: "ativo" | "suspenso";
}

const EXIGIDOS: Record<Funcao, TipoDocumento[]> = {
  comandante: ["certificado_medico", "habilitacao_de_tipo", "treinamento_periodico"],
  copiloto: ["certificado_medico", "habilitacao_de_tipo", "treinamento_periodico"],
  comissario: ["certificado_medico", "treinamento_periodico"],
};
const DIAS_PARA_VENCER_EM_BREVE = 30;
const MS_POR_DIA = 86_400_000;

const diasEntre = (de: string, ate: string) => (Date.parse(ate) - Date.parse(de)) / MS_POR_DIA;

/** Datas em AAAA-MM-DD. Vale a primeira situação que se aplica, na ordem da tabela do modelo 08. */
export function avaliarProntidao(funcao: Funcao, documentos: Documento[], dataDeReferencia: string): Prontidao {
  const presentes = EXIGIDOS[funcao].flatMap((tipo) => documentos.find((d) => d.tipo === tipo) ?? []);
  if (presentes.length < EXIGIDOS[funcao].length) return "incompleto";

  if (presentes.some((d) => d.situacao === "suspenso")) return "bloqueado";

  const dias = presentes.map((d) => diasEntre(dataDeReferencia, d.validoAte));
  if (dias.some((d) => d < 0)) return "nao_apto";
  if (dias.includes(0)) throw new Error("Documento vale até a data de referência: caso de borda a decidir na spec.");
  return Math.min(...dias) <= DIAS_PARA_VENCER_EM_BREVE ? "apto_vence_em_breve" : "apto";
}
