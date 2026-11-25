import * as livroRepository from "../repositories/livroRepository.js";
import * as autorRepository from "../repositories/autorRepository.js";
import { ErroDaApi } from "../config/erros.js";
import type { LivroInput } from "@biblioteca/shared/livro";

async function validarRegras(dados: LivroInput, idAtual?: number) {
  const autor = await autorRepository.findById(dados.autorId);
  if (!autor) {
    throw new ErroDaApi(400, `Autor com ID ${dados.autorId} não encontrado`, "autorId");
  }

  const dono = await livroRepository.findByIsbn(dados.isbn);
  if (dono && dono.id !== idAtual) {
    throw new ErroDaApi(409, "Já existe um livro com este ISBN", "isbn");
  }
}

export async function listar() {
  return await livroRepository.findAll();
}

export async function buscarPorId(id: number) {
  return await livroRepository.findById(id);
}

export async function criar(dados: LivroInput) {
  await validarRegras(dados);
  return await livroRepository.create(dados);
}

export async function atualizar(id: number, dados: LivroInput) {
  const existe = await livroRepository.findById(id);
  if (!existe) return null;
  await validarRegras(dados, id);
  return await livroRepository.update(id, dados);
}

export async function remover(id: number) {
  const existe = await livroRepository.findById(id);
  if (!existe) return false;
  await livroRepository.remove(id);
  return true;
}
