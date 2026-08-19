package dto

// RotateRequest representa el body de la petición POST /api/matrix/rotate.
type RotateRequest struct {
	Matrix  [][]int `json:"matrix"`
	Degrees int     `json:"degrees"`
}

// RotateResponse representa la respuesta exitosa de rotación.
type RotateResponse struct {
	Original [][]int `json:"original"`
	Rotated  [][]int `json:"rotated"`
	Degrees  int     `json:"degrees"`
}
