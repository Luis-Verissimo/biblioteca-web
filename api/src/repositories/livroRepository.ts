import { prisma } from "../config/prisma.js";
import type { LivroInput } from "@biblioteca/shared/livro";

export async function findAll() {
  return await prisma.livro.findMany({
    include: { autor: true },
    orderBy: { id: "asc" },
  });
}

export async function findById(id: number) {
  return await prisma.livro.findUnique({ where: { id }, include: { autor: true } });
}

export async function findByIsbn(isbn: string) {
  return await prisma.livro.findUnique({ where: { isbn } });
}

export async function create(dados: LivroInput) {
  return await prisma.livro.create({ data: dados, include: { autor: true } });
}

export async function update(id: number, dados: LivroInput) {
  return await prisma.livro.update({ where: { id }, data: dados, include: { autor: true } });
}

export async function remove(id: number) {
  return await prisma.livro.delete({ where: { id } });
}
