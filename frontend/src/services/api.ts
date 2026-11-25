import axios from "axios";
import type { Autor, AutorInput } from "@biblioteca/shared/autor";
import type { Livro, LivroInput } from "@biblioteca/shared/livro";
import type { Leitor, LeitorInput } from "@biblioteca/shared/leitor";
import type { Emprestimo, EmprestimoInput } from "@biblioteca/shared/emprestimo";
import type { CadastroUsuarioInput, LoginInput, Usuario } from "@biblioteca/shared/usuario";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export async function login(dados: LoginInput): Promise<Usuario> {
  const resposta = await api.post("/auth/login", dados);
  return resposta.data;
}

export async function cadastrarUsuario(dados: CadastroUsuarioInput): Promise<Usuario> {
  const resposta = await api.post("/usuarios", dados);
  return resposta.data;
}

export async function listarAutores(): Promise<Autor[]> {
  const resposta = await api.get("/autores");
  return resposta.data;
}
export async function criarAutor(dados: AutorInput): Promise<Autor> {
  const resposta = await api.post("/autores", dados);
  return resposta.data;
}
export async function editarAutor(id: number, dados: AutorInput): Promise<Autor> {
  const resposta = await api.put(`/autores/${id}`, dados);
  return resposta.data;
}
export async function removerAutor(id: number): Promise<void> {
  await api.delete(`/autores/${id}`);
}

export async function listarLivros(): Promise<Livro[]> {
  const resposta = await api.get("/livros");
  return resposta.data;
}
export async function criarLivro(dados: LivroInput): Promise<Livro> {
  const resposta = await api.post("/livros", dados);
  return resposta.data;
}
export async function editarLivro(id: number, dados: LivroInput): Promise<Livro> {
  const resposta = await api.put(`/livros/${id}`, dados);
  return resposta.data;
}
export async function removerLivro(id: number): Promise<void> {
  await api.delete(`/livros/${id}`);
}

export async function listarLeitores(): Promise<Leitor[]> {
  const resposta = await api.get("/leitores");
  return resposta.data;
}
export async function criarLeitor(dados: LeitorInput): Promise<Leitor> {
  const resposta = await api.post("/leitores", dados);
  return resposta.data;
}
export async function editarLeitor(id: number, dados: LeitorInput): Promise<Leitor> {
  const resposta = await api.put(`/leitores/${id}`, dados);
  return resposta.data;
}
export async function removerLeitor(id: number): Promise<void> {
  await api.delete(`/leitores/${id}`);
}

export async function listarEmprestimos(): Promise<Emprestimo[]> {
  const resposta = await api.get("/emprestimos");
  return resposta.data;
}
export async function criarEmprestimo(dados: EmprestimoInput): Promise<Emprestimo> {
  const resposta = await api.post("/emprestimos", dados);
  return resposta.data;
}
export async function editarEmprestimo(id: number, dados: EmprestimoInput): Promise<Emprestimo> {
  const resposta = await api.put(`/emprestimos/${id}`, dados);
  return resposta.data;
}
export async function removerEmprestimo(id: number): Promise<void> {
  await api.delete(`/emprestimos/${id}`);
}
