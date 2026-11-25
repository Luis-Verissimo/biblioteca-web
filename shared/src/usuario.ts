import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .meta({ example: "Professor" }),

  email: z
    .email("E-mail com formato inválido")
    .meta({ example: "professor@biblioteca.com" }),
});

export const cadastroUsuarioSchema = usuarioSchema.extend({
  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres")
    .meta({ example: "senha1234" }),
});

export const loginSchema = z.object({
  email: z
    .email("E-mail com formato inválido")
    .meta({ example: "professor@biblioteca.com" }),

  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .meta({ example: "senha1234" }),
});

export type CadastroUsuarioInput = z.infer<typeof cadastroUsuarioSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type Usuario = z.infer<typeof usuarioSchema> & { id: number };
