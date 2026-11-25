import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z, type ZodType } from "zod";
import { autorSchema } from "@biblioteca/shared/autor";
import { livroSchema } from "@biblioteca/shared/livro";
import { leitorSchema } from "@biblioteca/shared/leitor";
import { emprestimoSchema } from "@biblioteca/shared/emprestimo";
import {
  cadastroUsuarioSchema,
  loginSchema,
  usuarioSchema,
} from "@biblioteca/shared/usuario";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

const idParam = z.object({
  id: z.coerce.number().openapi({ example: 1, description: "ID numérico" }),
});

const jsonBody = (schema: ZodType) => ({
  content: { "application/json": { schema } },
});

const jsonResponse = (description: string, schema?: ZodType) => ({
  description,
  ...(schema ? jsonBody(schema) : {}),
});

function registrarCrud(tag: string, path: string, nomeModelo: string, schema: ZodType) {
  const model = registry.register(
    nomeModelo,
    (schema as any).extend({ id: z.number().openapi({ example: 1 }) }),
  );

  registry.registerPath({
    method: "get",
    path,
    summary: `Lista ${tag.toLowerCase()}`,
    tags: [tag],
    responses: { 200: jsonResponse("Lista retornada", z.array(model)) },
  });

  registry.registerPath({
    method: "get",
    path: `${path}/{id}`,
    summary: `Busca por ID`,
    tags: [tag],
    request: { params: idParam },
    responses: {
      200: jsonResponse("Encontrado", model),
      404: jsonResponse("Não encontrado"),
    },
  });

  registry.registerPath({
    method: "post",
    path,
    summary: `Cadastra`,
    tags: [tag],
    request: { body: jsonBody(schema) },
    responses: {
      201: jsonResponse("Cadastrado com sucesso", model),
      400: jsonResponse("Erro de validação"),
      409: jsonResponse("Valor repetido em campo único"),
    },
  });

  registry.registerPath({
    method: "put",
    path: `${path}/{id}`,
    summary: `Atualiza`,
    tags: [tag],
    request: { params: idParam, body: jsonBody(schema) },
    responses: {
      200: jsonResponse("Atualizado com sucesso", model),
      400: jsonResponse("Erro de validação"),
      404: jsonResponse("Não encontrado"),
      409: jsonResponse("Valor repetido em campo único"),
    },
  });

  registry.registerPath({
    method: "delete",
    path: `${path}/{id}`,
    summary: `Remove`,
    tags: [tag],
    request: { params: idParam },
    responses: {
      204: jsonResponse("Removido com sucesso"),
      404: jsonResponse("Não encontrado"),
    },
  });
}

registrarCrud("Autores", "/autores", "Autor", autorSchema);
registrarCrud("Livros", "/livros", "Livro", livroSchema);
registrarCrud("Leitores", "/leitores", "Leitor", leitorSchema);
registrarCrud("Empréstimos", "/emprestimos", "Emprestimo", emprestimoSchema);

const usuarioModel = registry.register(
  "Usuario",
  usuarioSchema.extend({ id: z.number().openapi({ example: 1 }) }),
);

registry.registerPath({
  method: "post",
  path: "/usuarios",
  summary: "Cadastra um usuário (senha guardada com bcrypt)",
  tags: ["Usuários"],
  request: { body: jsonBody(cadastroUsuarioSchema) },
  responses: {
    201: jsonResponse("Cadastrado (sem a senha na resposta)", usuarioModel),
    400: jsonResponse("Erro de validação"),
    409: jsonResponse("E-mail já cadastrado"),
  },
});

registry.registerPath({
  method: "post",
  path: "/auth/login",
  summary: "Login por e-mail e senha",
  tags: ["Usuários"],
  request: { body: jsonBody(loginSchema) },
  responses: {
    200: jsonResponse("Login realizado (sem a senha na resposta)", usuarioModel),
    400: jsonResponse("Erro de validação"),
    401: jsonResponse("E-mail ou senha inválidos"),
  },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const swaggerSpec = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API Biblioteca",
    version: "1.0.0",
    description: "Documentação gerada a partir dos schemas do Zod (pacote shared).",
  },
  servers: [{ url: "http://localhost:3000", description: "Servidor local" }],
});
