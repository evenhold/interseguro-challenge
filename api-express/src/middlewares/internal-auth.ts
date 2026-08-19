import { Request, Response, NextFunction } from "express";
import { secrets } from "../config/secrets.js";
import { AppError } from "./error-handler.js";

export function internalAuth(req: Request, _res: Response, next: NextFunction): void {
  const providedSecret = req.headers["x-internal-secret"] as string;

  if (!providedSecret || providedSecret !== secrets.internalSecret) {
    return next(new AppError(401, "Unauthorized: invalid internal secret"));
  }

  next();
}
