import { z } from "zod";

export const leitorSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .meta({ example: "Ana Souza" }),

  email: z
    .email("E-mail com formato inválido")
    .meta({ example: "ana@email.com" }),

  telefone: z
    .string({ error: "O telefone é obrigatório" })
    .regex(/^\d{10,11}$/, "O telefone deve ter 10 ou 11 números (com DDD)")
    .meta({ example: "11999998888" }),
});

export type LeitorInput = z.infer<typeof leitorSchema>;
export type Leitor = LeitorInput & { id: number };
