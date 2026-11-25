import * as emprestimoRepository from "../repositories/emprestimoRepository.js";
import * as livroRepository from "../repositories/livroRepository.js";
import * as leitorRepository from "../repositories/leitorRepository.js";
import { ErroDaApi } from "../config/erros.js";
import type { EmprestimoInput } from "@biblioteca/shared/emprestimo";

async function validarRegras(dados: EmprestimoInput) {
  const livro = await livroRepository.findById(dados.livroId);
  if (!livro) {
    throw new ErroDaApi(400, `Livro com ID ${dados.livroId} não encontrado`, "livroId");
  }
  const leitor = await leitorRepository.findById(dados.leitorId);
  if (!leitor) {
    throw new ErroDaApi(400, `Leitor com ID ${dados.leitorId} não encontrado`, "leitorId");
  }
}

export async function listar() {
  return await emprestimoRepository.findAll();
}

export async function buscarPorId(id: number) {
  return await emprestimoRepository.findById(id);
}

export async function criar(dados: EmprestimoInput) {
  await validarRegras(dados);
  return await emprestimoRepository.create(dados);
}

export async function atualizar(id: number, dados: EmprestimoInput) {
  const existe = await emprestimoRepository.findById(id);
  if (!existe) return null;
  await validarRegras(dados);
  return await emprestimoRepository.update(id, dados);
}

export async function remover(id: number) {
  const existe = await emprestimoRepository.findById(id);
  if (!existe) return false;
  await emprestimoRepository.remove(id);
  return true;
}
