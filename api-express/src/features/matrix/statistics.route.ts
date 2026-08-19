import { Router, type Request, type Response } from "express";
import { AppError } from "../../middlewares/error-handler.js";
import { internalAuth } from "../../middlewares/internal-auth.js";
import { calculateStatistics, type MatrixStatistics } from "./statistics.service.js";

const router: Router = Router();

interface StatisticsRequest {
  matrix: number[][];
}

interface StatisticsResponse {
  data: MatrixStatistics;
  message: string;
}

router.post(
  "/api/v1/matrix/statistics",
  internalAuth,
  (req: Request, res: Response<StatisticsResponse>) => {
    const { matrix } = req.body as StatisticsRequest;

    if (!matrix || !Array.isArray(matrix) || matrix.length === 0) {
      throw new AppError(400, "matrix must be a non-empty 2D array");
    }

    for (const row of matrix) {
      if (!Array.isArray(row)) {
        throw new AppError(400, "matrix must be a non-empty 2D array");
      }
    }

    const data = calculateStatistics(matrix);
    res.json({ data, message: "statistics calculated successfully" });
  },
);

export default router;
