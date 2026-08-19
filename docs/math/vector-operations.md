# Operaciones con Vectores

Conceptos fundamentales usados en rotación de matrices, factorización QR y
procesamiento de datos.

---

## 1. Módulo (Longitud) del Vector

### ¿Qué es?

El **módulo** o **longitud** de un vector es la distancia desde el origen
hasta la punta del vector. Se denota como `‖v‖`.

### Fórmula

Para un vector **v** = (v₁, v₂, ..., vₙ):

```
‖v‖ = √(v₁² + v₂² + ... + vₙ²)
```

### Ejemplo 2D

```
v = (3, 4)

‖v‖ = √(3² + 4²)
    = √(9 + 16)
    = √25
    = 5
```

```
        │
      4 ┤       ● (3,4)
        │      ╱
        │     ╱  ‖v‖ = 5
        │    ╱
        │   ╱
        │  ╱
      0 ┼─────────────
        0   3
```

### Ejemplo 3D

```
v = (1, 2, 3)

‖v‖ = √(1² + 2² + 3²)
    = √(1 + 4 + 9)
    = √14
    ≈ 3.742
```

### Implementación en Go

```go
package vector

import "math"

// Norm calcula el módulo (longitud) de un vector.
//
// Complejidad: O(n)
func Norm(v []float64) float64 {
    sum := 0.0
    for _, val := range v {
        sum += val * val
    }
    return math.Sqrt(sum)
}

// Norm2D calcula el módulo de un vector 2D.
func Norm2D(x, y float64) float64 {
    return math.Sqrt(x*x + y*y)
}

// Norm3D calcula el módulo de un vector 3D.
func Norm3D(x, y, z float64) float64 {
    return math.Sqrt(x*x + y*y + z*z)
}
```

---

## 2. Producto Escalar (Dot Product)

### ¿Qué es?

El **producto escalar** (o producto punto) multiplica dos vectores y devuelve
un **número escalar** (no un vector). Mide qué tan "alineados" están dos vectores.

### Fórmula

Para vectores **a** = (a₁, a₂, ..., aₙ) y **b** = (b₁, b₂, ..., bₙ):

```
a · b = a₁×b₁ + a₂×b₂ + ... + aₙ×bₙ
```

Otra forma (usando el ángulo θ entre ellos):

```
a · b = ‖a‖ × ‖b‖ × cos(θ)
```

### Ejemplo 2D

```
a = (1, 2)
b = (3, 4)

a · b = (1×3) + (2×4)
      = 3 + 8
      = 11
```

### Ejemplo 3D

```
a = (1, 0, 2)
b = (3, 1, -1)

a · b = (1×3) + (0×1) + (2×(-1))
      = 3 + 0 + (-2)
      = 1
```

### Interpretación geométrica

| Resultado | Significado                                    |
| --------- | ---------------------------------------------- |
| a · b > 0 | Ángulo < 90° (apuntan en dirección similar)    |
| a · b = 0 | Ángulo = 90° (son **perpendiculares**)         |
| a · b < 0 | Ángulo > 90° (apuntan en direcciones opuestas) |

```
a · b > 0         a · b = 0         a · b < 0
(0° < θ < 90°)    (θ = 90°)         (90° < θ < 180°)

  b↗              b↑                b↑
 ╱               │                 │
a───►            a───►             a───►
```

### Usos

- **Proyección**: proyectar un vector sobre otro
- **Ángulo**: calcular el ángulo entre dos vectores
- **Ortogonalidad**: verificar si dos vectores son perpendiculares
- **Factorización QR**: Gram-Schmidt usa productos escalares

### Implementación en Go

```go
// DotProduct calcula el producto escalar de dos vectores.
//
// Ambos vectores deben tener la misma longitud.
// Complejidad: O(n)
func DotProduct(a, b []float64) (float64, error) {
    if len(a) != len(b) {
        return 0, fmt.Errorf("vectores de distinta longitud: %d vs %d", len(a), len(b))
    }

    sum := 0.0
    for i := range a {
        sum += a[i] * b[i]
    }
    return sum, nil
}

// Angle calcula el ángulo (en radianes) entre dos vectores.
//
// Usa la fórmula: θ = acos(a·b / (‖a‖ × ‖b‖))
func Angle(a, b []float64) (float64, error) {
    dot, err := DotProduct(a, b)
    if err != nil {
        return 0, err
    }

    normA := Norm(a)
    normB := Norm(b)

    if normA == 0 || normB == 0 {
        return 0, fmt.Errorf("no se puede calcular ángulo con vector cero")
    }

    cosTheta := dot / (normA * normB)

    // Clamp por errores de punto flotante
    if cosTheta > 1.0 {
        cosTheta = 1.0
    }
    if cosTheta < -1.0 {
        cosTheta = -1.0
    }

    return math.Acos(cosTheta), nil
}

// IsPerpendicular verifica si dos vectores son perpendiculares.
//
// Dos vectores son perpendiculares si su producto escalar es cero.
func IsPerpendicular(a, b []float64, tolerance float64) bool {
    dot, err := DotProduct(a, b)
    if err != nil {
        return false
    }
    return math.Abs(dot) < tolerance
}
```

---

## 3. Producto Vectorial (Cross Product)

### ¿Qué es?

El **producto vectorial** (o producto cruz) es una operación que varía según
las dimensiones del vector:

| Dimensión | Resultado            | Uso principal      |
| --------- | -------------------- | ------------------ |
| **2D**    | Escalar              | Orientación y área |
| **3D**    | Vector perpendicular | Áreas y normales   |

---

### 3.1 Producto vectorial en 2D

En 2D, el producto vectorial devuelve un **escalar** (no un vector). Se
interpreta como la componente Z hipotética del resultado si los vectores
estuvieran en 3D.

#### Fórmula

Para vectores **a** = (a₁, a₂) y **b** = (b₁, b₂):

```
a × b = a₁×b₂ - a₂×b₁
```

#### Ejemplo

```
a = (3, 1)
b = (1, 2)

a × b = (3×2) - (1×1)
      = 6 - 1
      = 5
```

#### Interpretación geométrica

El resultado indica la **orientación** relativa de los vectores:

```
a × b > 0         a × b = 0         a × b < 0
(antihorario)     (paralelos)       (horario)

  b↗              b→                b↘
 ╱               ╱                 ╱
a───►           a───►             a───►
```

| Resultado | Significado                                          |
| --------- | ---------------------------------------------------- |
| a × b > 0 | b está a la **izquierda** de a (sentido antihorario) |
| a × b = 0 | a y b son **paralelos**                              |
| a × b < 0 | b está a la **derecha** de a (sentido horario)       |

#### Área del paralelogramo

El valor absoluto del producto vectorial 2D es el **área del paralelogramo**
formado por los dos vectores:

```
Área = |a × b| = |a₁×b₂ - a₂×b₁|
```

```
       b╲
       ╱ ╲
      ╱   ╲
     ╱  Área╲
    ╱       ╲
   ╱─────────╲
  a
```

#### Implementación en Go

```go
// CrossProduct2D calcula el producto vectorial 2D (escalar).
//
// Devuelve un escalar que indica orientación:
//   - Positivo: sentido antihorario
//   - Negativo: sentido horario
//   - Cero: vectores paralelos
func CrossProduct2D(a, b []float64) (float64, error) {
    if len(a) != 2 || len(b) != 2 {
        return 0, fmt.Errorf("producto vectorial 2D requiere vectores de dimensión 2")
    }

    return a[0]*b[1] - a[1]*b[0], nil
}

// ParallelogramArea2D calcula el área del paralelogramo formado por dos vectores 2D.
//
// Área = |a × b|
func ParallelogramArea2D(a, b []float64) (float64, error) {
    cross, err := CrossProduct2D(a, b)
    if err != nil {
        return 0, err
    }
    return math.Abs(cross), nil
}

// IsCounterClockwise2D verifica si b está a la izquierda de a.
func IsCounterClockwise2D(a, b []float64) (bool, error) {
    cross, err := CrossProduct2D(a, b)
    if err != nil {
        return false, err
    }
    return cross > 0, nil
}
```

---

### 3.2 Producto vectorial en 3D

### Fórmula

Para vectores **a** = (a₁, a₂, a₃) y **b** = (b₁, b₂, b₃):

```
a × b = (a₂×b₃ - a₃×b₂,  a₃×b₁ - a₁×b₃,  a₁×b₂ - a₂×b₁)
```

Se puede recordar como el determinante de una matriz:

```
        │ i   j   k  │
a × b = │ a₁  a₂  a₃ │
        │ b₁  b₂  b₃ │

= i(a₂b₃ - a₃b₂) - j(a₁b₃ - a₃b₁) + k(a₁b₂ - a₂b₁)
```

### Ejemplo

```
a = (1, 0, 0)    (eje X)
b = (0, 1, 0)    (eje Y)

a × b = (0×0 - 0×1,  0×0 - 1×0,  1×1 - 0×0)
      = (0 - 0,      0 - 0,      1 - 0)
      = (0, 0, 1)                (eje Z)
```

```
        Z ↑    a × b (perpendicular)
          │   ╱
          │  ╱
          │ ╱
          │╱
          ┼───────► Y
         ╱│
        ╱ │
       ╱  │
      X   │

  a = eje X
  b = eje Y
  a × b = eje Z
```

### Propiedades

| Propiedad             | Descripción                                        |
| --------------------- | -------------------------------------------------- |
| **Anticonmutativo**   | a × b = -(b × a)                                   |
| **Perpendicularidad** | a × b es perpendicular a ambos a y b               |
| **Magnitud**          | ‖a × b‖ = ‖a‖ × ‖b‖ × sin(θ)                       |
| **Área**              | ‖a × b‖ = área del paralelogramo formado por a y b |
| **Solo 3D**           | No está definido para 2D ni para más de 3D         |

### Diferencia con producto escalar

| Característica | Producto Escalar (·)  | Producto Vectorial 2D (×) | Producto Vectorial 3D (×) |
| -------------- | --------------------- | ------------------------- | ------------------------- |
| Resultado      | Escalar               | Escalar                   | Vector                    |
| Dimensiones    | Cualquiera            | Solo 2D                   | Solo 3D                   |
| Conmutativo    | Sí (a·b = b·a)        | No (a×b = -b×a)           | No (a×b = -b×a)           |
| Uso            | Ángulos, proyecciones | Orientación, áreas        | Áreas, normales, torque   |

### Implementación en Go

```go
// CrossProduct calcula el producto vectorial de dos vectores 3D.
//
// Devuelve un vector perpendicular a ambos vectores de entrada.
// Solo funciona con vectores de dimensión 3.
func CrossProduct(a, b []float64) ([]float64, error) {
    if len(a) != 3 || len(b) != 3 {
        return nil, fmt.Errorf("producto vectorial solo definido para vectores 3D")
    }

    return []float64{
        a[1]*b[2] - a[2]*b[1],  // componente X
        a[2]*b[0] - a[0]*b[2],  // componente Y
        a[0]*b[1] - a[1]*b[0],  // componente Z
    }, nil
}

// CrossMagnitude calcula la magnitud del producto vectorial.
//
// Equivale al área del paralelogramo formado por los dos vectores.
// Útil para calcular áreas sin calcular el vector resultante.
func CrossMagnitude(a, b []float64) (float64, error) {
    cross, err := CrossProduct(a, b)
    if err != nil {
        return 0, err
    }
    return Norm(cross), nil
}
```

---

## Ejemplo completo en Go

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    a := []float64{1, 2, 3}
    b := []float64{4, 5, 6}

    // Módulo
    fmt.Printf("‖a‖ = %.4f\n", Norm(a))
    fmt.Printf("‖b‖ = %.4f\n", Norm(b))

    // Producto escalar
    dot, _ := DotProduct(a, b)
    fmt.Printf("a · b = %.0f\n", dot)

    // Ángulo
    angle, _ := Angle(a, b)
    fmt.Printf("θ = %.2f°\n", angle*180/math.Pi)

    // Producto vectorial
    cross, _ := CrossProduct(a, b)
    fmt.Printf("a × b = %v\n", cross)
    fmt.Printf("‖a × b‖ = %.4f\n", Norm(cross))
}
```

**Salida:**

```
‖a‖ = 3.7417
‖b‖ = 8.7750
a · b = 32
θ = 12.93°
a × b = [-3 6 -3]
‖a × b‖ = 7.3485
```

---

## 4. Vectores Ortogonales y Matrices Ortogonales

### 4.1 Vectores ortogonales

Dos vectores son **ortogonales** (perpendiculares) si su producto escalar es cero:

```
a ⊥ b  ⟺  a · b = 0
```

```
   b↑
   │
   │    θ = 90°
   │   ╱
   │  ╱
   │ ╱
   ┼───────► a

  a · b = 0  →  ortogonales
```

### 4.2 Vectores ortonormales

Un conjunto de vectores es **ortonormal** si:

1. Cada vector tiene **módulo 1** (norma unitaria)
2. Cada par de vectores es **ortogonal**

```
v₁ = (1, 0)  →  ‖v₁‖ = 1
v₂ = (0, 1)  →  ‖v₂‖ = 1

v₁ · v₂ = 0  →  ortogonales
∴ {v₁, v₂} es ortonormal
```

### 4.3 Matriz ortogonal

Una matriz **Q** es **ortogonal** si:

```
Q × Qᵀ = Qᵀ × Q = I
```

Donde **Qᵀ** es la transpuesta e **I** es la matriz identidad.

Esto implica que **Q⁻¹ = Qᵀ** (la inversa es la transpuesta).

**Propiedades:**

| Propiedad             | Descripción                                            |
| --------------------- | ------------------------------------------------------ |
| Q⁻¹ = Qᵀ              | La inversa es la transpuesta                           |
| det(Q) = ±1           | El determinante es 1 o -1                              |
| Columnas ortonormales | Las columnas forman una base ortonormal                |
| Filas ortonormales    | Las filas también forman una base ortonormal           |
| Preserva longitudes   | ‖Qx‖ = ‖x‖ para cualquier vector x                     |
| Preserva ángulos      | El ángulo entre Qx y Qy es igual al ángulo entre x e y |

### Ejemplo 2x2

```
Q = ┌─────────┬──────────┐
    │  0.707  │ -0.707   │
    ├─────────┼──────────┤
    │  0.707  │  0.707   │
    └─────────┴──────────┘

Qᵀ = ┌─────────┬──────────┐
     │  0.707  │  0.707   │
     ├─────────┼──────────┤
     │ -0.707  │  0.707   │
     └─────────┴──────────┘

Q × Qᵀ = ┌────┬────┐
         │ 1  │ 0  │
         ├────┼────┤
         │ 0  │ 1  │
         └────┴────┘
         = I  (se cumple Q × Qᵀ = I)
```

### ¿Qué transformación hace?

Una matriz ortogonal representa una **rotación** o **reflexión**:

- **det(Q) = 1**: rotación pura
- **det(Q) = -1**: reflexión (o rotación + reflexión)

```
Rotación (det=1)         Reflexión (det=-1)

    ●→                      ●→
   ╱                     ─────╱
  ╱ →                    │   ╱
 ╱                       │  ╱
                         ─────╱
```

### Implementación en Go

```go
package matrix

import "math"

// IsOrthogonal verifica si una matriz es ortogonal.
//
// Una matriz Q es ortogonal si Q × Qᵀ = I.
// Tolerancia por errores de punto flotante.
func IsOrthogonal(q [][]float64, tolerance float64) bool {
    rows := len(q)
    if rows == 0 {
        return false
    }
    cols := len(q[0])

    // Verificar que es cuadrada
    if rows != cols {
        return false
    }

    // Calcular Q × Qᵀ
    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            sum := 0.0
            for k := 0; k < cols; k++ {
                sum += q[i][k] * q[j][k]
            }

            // Elemento diagonal debe ser ~1
            if i == j {
                if math.Abs(sum-1.0) > tolerance {
                    return false
                }
            } else {
                // Elemento fuera de diagonal debe ser ~0
                if math.Abs(sum) > tolerance {
                    return false
                }
            }
        }
    }

    return true
}

// OrthogonalInverse calcula la inversa de una matriz ortogonal.
//
// Para una matriz ortogonal, Q⁻¹ = Qᵀ.
// Mucho más eficiente que calcular la inversa general: O(n²) vs O(n³).
func OrthogonalInverse(q [][]float64) [][]float64 {
    rows := len(q)
    cols := len(q[0])

    result := make([][]float64, cols)
    for i := range result {
        result[i] = make([]float64, rows)
    }

    // Simplemente transponer
    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            result[j][i] = q[i][j]
        }
    }

    return result
}
```

---

## 5. Matriz Diagonal

### ¿Qué es?

Una matriz es **diagonal** si todos los elementos fuera de la diagonal principal
son **cero**. Solo los elementos en la posición (i, i) pueden ser ≠ 0.

### Ejemplo

```
Matriz diagonal 3x3:      NO es diagonal:

┌────┬────┬────┐          ┌────┬────┬────┐
│ 3  │ 0  │ 0  │          │ 1  │ 2  │ 0  │
├────┼────┼────┤          ├────┼────┼────┤
│ 0  │ 5  │ 0  │          │ 3  │ 4  │ 0  │
├────┼────┼────┤          ├────┼────┼────┤
│ 0  │ 0  │ 7  │          │ 0  │ 5  │ 6  │
└────┴────┴────┘          └────┴────┴────┘

Solo ≠ 0 en diagonal      Hay ≠ 0 fuera de diagonal
```

### Verificación: ¿es diagonal?

```
Para una matriz n×n, es diagonal si:
  ∀ i ≠ j:  A[i][j] = 0

Es decir: todos los elementos donde fila ≠ columna son cero.
```

### Ejemplo de verificación

```
A = ┌────┬────┬────┐
    │ 3  │ 0  │ 0  │
    ├────┼────┼────┤
    │ 0  │ 5  │ 0  │
    ├────┼────┼────┤
    │ 0  │ 0  │ 7  │
    └────┴────┴────┘

Posiciones donde fila ≠ columna:
  A[0][1] = 0  ✓
  A[0][2] = 0  ✓
  A[1][0] = 0  ✓
  A[1][2] = 0  ✓
  A[2][0] = 0  ✓
  A[2][1] = 0  ✓

∴ Es diagonal
```

### Propiedades

| Propiedad          | Descripción                                                    |
| ------------------ | -------------------------------------------------------------- |
| **Determinante**   | Producto de los elementos diagonales: det = d₁ × d₂ × ... × dₙ |
| **Inversa**        | Si todos los dᵢ ≠ 0: D⁻¹ = diagonal(1/d₁, 1/d₂, ..., 1/dₙ)     |
| **Eigenvalores**   | Los elementos diagonales SON los eigenvalores                  |
| **Simétrica**      | Toda matriz diagonal es simétrica (D = Dᵀ)                     |
| **Multiplicación** | Multiplicar diagonales: solo multiplicas elemento a elemento   |

### Multiplicación de matrices diagonales

```
D₁ = ┌────┬────┐    D₂ = ┌────┬────┐
     │ 2  │ 0  │         │ 3  │ 0  │
     ├────┼────┤         ├────┼────┤
     │ 0  │ 4  │         │ 0  │ 5  │
     └────┴────┘         └────┴────┘

D₁ × D₂ = ┌────┬────┐
           │ 6  │ 0  │     (2×3, 0)
           ├────┼────┤
           │ 0  │ 20 │     (0, 4×5)
           └────┴────┘
```

### Implementación en Go

```go
package matrix

// IsDiagonal verifica si una matriz es diagonal.
//
// Una matriz es diagonal si todos los elementos fuera de la
// diagonal principal son cero.
// Complejidad: O(n²)
func IsDiagonal(matrix [][]float64, tolerance float64) bool {
    rows := len(matrix)
    if rows == 0 {
        return false
    }

    for i := 0; i < rows; i++ {
        for j := 0; j < len(matrix[i]); j++ {
            if i != j && math.Abs(matrix[i][j]) > tolerance {
                return false
            }
        }
    }

    return true
}

// DiagonalProduct calcula el producto de los elementos diagonales.
//
// Equivale al determinante de una matriz diagonal.
func DiagonalProduct(matrix []float64) float64 {
    product := 1.0
    for _, val := range matrix {
        product *= val
    }
    return product
}
```

### Matrices relacionadas

| Tipo                    | Definición                     | Ejemplo         |
| ----------------------- | ------------------------------ | --------------- |
| **Diagonal**            | ≠ 0 solo en diagonal           | `[[3,0],[0,5]]` |
| **Triangular superior** | ≠ 0 solo encima de la diagonal | `[[1,2],[0,3]]` |
| **Triangular inferior** | ≠ 0 solo debajo de la diagonal | `[[1,0],[2,3]]` |
| **Identidad**           | Diagonal con todos = 1         | `[[1,0],[0,1]]` |

---

## Resumen

| Concepto                  | Descripción                      | Fórmula                           |
| ------------------------- | -------------------------------- | --------------------------------- |
| **Módulo**                | Longitud del vector              | √(v₁² + v₂² + ... + vₙ²)          |
| **Producto escalar**      | Resultado escalar entre vectores | a₁b₁ + a₂b₂ + ... + aₙbₙ          |
| **Producto vectorial 2D** | Escalar de orientación           | a₁b₂ - a₂b₁                       |
| **Producto vectorial 3D** | Vector perpendicular             | (a₂b₃-a₃b₂, a₃b₁-a₁b₃, a₁b₂-a₂b₁) |
| **Vectores ortogonales**  | Perpendiculares entre sí         | a · b = 0                         |
| **Vectores ortonormales** | Ortogonales + módulo 1           | ‖v‖ = 1 y a · b = 0               |
| **Matriz ortogonal**      | Q × Qᵀ = I                       | Q⁻¹ = Qᵀ                          |
| **Matriz diagonal**       | ≠ 0 solo en diagonal principal   | ∀ i≠j: A[i][j] = 0                |

## Notas

- **Módulo**: usado en Gram-Schmidt para normalizar vectores (factorización QR)
- **Producto escalar**: base de Gram-Schmidt y verificación de ortogonalidad
- **Producto vectorial 2D**: útil para verificar orientación y calcular áreas en matrices 2D
- **Producto vectorial 3D**: útil si el reto involucra geometría 3D o cálculo de áreas
- **Matriz ortogonal**: la Q de la factorización QR siempre es ortogonal
