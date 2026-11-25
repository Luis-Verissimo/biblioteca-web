import { Router } from "express";
import * as controller from "../controllers/emprestimoController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import { emprestimoSchema } from "@biblioteca/shared/emprestimo";

const router = Router();

router.get("/emprestimos", controller.listar);
router.get("/emprestimos/:id", controller.buscarPorId);
router.post("/emprestimos", validarBody(emprestimoSchema), controller.cadastrar);
router.put("/emprestimos/:id", validarBody(emprestimoSchema), controller.atualizar);
router.delete("/emprestimos/:id", controller.remover);

export default router;
