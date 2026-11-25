import { z } from "zod";
import type { Autor } from "./autor.ts";

export const livroSchema = z.object({
  titulo: z
    .string({ error: "O título é obrigatório" })
    .min(2, "O título deve ter pelo menos 2 caracteres")
    .max(150, "O título deve ter no máximo 150 caracteres")
    .meta({ example: "Dom Casmurro" }),

  isbn: z
    .string({ error: "O ISBN é obrigatório" })
    .regex(/^\d{13}$/, "O ISBN deve ter exatamente 13 números")
    .meta({ example: "9788535910663" }),

  ano: z
    .number({ error: "O ano é obrigatório" })
    .int("O ano deve ser um número inteiro")
    .min(1000, "Ano inválido")
    .max(2100, "Ano inválido")
    .meta({ example: 1899 }),

  autorId: z
    .number({ error: "O autor é obrigatório" })
    .int("O ID do autor deve ser um número inteiro")
    .positive("O ID do autor deve ser maior que zero")
    .meta({ example: 1 }),
});

export type LivroInput = z.infer<typeof livroSchema>;

export type Livro = LivroInput & { id: number; autor: Autor };
