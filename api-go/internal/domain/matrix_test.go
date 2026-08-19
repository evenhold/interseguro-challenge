package domain

import "testing"

func TestMatrix_Rows(t *testing.T) {
	tests := []struct {
		name   string
		matrix Matrix
		want   int
	}{
		{"2x3 matrix", Matrix{{1, 2, 3}, {4, 5, 6}}, 2},
		{"1x1 matrix", Matrix{{1}}, 1},
		{"empty matrix", Matrix{}, 0},
		{"3x2 matrix", Matrix{{1, 2}, {3, 4}, {5, 6}}, 3},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.matrix.Rows(); got != tt.want {
				t.Errorf("Rows() = %d, want %d", got, tt.want)
			}
		})
	}
}

func TestMatrix_Cols(t *testing.T) {
	tests := []struct {
		name   string
		matrix Matrix
		want   int
	}{
		{"2x3 matrix", Matrix{{1, 2, 3}, {4, 5, 6}}, 3},
		{"1x1 matrix", Matrix{{1}}, 1},
		{"empty matrix", Matrix{}, 0},
		{"3x2 matrix", Matrix{{1, 2}, {3, 4}, {5, 6}}, 2},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.matrix.Cols(); got != tt.want {
				t.Errorf("Cols() = %d, want %d", got, tt.want)
			}
		})
	}
}

func TestMatrix_IsEmpty(t *testing.T) {
	tests := []struct {
		name   string
		matrix Matrix
		want   bool
	}{
		{"non-empty matrix", Matrix{{1, 2, 3}}, false},
		{"empty matrix", Matrix{}, true},
		{"nil matrix", nil, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.matrix.IsEmpty(); got != tt.want {
				t.Errorf("IsEmpty() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestMatrix_IsValid(t *testing.T) {
	tests := []struct {
		name   string
		matrix Matrix
		want   bool
	}{
		{"valid 2x3", Matrix{{1, 2, 3}, {4, 5, 6}}, true},
		{"valid 1x1", Matrix{{1}}, true},
		{"empty matrix", Matrix{}, false},
		{"nil matrix", nil, false},
		{"empty row", Matrix{{}}, false},
		{"jagged matrix", Matrix{{1, 2}, {3}}, false},
		{"rectangular valid", Matrix{{1, 2, 3, 4}}, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.matrix.IsValid(); got != tt.want {
				t.Errorf("IsValid() = %v, want %v", got, tt.want)
			}
		})
	}
}
