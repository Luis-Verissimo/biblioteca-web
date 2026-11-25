import { Router } from "express";
import * as controller from "../controllers/leitorController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import { leitorSchema } from "@biblioteca/shared/leitor";

const router = Router();

router.get("/leitores", controller.listar);
router.get("/leitores/:id", controller.buscarPorId);
router.post("/leitores", validarBody(leitorSchema), controller.cadastrar);
router.put("/leitores/:id", validarBody(leitorSchema), controller.atualizar);
router.delete("/leitores/:id", controller.remover);

export default router;
