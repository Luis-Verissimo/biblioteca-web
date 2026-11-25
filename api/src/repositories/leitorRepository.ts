import { prisma } from "../config/prisma.js";
import type { LeitorInput } from "@biblioteca/shared/leitor";

export async function findAll() {
  return await prisma.leitor.findMany({ orderBy: { id: "asc" } });
}

export async function findById(id: number) {
  return await prisma.leitor.findUnique({ where: { id } });
}

export async function findByEmail(email: string) {
  return await prisma.leitor.findUnique({ where: { email } });
}

export async function create(dados: LeitorInput) {
  return await prisma.leitor.create({ data: dados });
}

export async function update(id: number, dados: LeitorInput) {
  return await prisma.leitor.update({ where: { id }, data: dados });
}

export async function remove(id: number) {
  return await prisma.leitor.delete({ where: { id } });
}
