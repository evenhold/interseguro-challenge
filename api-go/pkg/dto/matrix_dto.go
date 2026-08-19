package dto

import "github.com/user/interseguro-challenge-api-go/internal/infrastructure"

// RotateRequest representa el body de la petición POST /api/matrix/rotate.
type RotateRequest struct {
	Matrix  [][]int `json:"matrix"`
	Degrees int     `json:"degrees"`
}

// QRRequest representa el body de la petición POST /api/matrix/qr.
type QRRequest struct {
	Matrix [][]int `json:"matrix"`
}

// RotateResponse representa la respuesta exitosa de rotación.
type RotateResponse struct {
	Original [][]int `json:"original"`
	Rotated  [][]int `json:"rotated"`
	Degrees  int     `json:"degrees"`
}

// QRResponse representa la respuesta de factorización QR + estadísticas.
type QRResponse struct {
	Original   [][]int            `json:"original"`
	Q          [][]float64        `json:"q"`
	R          [][]float64        `json:"r"`
	Statistics QRStatistics       `json:"statistics"`
}

// QRStatistics contiene estadísticas de Q y R por separado.
type QRStatistics struct {
	Q Statistics `json:"q"`
	R Statistics `json:"r"`
}

// Statistics representa las estadísticas calculadas por api-express.
type Statistics struct {
	Max        int     `json:"max"`
	Min        int     `json:"min"`
	Average    float64 `json:"average"`
	Sum        int     `json:"sum"`
	IsDiagonal bool    `json:"isDiagonal"`
}

// RotateResponseWithStats representa la respuesta de rotación + estadísticas.
type RotateResponseWithStats struct {
	Original   [][]int    `json:"original"`
	Rotated    [][]int    `json:"rotated"`
	Degrees    int        `json:"degrees"`
	Statistics Statistics `json:"statistics"`
}

// StatisticsFromInfra convierte infrastructure.MatrixStatistics a dto.Statistics.
func StatisticsFromInfra(s *infrastructure.MatrixStatistics) Statistics {
	return Statistics{
		Max:        s.Max,
		Min:        s.Min,
		Average:    s.Average,
		Sum:        s.Sum,
		IsDiagonal: s.IsDiagonal,
	}
}
