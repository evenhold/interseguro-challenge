# Estadísticas de Matriz

## ¿Qué es?

El cálculo de estadísticas sobre una matriz extrae información resumida de todos
sus elementos: valores extremos, promedio, suma total y propiedades estructurales.

---

## Operaciones

### 1. Valor máximo

El **mayor valor** presente en cualquier posición de la matriz.

```
A = ┌────┬────┬────┐
    │ 1  │ 5  │ 3  │
    ├────┼────┼────┤
    │ 4  │ 2  │ 6  │
    └────┴────┴────┘

max(A) = 6
```

### 2. Valor mínimo

El **menor valor** presente en cualquier posición de la matriz.

```
min(A) = 1
```

### 3. Suma total

La **suma de todos los elementos** de la matriz.

```
sum(A) = 1 + 5 + 3 + 4 + 2 + 6 = 21
```

### 4. Promedio

El **promedio aritmético** de todos los elementos.

```
average(A) = sum(A) / count(A) = 21 / 6 = 3.5
```

### 5. Matriz diagonal

Una matriz es **diagonal** si todos los elementos fuera de la diagonal principal
son cero. Solo los elementos en la posición (i, i) pueden ser ≠ 0.

```
Matriz diagonal:          NO es diagonal:

┌────┬────┬────┐          ┌────┬────┬────┐
│ 3  │ 0  │ 0  │          │ 1  │ 2  │ 0  │
├────┼────┼────┤          ├────┼────┼────┤
│ 0  │ 5  │ 0  │          │ 3  │ 4  │ 0  │
├────┼────┼────┤          ├────┼────┼────┤
│ 0  │ 0  │ 7  │          │ 0  │ 5  │ 6  │
└────┴────┴────┘          └────┴────┴────┘

∀ i≠j: A[i][j] = 0        Hay ≠ 0 fuera de diagonal
```

---

## Ejemplo completo

```
A = ┌────┬────┬────┐
    │ 1  │ 0  │ 0  │
    ├────┼────┼────┤
    │ 0  │ 2  │ 0  │
    ├────┼────┼────┤
    │ 0  │ 0  │ 3  │
    └────┴────┴────┘

flat = [1, 0, 0, 0, 2, 0, 0, 0, 3]

max       = 3
min       = 0
sum       = 6
average   = 6 / 9 = 0.6667
isDiagonal = true  (todos los i≠j son 0)
```

---

## Implementación en TypeScript

```typescript
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
 * Una matriz es diagonal cuando todos los elementos fuera de la diagonal
 * principal son 0.
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
 * Calcula estadísticas básicas de una matriz.
 *
 * - max: valor máximo
 * - min: valor mínimo
 * - average: promedio de todos los elementos
 * - sum: suma total de todos los elementos
 * - isDiagonal: true si todos los elementos fuera de la diagonal son 0
 */
export function calculateStatistics(matrix: number[][]): MatrixStatistics {
  if (matrix.length === 0 || matrix[0].length === 0) {
    throw new Error("matrix must be non-empty");
  }

  const flat = flatten(matrix);
  const sum = parseFloat(flat.reduce((acc, val) => acc + val, 0).toFixed(4));
  const max = parseFloat(Math.max(...flat).toFixed(4));
  const min = parseFloat(Math.min(...flat).toFixed(4));
  const average = parseFloat((sum / flat.length).toFixed(4));
  const isDiagonal = checkDiagonal(matrix);

  return { max, min, average, sum, isDiagonal };
}
```

---

## Precisión

Los valores se redondean a **4 decimales** usando `parseFloat(value.toFixed(4))`.

| Valor real    | Redondeado |
| ------------- | ---------- |
| 0.666666...   | 0.6667     |
| 3.14159265    | 3.1416     |
| 1.0           | 1          |

---

## Complejidad

| Operación     | Complejidad |
| ------------- | ----------- |
| flatten       | O(m × n)    |
| max / min     | O(m × n)    |
| sum           | O(m × n)    |
| average       | O(m × n)    |
| isDiagonal    | O(m × n)    |
| **Total**     | **O(m × n)**|

---

## Resumen

| Concepto      | Descripción                                    | Fórmula                    |
| ------------- | ---------------------------------------------- | -------------------------- |
| **max**       | Mayor valor en la matriz                       | `Math.max(...flat)`        |
| **min**       | Menor valor en la matriz                       | `Math.min(...flat)`        |
| **sum**       | Suma de todos los elementos                    | `flat.reduce(a + v, 0)`    |
| **average**   | Promedio aritmético                            | `sum / flat.length`        |
| **isDiagonal**| true si solo la diagonal tiene valores ≠ 0     | `∀ i≠j: A[i][j] = 0`      |

## Notas

- **flatten**: necesario para operar sobre todos los elementos como array 1D
- **isDiagonal**: funciona para matrices rectangulares y cuadradas
- **Precisión**:4 decimales evitan errores de punto flotante en la respuesta
