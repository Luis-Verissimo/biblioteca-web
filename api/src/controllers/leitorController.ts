import type { Request, Response } from "express";
import * as service from "../services/leitorService.js";
import type { LeitorInput } from "@biblioteca/shared/leitor";

export async function listar(req: Request, res: Response) {
  const lista = await service.listar();
  return res.json(lista);
}

export async function buscarPorId(req: Request, res: Response) {
  const id = Number(req.params.id);
  const registro = await service.buscarPorId(id);
  if (!registro) {
    return res.status(404).json({ mensagem: "Leitor não encontrado" });
  }
  return res.json(registro);
}

export async function cadastrar(req: Request, res: Response) {
  const dados: LeitorInput = req.body;
  const registro = await service.criar(dados);
  return res.status(201).json(registro);
}

export async function atualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const dados: LeitorInput = req.body;
  const registro = await service.atualizar(id, dados);
  if (!registro) {
    return res.status(404).json({ mensagem: "Leitor não encontrado" });
  }
  return res.json(registro);
}

export async function remover(req: Request, res: Response) {
  const id = Number(req.params.id);
  const removido = await service.remover(id);
  if (!removido) {
    return res.status(404).json({ mensagem: "Leitor não encontrado" });
  }
  return res.status(204).send();
}
