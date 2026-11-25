import express, { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { ErroDaApi } from "./config/erros.js";

import autorRoutes from "./routes/autorRoutes.js";
import livroRoutes from "./routes/livroRoutes.js";
import leitorRoutes from "./routes/leitorRoutes.js";
import emprestimoRoutes from "./routes/emprestimoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(autorRoutes);
app.use(livroRoutes);
app.use(leitorRoutes);
app.use(emprestimoRoutes);
app.use(usuarioRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErroDaApi) {
    return res.status(err.status).json({
      mensagem: err.message,
      detalhes: err.campo ? [{ campo: err.campo, mensagem: err.message }] : [],
    });
  }

  if (err?.code === "P2002") {
    return res.status(409).json({ mensagem: "Já existe um registro com este valor único" });
  }

  console.error(err);
  return res.status(500).json({ mensagem: "Erro interno no servidor" });
});

app.listen(PORT, () => {
  console.log(`A API subiu na porta ${PORT}`);
  console.log(`Documentação disponível em: http://localhost:${PORT}/docs`);
});
