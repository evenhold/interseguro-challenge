import cors from "cors";
import express, { type Request, type Response } from "express";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { setupGracefulShutdown } from "./config/graceful-shutdown.js";
import { logger } from "./config/logger.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

const app: express.Express = express();
const PORT: number = env.PORT;

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());

interface HealthResponse {
  status: string;
  service: string;
}

interface MessageResponse {
  message: string;
}

app.get("/health", (_req: Request, res: Response<HealthResponse>) => {
  res.json({ status: "ok", service: "api-express" });
});

app.get("/", (_req: Request, res: Response<MessageResponse>) => {
  res.json({ message: "Hola mundo desde Express API" });
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`API Express running on port ${PORT}`);
});

setupGracefulShutdown(server);

export default app;
