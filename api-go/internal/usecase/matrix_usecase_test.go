package usecase

import (
	"reflect"
	"testing"

	"github.com/user/interseguro-challenge-api-go/internal/domain"
)

func TestRotate90Clockwise(t *testing.T) {
	tests := []struct {
		name     string
		input    domain.Matrix
		expected domain.Matrix
	}{
		{
			name:     "2x2 matrix",
			input:    domain.Matrix{{1, 2}, {3, 4}},
			expected: domain.Matrix{{3, 1}, {4, 2}},
		},
		{
			name:     "3x3 matrix",
			input:    domain.Matrix{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}},
			expected: domain.Matrix{{7, 4, 1}, {8, 5, 2}, {9, 6, 3}},
		},
		{
			name:     "2x3 rectangular matrix",
			input:    domain.Matrix{{1, 2, 3}, {4, 5, 6}},
			expected: domain.Matrix{{4, 1}, {5, 2}, {6, 3}},
		},
		{
			name:     "1x1 single element",
			input:    domain.Matrix{{42}},
			expected: domain.Matrix{{42}},
		},
		{
			name:     "1x4 row vector",
			input:    domain.Matrix{{1, 2, 3, 4}},
			expected: domain.Matrix{{1}, {2}, {3}, {4}},
		},
		{
			name:     "4x1 column vector",
			input:    domain.Matrix{{1}, {2}, {3}, {4}},
			expected: domain.Matrix{{4, 3, 2, 1}},
		},
	}

	uc := NewMatrixUsecase()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := uc.Rotate(tt.input, 90)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if !reflect.DeepEqual(got, tt.expected) {
				t.Errorf("Rotate(90) = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestRotate180(t *testing.T) {
	tests := []struct {
		name     string
		input    domain.Matrix
		expected domain.Matrix
	}{
		{
			name:     "2x2 matrix",
			input:    domain.Matrix{{1, 2}, {3, 4}},
			expected: domain.Matrix{{4, 3}, {2, 1}},
		},
		{
			name:     "3x3 matrix",
			input:    domain.Matrix{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}},
			expected: domain.Matrix{{9, 8, 7}, {6, 5, 4}, {3, 2, 1}},
		},
		{
			name:     "2x3 rectangular matrix",
			input:    domain.Matrix{{1, 2, 3}, {4, 5, 6}},
			expected: domain.Matrix{{6, 5, 4}, {3, 2, 1}},
		},
	}

	uc := NewMatrixUsecase()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := uc.Rotate(tt.input, 180)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if !reflect.DeepEqual(got, tt.expected) {
				t.Errorf("Rotate(180) = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestRotate270(t *testing.T) {
	tests := []struct {
		name     string
		input    domain.Matrix
		expected domain.Matrix
	}{
		{
			name:     "2x2 matrix",
			input:    domain.Matrix{{1, 2}, {3, 4}},
			expected: domain.Matrix{{2, 4}, {1, 3}},
		},
		{
			name:     "3x3 matrix",
			input:    domain.Matrix{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}},
			expected: domain.Matrix{{3, 6, 9}, {2, 5, 8}, {1, 4, 7}},
		},
		{
			name:     "2x3 rectangular matrix",
			input:    domain.Matrix{{1, 2, 3}, {4, 5, 6}},
			expected: domain.Matrix{{3, 6}, {2, 5}, {1, 4}},
		},
	}

	uc := NewMatrixUsecase()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := uc.Rotate(tt.input, 270)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if !reflect.DeepEqual(got, tt.expected) {
				t.Errorf("Rotate(270) = %v, want %v", got, tt.expected)
			}
		})
	}
}

func TestRotateInvalidDegrees(t *testing.T) {
	uc := NewMatrixUsecase()
	matrix := domain.Matrix{{1, 2}, {3, 4}}

	_, err := uc.Rotate(matrix, 45)
	if err == nil {
		t.Error("expected error for unsupported degrees, got nil")
	}
}

func TestRotateEmptyMatrix(t *testing.T) {
	uc := NewMatrixUsecase()

	_, err := uc.Rotate(domain.Matrix{}, 90)
	if err == nil {
		t.Error("expected error for empty matrix, got nil")
	}
}

func TestRotateNonRectangularMatrix(t *testing.T) {
	uc := NewMatrixUsecase()

	_, err := uc.Rotate(domain.Matrix{{1, 2}, {3}}, 90)
	if err == nil {
		t.Error("expected error for non-rectangular matrix, got nil")
	}
}

func TestRotateRoundTrip(t *testing.T) {
	uc := NewMatrixUsecase()
	original := domain.Matrix{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}

	// 4 rotaciones de 90° = vuelta al original
	m := original
	for i := 0; i < 4; i++ {
		var err error
		m, err = uc.Rotate(m, 90)
		if err != nil {
			t.Fatalf("unexpected error on rotation %d: %v", i+1, err)
		}
	}

	if !reflect.DeepEqual(m, original) {
		t.Errorf("4x Rotate(90) = %v, want %v (original)", m, original)
	}
}
