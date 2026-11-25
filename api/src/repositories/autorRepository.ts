import { prisma } from "../config/prisma.js";
import type { AutorInput } from "@biblioteca/shared/autor";

export async function findAll() {
  return await prisma.autor.findMany({ orderBy: { id: "asc" } });
}

export async function findById(id: number) {
  return await prisma.autor.findUnique({ where: { id } });
}

export async function create(dados: AutorInput) {
  return await prisma.autor.create({ data: dados });
}

export async function update(id: number, dados: AutorInput) {
  return await prisma.autor.update({ where: { id }, data: dados });
}

export async function remove(id: number) {
  return await prisma.autor.delete({ where: { id } });
}
