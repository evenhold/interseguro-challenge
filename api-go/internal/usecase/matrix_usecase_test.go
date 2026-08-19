package usecase

import (
	"testing"

	"github.com/user/interseguro-challenge-api-go/internal/domain"
)

func TestMatrixUsecase_Rotate_90(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 2, 3}, {4, 5, 6}}
	expected := domain.Matrix{{4, 1}, {5, 2}, {6, 3}}

	result, err := uc.Rotate(input, 90)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(result) != len(expected) || len(result[0]) != len(expected[0]) {
		t.Fatalf("dimensions mismatch: got %dx%d, want %dx%d", len(result), len(result[0]), len(expected), len(expected[0]))
	}

	for i := range expected {
		for j := range expected[i] {
			if result[i][j] != expected[i][j] {
				t.Errorf("result[%d][%d] = %d, want %d", i, j, result[i][j], expected[i][j])
			}
		}
	}
}

func TestMatrixUsecase_Rotate_180(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 2, 3}, {4, 5, 6}}
	expected := domain.Matrix{{6, 5, 4}, {3, 2, 1}}

	result, err := uc.Rotate(input, 180)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for i := range expected {
		for j := range expected[i] {
			if result[i][j] != expected[i][j] {
				t.Errorf("result[%d][%d] = %d, want %d", i, j, result[i][j], expected[i][j])
			}
		}
	}
}

func TestMatrixUsecase_Rotate_270(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 2, 3}, {4, 5, 6}}
	expected := domain.Matrix{{3, 6}, {2, 5}, {1, 4}}

	result, err := uc.Rotate(input, 270)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for i := range expected {
		for j := range expected[i] {
			if result[i][j] != expected[i][j] {
				t.Errorf("result[%d][%d] = %d, want %d", i, j, result[i][j], expected[i][j])
			}
		}
	}
}

func TestMatrixUsecase_Rotate_InvalidMatrix(t *testing.T) {
	uc := NewMatrixUsecase()

	_, err := uc.Rotate(domain.Matrix{}, 90)
	if err == nil {
		t.Error("expected error for empty matrix, got nil")
	}

	_, err = uc.Rotate(domain.Matrix{{}}, 90)
	if err == nil {
		t.Error("expected error for empty row matrix, got nil")
	}
}

func TestMatrixUsecase_Rotate_UnsupportedDegrees(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 2, 3}, {4, 5, 6}}

	_, err := uc.Rotate(input, 45)
	if err == nil {
		t.Error("expected error for unsupported degrees, got nil")
	}
}

func TestMatrixUsecase_Rotate_SquareMatrix(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
	expected90 := domain.Matrix{{7, 4, 1}, {8, 5, 2}, {9, 6, 3}}

	result, err := uc.Rotate(input, 90)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	for i := range expected90 {
		for j := range expected90[i] {
			if result[i][j] != expected90[i][j] {
				t.Errorf("result[%d][%d] = %d, want %d", i, j, result[i][j], expected90[i][j])
			}
		}
	}
}

func TestMatrixUsecase_Rotate_4xRotation(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 2, 3}, {4, 5, 6}}

	// Rotate 90 four times should return original
	result := input
	for i := 0; i < 4; i++ {
		var err error
		result, err = uc.Rotate(result, 90)
		if err != nil {
			t.Fatalf("unexpected error on rotation %d: %v", i+1, err)
		}
	}

	for i := range input {
		for j := range input[i] {
			if result[i][j] != input[i][j] {
				t.Errorf("after 4 rotations result[%d][%d] = %d, want %d", i, j, result[i][j], input[i][j])
			}
		}
	}
}

func TestMatrixUsecase_QRFactorize(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 2, 3}, {4, 5, 6}}

	result, err := uc.QRFactorize(input)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Q == nil || result.R == nil {
		t.Fatal("Q or R is nil")
	}

	// Q should be m×n (2×3)
	if len(result.Q) != 2 || len(result.Q[0]) != 3 {
		t.Errorf("Q dimensions: got %dx%d, want 2x3", len(result.Q), len(result.Q[0]))
	}

	// R should be n×n (3×3)
	if len(result.R) != 3 || len(result.R[0]) != 3 {
		t.Errorf("R dimensions: got %dx%d, want 3x3", len(result.R), len(result.R[0]))
	}

	// Verify Q * R ≈ A
	for i := 0; i < 2; i++ {
		for j := 0; j < 3; j++ {
			sum := 0.0
			for k := 0; k < 3; k++ {
				sum += result.Q[i][k] * result.R[k][j]
			}
			diff := sum - float64(input[i][j])
			if diff > 0.01 || diff < -0.01 {
				t.Errorf("(Q*R)[%d][%d] = %f, want %d", i, j, sum, input[i][j])
			}
		}
	}
}

func TestMatrixUsecase_QRFactorize_InvalidMatrix(t *testing.T) {
	uc := NewMatrixUsecase()

	_, err := uc.QRFactorize(domain.Matrix{})
	if err == nil {
		t.Error("expected error for empty matrix, got nil")
	}
}

func TestMatrixUsecase_QRFactorize_DiagonalMatrix(t *testing.T) {
	uc := NewMatrixUsecase()

	input := domain.Matrix{{1, 0, 0}, {0, 2, 0}, {0, 0, 3}}

	result, err := uc.QRFactorize(input)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// Verify Q * R ≈ A
	for i := 0; i < 3; i++ {
		for j := 0; j < 3; j++ {
			sum := 0.0
			for k := 0; k < 3; k++ {
				sum += result.Q[i][k] * result.R[k][j]
			}
			diff := sum - float64(input[i][j])
			if diff > 0.01 || diff < -0.01 {
				t.Errorf("(Q*R)[%d][%d] = %f, want %d", i, j, sum, input[i][j])
			}
		}
	}
}
