package domain

// Matrix representa una matriz de enteros bidimensional.
// Es una entidad pura: sin dependencias externas ni lógica de negocio.
type Matrix [][]int

// RotateDegrees define los ángulos de rotación soportados.
type RotateDegrees int

const (
	Degrees90  RotateDegrees = 90
	Degrees180 RotateDegrees = 180
	Degrees270 RotateDegrees = 270
)

// Rows retorna la cantidad de filas de la matriz.
func (m Matrix) Rows() int {
	return len(m)
}

// Cols retorna la cantidad de columnas de la matriz.
// Asume matriz rectangular (todas las filas tienen la misma longitud).
func (m Matrix) Cols() int {
	if len(m) == 0 {
		return 0
	}
	return len(m[0])
}

// IsEmpty verifica si la matriz está vacía.
func (m Matrix) IsEmpty() bool {
	return len(m) == 0
}

// IsValid verifica si la matriz es rectangular válida:
// - No vacía
// - Todas las filas tienen la misma longitud
func (m Matrix) IsValid() bool {
	if len(m) == 0 {
		return false
	}

	cols := len(m[0])
	if cols == 0 {
		return false
	}

	for _, row := range m {
		if len(row) != cols {
			return false
		}
	}

	return true
}
