import { prisma } from "../config/prisma.js";
import type { EmprestimoInput } from "@biblioteca/shared/emprestimo";

const comLivroELeitor = {
  livro: { include: { autor: true } },
  leitor: true,
};

export async function findAll() {
  return await prisma.emprestimo.findMany({
    include: comLivroELeitor,
    orderBy: { id: "asc" },
  });
}

export async function findById(id: number) {
  return await prisma.emprestimo.findUnique({ where: { id }, include: comLivroELeitor });
}

export async function create(dados: EmprestimoInput) {
  return await prisma.emprestimo.create({ data: dados, include: comLivroELeitor });
}

export async function update(id: number, dados: EmprestimoInput) {
  return await prisma.emprestimo.update({ where: { id }, data: dados, include: comLivroELeitor });
}

export async function remove(id: number) {
  return await prisma.emprestimo.delete({ where: { id } });
}
