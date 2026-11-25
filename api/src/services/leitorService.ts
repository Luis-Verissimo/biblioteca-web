import * as leitorRepository from "../repositories/leitorRepository.js";
import { ErroDaApi } from "../config/erros.js";
import type { LeitorInput } from "@biblioteca/shared/leitor";

async function garantirEmailLivre(email: string, idAtual?: number) {
  const dono = await leitorRepository.findByEmail(email);
  if (dono && dono.id !== idAtual) {
    throw new ErroDaApi(409, "Já existe um leitor com este e-mail", "email");
  }
}

export async function listar() {
  return await leitorRepository.findAll();
}

export async function buscarPorId(id: number) {
  return await leitorRepository.findById(id);
}

export async function criar(dados: LeitorInput) {
  await garantirEmailLivre(dados.email);
  return await leitorRepository.create(dados);
}

export async function atualizar(id: number, dados: LeitorInput) {
  const existe = await leitorRepository.findById(id);
  if (!existe) return null;
  await garantirEmailLivre(dados.email, id);
  return await leitorRepository.update(id, dados);
}

export async function remover(id: number) {
  const existe = await leitorRepository.findById(id);
  if (!existe) return false;
  await leitorRepository.remove(id);
  return true;
}
