import { Router } from "express";
import * as controller from "../controllers/livroController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import { livroSchema } from "@biblioteca/shared/livro";

const router = Router();

router.get("/livros", controller.listar);
router.get("/livros/:id", controller.buscarPorId);
router.post("/livros", validarBody(livroSchema), controller.cadastrar);
router.put("/livros/:id", validarBody(livroSchema), controller.atualizar);
router.delete("/livros/:id", controller.remover);

export default router;
