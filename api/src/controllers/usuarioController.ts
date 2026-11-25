import type { Request, Response } from "express";
import * as service from "../services/usuarioService.js";
import type { CadastroUsuarioInput, LoginInput } from "@biblioteca/shared/usuario";

export async function cadastrar(req: Request, res: Response) {
  const dados: CadastroUsuarioInput = req.body;
  const usuario = await service.cadastrar(dados);
  return res.status(201).json(usuario);
}

export async function login(req: Request, res: Response) {
  const dados: LoginInput = req.body;
  const usuario = await service.autenticar(dados);
  if (!usuario) {
    return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
  }
  return res.json(usuario);
}
