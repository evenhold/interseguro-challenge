# Rotación de Matriz

## ¿Qué es?

La rotación de matriz es una operación que **gira los elementos** de una matriz
en sentido horario o antihorario. Los ángulos más comunes son 90°, 180° y 270°.

No se pierden datos, solo se reorganizan las posiciones.

---

## Rotación 90° en sentido horario

### Algoritmo

1. **Transponer** la matriz (intercambiar filas por columnas)
2. **Invertir** el orden de cada fila

### Ejemplo 2x2

```
Matriz original:       Paso 1 - Transponer:    Paso 2 - Invertir filas:
┌────┬────┐            ┌────┬────┐             ┌────┬────┐
│ 1  │ 2  │            │ 1  │ 3  │             │ 3  │ 1  │
├────┼────┤    ──►     ├────┼────┤     ──►     ├────┼────┤
│ 3  │ 4  │            │ 2  │ 4  │             │ 4  │ 2  │
└────┴────┘            └────┴────┘             └────┴────┘
```

### Ejemplo 3x3

```
Matriz original:          Rotación 90° horaria:
┌────┬────┬────┐         ┌────┬────┬────┐
│ 1  │ 2  │ 3  │         │ 7  │ 4  │ 1  │
├────┼────┼────┤   ──►   ├────┼────┼────┤
│ 4  │ 5  │ 6  │         │ 8  │ 5  │ 2  │
├────┼────┼────┤         ├────┼────┼────┤
│ 7  │ 8  │ 9  │         │ 9  │ 6  │ 3  │
└────┴────┴────┘         └────┴────┴────┘
```

---

## Rotación 180°

### Algoritmo

1. **Invertir** el orden de las filas
2. **Invertir** el orden de cada fila

### Ejemplo 2x2

```
Matriz original:       Paso 1 - Invertir filas:  Paso 2 - Invertir elems:
┌────┬────┐            ┌────┬────┐               ┌────┬────┐
│ 1  │ 2  │            │ 3  │ 4  │               │ 4  │ 3  │
├────┼────┤    ──►     ├────┼────┤      ──►      ├────┼────┤
│ 3  │ 4  │            │ 1  │ 2  │               │ 2  │ 1  │
└────┴────┘            └────┴────┘               └────┴────┘
```

---

## Rotación 90° en sentido antihorario

### Algoritmo

1. **Invertir** el orden de las filas
2. **Transponer** la matriz

### Ejemplo 2x2

```
Matriz original:       Paso 1 - Invertir filas:  Paso 2 - Transponer:
┌────┬────┐            ┌────┬────┐               ┌────┬────┐
│ 1  │ 2  │            │ 3  │ 4  │               │ 3  │ 1  │
├────┼────┤    ──►     ├────┼────┤      ──►      ├────┼────┤
│ 3  │ 4  │            │ 1  │ 2  │               │ 4  │ 2  │
└────┴────┘            └────┴────┘               └────┴────┘
```

### Ejemplo 3x3

```
Matriz original:          Rotación 90° antihoraria:
┌────┬────┬────┐         ┌────┬────┬────┐
│ 1  │ 2  │ 3  │         │ 3  │ 6  │ 9  │
├────┼────┼────┤   ──►   ├────┼────┼────┤
│ 4  │ 5  │ 6  │         │ 2  │ 5  │ 8  │
├────┼────┼────┤         ├────┼────┼────┤
│ 7  │ 8  │ 9  │         │ 1  │ 4  │ 7  │
└────┴────┴────┘         └────┴────┴────┘
```

---

## Rotación 270° en sentido horario (= 90° antihorario)

### Algoritmo

1. **Transponer** la matriz
2. **Invertir** el orden de cada columna (invertir filas verticalmente)

### Ejemplo 2x2

```
Matriz original:       Paso 1 - Transponer:    Paso 2 - Invertir columnas:
┌────┬────┐            ┌────┬────┐             ┌────┬────┐
│ 1  │ 2  │            │ 1  │ 3  │             │ 2  │ 4  │
├────┼────┤    ──►     ├────┼────┤     ──►     ├────┼────┤
│ 3  │ 4  │            │ 2  │ 4  │             │ 1  │ 3  │
└────┴────┘            └────┴────┘             └────┴────┘
```

---

## Ejemplo completo en Go

```go
package matrix

// Rotate90Clockwise rota una matriz 90° en sentido horario.
//
// Algoritmo: transponer + invertir cada fila.
// Complejidad: O(n*m)
func Rotate90Clockwise(matrix [][]int) [][]int {
    if len(matrix) == 0 || len(matrix[0]) == 0 {
        return [][]int{}
    }

    rows := len(matrix)
    cols := len(matrix[0])

    // Paso 1: Crear matriz resultado (cols x rows)
    result := make([][]int, cols)
    for i := range result {
        result[i] = make([]int, rows)
    }

    // Paso 2: Llenar rotando cada posición
    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            result[j][rows-1-i] = matrix[i][j]
        }
    }

    return result
}

// Rotate180 rota una matriz 180°.
//
// Algoritmo: invertir filas + invertir cada fila.
func Rotate180(matrix [][]int) [][]int {
    if len(matrix) == 0 {
        return [][]int{}
    }

    rows := len(matrix)
    cols := len(matrix[0])

    result := make([][]int, rows)
    for i := range result {
        result[i] = make([]int, cols)
    }

    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            result[rows-1-i][cols-1-j] = matrix[i][j]
        }
    }

    return result
}

// Rotate270Clockwise rota una matriz 270° en sentido horario.
//
// Equivale a una rotación de 90° en sentido antihorario.
func Rotate270Clockwise(matrix [][]int) [][]int {
    if len(matrix) == 0 {
        return [][]int{}
    }

    rows := len(matrix)
    cols := len(matrix[0])

    result := make([][]int, cols)
    for i := range result {
        result[i] = make([]int, rows)
    }

    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            result[cols-1-j][i] = matrix[i][j]
        }
    }

    return result
}

// Rotate90CounterClockwise rota una matriz 90° en sentido antihorario.
//
// Equivale a una rotación de 270° en sentido horario.
// Algoritmo: invertir filas + transponer.
func Rotate90CounterClockwise(matrix [][]int) [][]int {
    if len(matrix) == 0 {
        return [][]int{}
    }

    rows := len(matrix)
    cols := len(matrix[0])

    result := make([][]int, cols)
    for i := range result {
        result[i] = make([]int, rows)
    }

    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            result[cols-1-j][i] = matrix[i][j]
        }
    }

    return result
}
```

---

## Ejemplo de uso

```go
func main() {
    matrix := [][]int{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9},
    }

    r90 := Rotate90Clockwise(matrix)
    // r90 = [[7,4,1],[8,5,2],[9,6,3]]

    r180 := Rotate180(matrix)
    // r180 = [[9,8,7],[6,5,4],[3,2,1]]

    r270 := Rotate270Clockwise(matrix)
    // r270 = [[3,6,9],[2,5,8],[1,4,7]]

    rAnti := Rotate90CounterClockwise(matrix)
    // rAnti = [[3,6,9],[2,5,8],[1,4,7]] (igual a r270)
}
```

---

## Resumen de algoritmos

| Rotación         | Algoritmo                          |
| ---------------- | ---------------------------------- |
| 90° horaria      | Transponer + invertir filas        |
| 90° antihoraria  | Invertir filas + transponer        |
| 180°             | Invertir filas + invertir columnas |
| 270° horaria     | Transponer + invertir columnas     |
| 270° antihoraria | Invertir columnas + transponer     |

> **Equivalencias:**
>
> - 90° antihoraria = 270° horaria
> - 270° antihoraria = 90° horaria

## Notas

- Las matrices **no necesitan ser cuadradas** (rectangulares: n×m)
- La rotación cambia las dimensiones: una matriz 2x3 pasa a ser 3x2
- Es una operación **sin pérdida** de datos (biyectiva)
