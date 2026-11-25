import bcrypt from "bcryptjs";
import * as usuarioRepository from "../repositories/usuarioRepository.js";
import { ErroDaApi } from "../config/erros.js";
import type { CadastroUsuarioInput, LoginInput } from "@biblioteca/shared/usuario";

export async function cadastrar(dados: CadastroUsuarioInput) {
  const existente = await usuarioRepository.findByEmail(dados.email);
  if (existente) {
    throw new ErroDaApi(409, "Já existe um usuário com este e-mail", "email");
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  return await usuarioRepository.create({ ...dados, senha: senhaHash });
}

export async function autenticar({ email, senha }: LoginInput) {
  const usuario = await usuarioRepository.findByEmailComSenha(email);
  if (!usuario) return null;

  const senhaConfere = await bcrypt.compare(senha, usuario.senha);
  if (!senhaConfere) return null;

  const { senha: _, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}
