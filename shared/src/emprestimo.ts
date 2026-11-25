import { z } from "zod";
import type { Livro } from "./livro.ts";
import type { Leitor } from "./leitor.ts";

const formatoData = /^\d{2}\/\d{2}\/\d{4}$/;

export const emprestimoSchema = z.object({
  dataEmprestimo: z
    .string({ error: "A data do empréstimo é obrigatória" })
    .regex(formatoData, "A data deve estar no formato DD/MM/AAAA")
    .meta({ example: "10/11/2026" }),

  dataDevolucao: z
    .string({ error: "A data de devolução é obrigatória" })
    .regex(formatoData, "A data deve estar no formato DD/MM/AAAA")
    .meta({ example: "24/11/2026" }),

  livroId: z
    .number({ error: "O livro é obrigatório" })
    .int("O ID do livro deve ser um número inteiro")
    .positive("O ID do livro deve ser maior que zero")
    .meta({ example: 1 }),

  leitorId: z
    .number({ error: "O leitor é obrigatório" })
    .int("O ID do leitor deve ser um número inteiro")
    .positive("O ID do leitor deve ser maior que zero")
    .meta({ example: 1 }),
});

export type EmprestimoInput = z.infer<typeof emprestimoSchema>;

export type Emprestimo = EmprestimoInput & { id: number; livro: Livro; leitor: Leitor };
