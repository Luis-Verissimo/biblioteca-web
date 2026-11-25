import { Router } from "express";
import * as controller from "../controllers/autorController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import { autorSchema } from "@biblioteca/shared/autor";

const router = Router();

router.get("/autores", controller.listar);
router.get("/autores/:id", controller.buscarPorId);
router.post("/autores", validarBody(autorSchema), controller.cadastrar);
router.put("/autores/:id", validarBody(autorSchema), controller.atualizar);
router.delete("/autores/:id", controller.remover);

export default router;
