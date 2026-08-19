export interface MatrixStatistics {
  max: number;
  min: number;
  average: number;
  sum: number;
  isDiagonal: boolean;
}

/**
 * Aplana una matriz 2D en un array 1D de números.
 */
function flatten(matrix: number[][]): number[] {
  return matrix.flat();
}

/**
 * Verifica si una matriz cuadrada es diagonal.
 * Una matriz es diagonal cuando todos los elementos fuera de la diagonal principal son 0.
 */
function checkDiagonal(matrix: number[][]): boolean {
  const rows = matrix.length;
  for (let i = 0; i < rows; i++) {
    const cols = matrix[i].length;
    for (let j = 0; j < cols; j++) {
      if (i !== j && matrix[i][j] !== 0) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Calcula estadísticas básicas de una matriz de enteros.
 * - max: valor máximo
 * - min: valor mínimo
 * - average: promedio de todos los elementos
 * - sum: suma total de todos los elementos
 * - isDiagonal: true si es matriz cuadrada y solo tiene valores ≠ 0 en la diagonal principal
 */
export function calculateStatistics(matrix: number[][]): MatrixStatistics {
  if (matrix.length === 0 || matrix[0].length === 0) {
    throw new Error("matrix must be non-empty");
  }

  const flat = flatten(matrix);
  const sum = flat.reduce((acc, val) => acc + val, 0);
  const max = Math.max(...flat);
  const min = Math.min(...flat);
  const average = sum / flat.length;
  const isDiagonal = checkDiagonal(matrix);

  return { max, min, average, sum, isDiagonal };
}
