import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    logger.warn({ err, statusCode: err.statusCode }, err.message);
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  logger.error({ err }, "Unhandled error");
  const statusCode = 500;
  const message = env.NODE_ENV === "production" ? "Internal server error" : err.message;
  res.status(statusCode).json({ error: message });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ error: "Not found" });
};
