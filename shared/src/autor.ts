import { z } from "zod";

export const autorSchema = z.object({
  nome: z
    .string({ error: "O nome é obrigatório" })
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .meta({ example: "Machado de Assis" }),

  nacionalidade: z
    .string({ error: "A nacionalidade é obrigatória" })
    .min(3, "A nacionalidade deve ter pelo menos 3 caracteres")
    .meta({ example: "Brasileira" }),
});

export type AutorInput = z.infer<typeof autorSchema>;

export type Autor = AutorInput & { id: number };
