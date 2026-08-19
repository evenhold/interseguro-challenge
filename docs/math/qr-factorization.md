# Factorización QR

> **Prerrequisitos:** Antes de leer este documento, revisa
> [Operaciones con Vectores](vector-operations.md) para entender módulo,
> producto escalar y normalización.

## ¿Qué es?

La factorización QR descompone una matriz **A** en el producto de dos matrices:

```
A = Q × R
```

Donde:

- **Q**: Matriz **ortogonal** (sus columnas son vectores ortonormales)
  - Q × Qᵀ = I (la transpuesta es la inversa)
- **R**: Matriz **triangular superior**
  - Todos los elementos debajo de la diagonal son cero

---

## ¿Para qué sirve?

| Aplicación             | Descripción                             |
| ---------------------- | --------------------------------------- |
| Sistemas de ecuaciones | Resolver Ax = b de forma estable        |
| Mínimos cuadrados      | Regresión lineal                        |
| Eigenvalores           | Base del algoritmo QR para eigenvalores |
| Compresión             | Reducción de dimensionalidad            |

---

## Ejemplo numérico 2x2

### Matriz original

```
A = ┌────┬────┐
    │ 1  │ 1  │
    ├────┼────┤
    │ 1  │ -1 │
    └────┴────┘
```

### Paso 1: Extraer columnas como vectores

```
a₁ = [1, 1]ᵀ    a₂ = [1, -1]ᵀ
```

### Paso 2: Gram-Schmidt para obtener Q

**u₁** = a₁ = [1, 1]ᵀ

```
‖u₁‖ = √(1² + 1²) = √2 = 1.414

e₁ = u₁ / ‖u₁‖ = [0.707, 0.707]ᵀ
```

**Proyección de a₂ sobre e₁:**

```
proj = (a₂ · e₁) × e₁
     = (1×0.707 + (-1)×0.707) × [0.707, 0.707]ᵀ
     = 0 × [0.707, 0.707]ᵀ
     = [0, 0]ᵀ
```

**u₂** = a₂ - proj = [1, -1]ᵀ - [0, 0]ᵀ = [1, -1]ᵀ

```
‖u₂‖ = √(1² + (-1)²) = √2 = 1.414

e₂ = u₂ / ‖u₂‖ = [0.707, -0.707]ᵀ
```

### Resultado Q

```
Q = ┌────────┬─────────┐
    │ 0.707  │  0.707  │
    ├────────┼─────────┤
    │ 0.707  │ -0.707  │
    └────────┴─────────┘
```

### Paso 3: Calcular R

```
R = Qᵀ × A

R = ┌────────┬─────────┐  ┌────┬────┐
    │ 0.707  │  0.707  │  │ 1  │ 1  │
    ├────────┼─────────┤  ├────┼────┤
    │ 0.707  │ -0.707  │  │ 1  │ -1 │
    └────────┴─────────┘  └────┴────┘

R = ┌─────────┬────┐
    │ 1.414   │ 0  │
    ├─────────┼────┤
    │ 0       │ 1.414 │
    └─────────┴────┘
```

### Verificación

```
Q × R = A (verificación correcta)

┌────────┬─────────┐  ┌─────────┬────┐     ┌────┬────┐
│ 0.707  │  0.707  │  │ 1.414   │ 0  │     │ 1  │ 1  │
├────────┼─────────┤  ├─────────┼────┤  =  ├────┼────┤
│ 0.707  │ -0.707  │  │ 0       │ 1.414 │  │ 1  │ -1 │
└────────┴─────────┘  └─────────┴────┘     └────┴────┘
```

---

## Ejemplo 3x3 (paso a paso simplificado)

```
A = ┌────┬────┬────┐
    │ 1  │ 2  │ 3  │
    ├────┼────┼────┤
    │ 4  │ 5  │ 6  │
    ├────┼────┼────┤
    │ 7  │ 8  │ 9  │
    └────┴────┴────┘

Q = ┌─────────┬──────────┬──────────┐
    │  0.123  │  0.904   │  0.408   │
    ├─────────┼──────────┼──────────┤
    │  0.492  │  0.301   │ -0.816   │
    ├─────────┼──────────┼──────────┤
    │  0.862  │ -0.301   │  0.408   │
    └─────────┴──────────┴──────────┘

R = ┌─────────┬─────────┬─────────┐
    │  8.124  │  9.601  │ 11.078  │
    ├─────────┼─────────┼─────────┤
    │  0      │  0.904  │  1.809  │
    ├─────────┼─────────┼─────────┤
    │  0      │  0      │  0      │
    └─────────┴─────────┴─────────┘
```

> Nota: la última fila de R es cero porque A es singular (det = 0).

---

## Implementación en Go con gonum

```go
package matrix

import (
    "fmt"
    "math"

    "gonum.org/v1/gonum/mat"
)

// QRResult contiene las matrices Q y R resultantes.
type QRResult struct {
    Q [][]float64
    R [][]float64
}

// QRFactorize calcula la descomposición QR de una matriz.
//
// Recibe una matriz rectangular (n×m) y devuelve Q (n×n) y R (n×m).
// Usa el algoritmo de Gram-Schmidt clásico implementado con gonum.
func QRFactorize(matrix [][]float64) (*QRResult, error) {
    if len(matrix) == 0 || len(matrix[0]) == 0 {
        return nil, fmt.Errorf("matriz vacía")
    }

    rows := len(matrix)
    cols := len(matrix[0])

    // Convertir [][]float64 a mat.Dense (gonum)
    flat := make([]float64, 0, rows*cols)
    for _, row := range matrix {
        flat = append(flat, row...)
    }
    a := mat.NewDense(rows, cols, flat)

    // Factorización QR con gonum
    var qr mat.QR
    qr.Factorize(a)

    // Extraer Q (n×n)
    var q mat.Dense
    q.QFromQR(&qr)
    qData := extractDense(&q)

    // Extraer R (n×m)
    var r mat.Dense
    r.RFromQR(&qr)
    rData := extractDense(&r)

    return &QRResult{
        Q: qData,
        R: rData,
    }, nil
}

// extractDense convierte un mat.Dense a [][]float64.
func extractDense(m *mat.Dense) [][]float64 {
    rows, cols := m.Dims()
    result := make([][]float64, rows)
    for i := 0; i < rows; i++ {
        result[i] = make([]float64, cols)
        for j := 0; j < cols; j++ {
            result[i][j] = m.At(i, j)
        }
    }
    return result
}
```

---

## Implementación manual (sin librerías)

```go
package matrix

import "math"

// QRFactorizeManual calcula QR usando Gram-Schmidt clásico.
//
// Solo funciona para matrices con columnas linealmente independientes.
// Complejidad: O(n × m²)
func QRFactorizeManual(matrix [][]float64) (q, r [][]float64) {
    rows := len(matrix)
    cols := len(matrix[0])

    // Inicializar Q y R
    q = make([][]float64, rows)
    r = make([][]float64, cols)
    for i := range q {
        q[i] = make([]float64, cols)
    }
    for i := range r {
        r[i] = make([]float64, cols)
    }

    // Copiar columnas de A como vectores
    u := make([][]float64, cols)
    for j := 0; j < cols; j++ {
        u[j] = make([]float64, rows)
        for i := 0; i < rows; i++ {
            u[j][i] = matrix[i][j]
        }
    }

    // Gram-Schmidt
    for j := 0; j < cols; j++ {
        // Restar proyecciones de vectores anteriores
        for k := 0; k < j; k++ {
            dot := dotProduct(u[j], u[k])
            r[k][j] = dot
            for i := 0; i < rows; i++ {
                u[j][i] -= dot * u[k][i]
            }
        }

        // Normalizar
        norm := vectorNorm(u[j])
        r[j][j] = norm

        if norm > 1e-10 {
            for i := 0; i < rows; i++ {
                q[i][j] = u[j][i] / norm
            }
        }
    }

    return q, r
}

func dotProduct(a, b []float64) float64 {
    sum := 0.0
    for i := range a {
        sum += a[i] * b[i]
    }
    return sum
}

func vectorNorm(v []float64) float64 {
    sum := 0.0
    for _, val := range v {
        sum += val * val
    }
    return math.Sqrt(sum)
}
```

---

## Ejemplo de uso

```go
func main() {
    matrix := [][]float64{
        {1, 1},
        {1, -1},
    }

    // Con gonum
    result, _ := QRFactorize(matrix)
    fmt.Printf("Q: %v\n", result.Q)
    fmt.Printf("R: %v\n", result.R)

    // Manual
    q, r := QRFactorizeManual(matrix)
    fmt.Printf("Q: %v\n", q)
    fmt.Printf("R: %v\n", r)
}
```

---

## Resumen

| Concepto         | Descripción                                 |
| ---------------- | ------------------------------------------- |
| **Q**            | Matriz ortogonal (columnas ortonormales)    |
| **R**            | Matriz triangular superior                  |
| **A = Q×R**      | Descomposición válida para cualquier matriz |
| **Gram-Schmidt** | Algoritmo clásico para calcular QR          |
| **Complejidad**  | O(n × m²)                                   |

## Notas

- Para matrices grandes, usar `gonum` es más estable numéricamente
- La descomposición QR siempre existe para cualquier matriz
- Si la matriz es singular, R tendrá filas de ceros
- Verificar que Q×R ≈ A (tolerancia de punto flotante)
