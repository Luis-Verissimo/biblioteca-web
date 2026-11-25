import axios from "axios";
import type { ZodError } from "zod";

export type ErrosDosCampos = Record<string, string>;

export function errosDoZod(erro: ZodError): ErrosDosCampos {
  const erros: ErrosDosCampos = {};
  for (const issue of erro.issues) {
    erros[String(issue.path[0])] = issue.message;
  }
  return erros;
}

export function errosDaApi(e: unknown): { mensagem: string; campos: ErrosDosCampos } {
  if (axios.isAxiosError(e) && e.response) {
    const dados = e.response.data;
    const campos: ErrosDosCampos = {};
    for (const detalhe of dados.detalhes ?? []) {
      campos[detalhe.campo] = detalhe.mensagem;
    }
    return { mensagem: dados.mensagem ?? "Erro na API", campos };
  }
  return { mensagem: "Não foi possível conectar à API. Ela está rodando?", campos: {} };
}
