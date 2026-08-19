package usecase

import (
	"fmt"

	"github.com/user/interseguro-challenge-api-go/internal/domain"
)

// MatrixUsecase define las operaciones disponibles para matrices.
type MatrixUsecase interface {
	Rotate(matrix domain.Matrix, degrees int) (domain.Matrix, error)
}

// matrixUsecase implementa MatrixUsecase.
type matrixUsecase struct{}

// NewMatrixUsecase crea una nueva instancia de matrixUsecase.
func NewMatrixUsecase() MatrixUsecase {
	return &matrixUsecase{}
}

// Rotate rota una matriz según los grados indicados.
// Soporta 90, 180 y 270 grados.
func (u *matrixUsecase) Rotate(matrix domain.Matrix, degrees int) (domain.Matrix, error) {
	if !matrix.IsValid() {
		return nil, fmt.Errorf("invalid matrix: must be non-empty and rectangular")
	}

	switch degrees {
	case 90:
		return rotate90Clockwise(matrix), nil
	case 180:
		return rotate180(matrix), nil
	case 270:
		return rotate270Clockwise(matrix), nil
	default:
		return nil, fmt.Errorf("unsupported degrees: %d (use 90, 180 or 270)", degrees)
	}
}

// rotate90Clockwise rota una matriz 90° en sentido horario.
// Algoritmo: para cada posición (i,j), el resultado va a (j, rows-1-i).
// Complejidad: O(rows × cols)
func rotate90Clockwise(matrix domain.Matrix) domain.Matrix {
	rows := matrix.Rows()
	cols := matrix.Cols()

	result := make(domain.Matrix, cols)
	for i := range result {
		result[i] = make([]int, rows)
	}

	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			result[j][rows-1-i] = matrix[i][j]
		}
	}

	return result
}

// rotate180 rota una matriz 180°.
// Algoritmo: para cada posición (i,j), el resultado va a (rows-1-i, cols-1-j).
// Complejidad: O(rows × cols)
func rotate180(matrix domain.Matrix) domain.Matrix {
	rows := matrix.Rows()
	cols := matrix.Cols()

	result := make(domain.Matrix, rows)
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

// rotate270Clockwise rota una matriz 270° en sentido horario (= 90° antihorario).
// Algoritmo: para cada posición (i,j), el resultado va a (cols-1-j, i).
// Complejidad: O(rows × cols)
func rotate270Clockwise(matrix domain.Matrix) domain.Matrix {
	rows := matrix.Rows()
	cols := matrix.Cols()

	result := make(domain.Matrix, cols)
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
