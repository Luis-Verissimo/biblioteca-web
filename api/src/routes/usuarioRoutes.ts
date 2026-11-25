import { Router } from "express";
import * as controller from "../controllers/usuarioController.js";
import { validarBody } from "../middlewares/validarSchema.js";
import { cadastroUsuarioSchema, loginSchema } from "@biblioteca/shared/usuario";

const router = Router();

router.post("/usuarios", validarBody(cadastroUsuarioSchema), controller.cadastrar);
router.post("/auth/login", validarBody(loginSchema), controller.login);

export default router;
