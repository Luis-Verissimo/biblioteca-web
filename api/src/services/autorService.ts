import * as autorRepository from "../repositories/autorRepository.js";
import type { AutorInput } from "@biblioteca/shared/autor";

export async function listar() {
  return await autorRepository.findAll();
}

export async function buscarPorId(id: number) {
  return await autorRepository.findById(id);
}

export async function criar(dados: AutorInput) {
  return await autorRepository.create(dados);
}

export async function atualizar(id: number, dados: AutorInput) {
  const existe = await autorRepository.findById(id);
  if (!existe) return null;
  return await autorRepository.update(id, dados);
}

export async function remover(id: number) {
  const existe = await autorRepository.findById(id);
  if (!existe) return false;
  await autorRepository.remove(id);
  return true;
}
