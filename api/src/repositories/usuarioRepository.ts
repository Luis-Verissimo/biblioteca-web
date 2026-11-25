import { prisma } from "../config/prisma.js";

export async function findByEmail(email: string) {
  return await prisma.usuario.findUnique({ where: { email } });
}

export async function findByEmailComSenha(email: string) {
  return await prisma.usuario.findUnique({
    where: { email },
    omit: { senha: false },
  });
}

export async function create(dados: { nome: string; email: string; senha: string }) {
  return await prisma.usuario.create({ data: dados });
}
