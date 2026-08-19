package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/interseguro-challenge-api-go/internal/domain"
	"github.com/user/interseguro-challenge-api-go/internal/infrastructure"
	"github.com/user/interseguro-challenge-api-go/internal/usecase"
	"github.com/user/interseguro-challenge-api-go/pkg/dto"
)

// MatrixHandler maneja las peticiones HTTP relacionadas con matrices.
type MatrixHandler struct {
	usecase  usecase.MatrixUsecase
	express  *infrastructure.ExpressClient
}

// NewMatrixHandler crea una nueva instancia de MatrixHandler.
func NewMatrixHandler(uc usecase.MatrixUsecase, express *infrastructure.ExpressClient) *MatrixHandler {
	return &MatrixHandler{usecase: uc, express: express}
}

// Rotate maneja POST /api/matrix/rotate.
// Recibe una matriz y los grados de rotación, retorna la matriz rotada + estadísticas.
func (h *MatrixHandler) Rotate(c *fiber.Ctx) error {
	var req dto.RotateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			dto.ErrorResponse("invalid JSON: " + err.Error()),
		)
	}

	// Validar grados
	if req.Degrees != 90 && req.Degrees != 180 && req.Degrees != 270 {
		return c.Status(fiber.StatusBadRequest).JSON(
			dto.ErrorResponse("degrees must be 90, 180 or 270"),
		)
	}

	// Convertir a domain.Matrix
	matrix := domain.Matrix(req.Matrix)

	// Ejecutar rotación
	rotated, err := h.usecase.Rotate(matrix, req.Degrees)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			dto.ErrorResponse(err.Error()),
		)
	}

	// Llamar a api-express para obtener estadísticas
	stats, err := h.express.GetStatistics([][]int(rotated))
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(
			dto.ErrorResponse("failed to get statistics: "+err.Error()),
		)
	}

	// Respuesta con rotación + estadísticas
	response := dto.RotateResponseWithStats{
		Original:    matrix,
		Rotated:     rotated,
		Degrees:     req.Degrees,
		Statistics:  dto.StatisticsFromInfra(stats),
	}

	return c.Status(fiber.StatusOK).JSON(
		dto.SuccessResponse(response, "matrix rotated successfully"),
	)
}

// QR maneja POST /api/matrix/qr.
// Recibe una matriz, calcula factorización QR, envía Q y R a api-express para estadísticas.
func (h *MatrixHandler) QR(c *fiber.Ctx) error {
	var req dto.QRRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			dto.ErrorResponse("invalid JSON: " + err.Error()),
		)
	}

	matrix := domain.Matrix(req.Matrix)

	// Ejecutar factorización QR
	qrResult, err := h.usecase.QRFactorize(matrix)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(
			dto.ErrorResponse(err.Error()),
		)
	}

	// Convertir Q y R a [][]int para api-express (stats trabaja con enteros)
	qInt := floatToIntMatrix(qrResult.Q)
	rInt := floatToIntMatrix(qrResult.R)

	// Obtener estadísticas de Q
	statsQ, err := h.express.GetStatistics(qInt)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(
			dto.ErrorResponse("failed to get Q statistics: "+err.Error()),
		)
	}

	// Obtener estadísticas de R
	statsR, err := h.express.GetStatistics(rInt)
	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(
			dto.ErrorResponse("failed to get R statistics: "+err.Error()),
		)
	}

	// Respuesta con Q, R y estadísticas
	response := dto.QRResponse{
		Original: req.Matrix,
		Q:        qrResult.Q,
		R:        qrResult.R,
		Statistics: dto.QRStatistics{
			Q: dto.StatisticsFromInfra(statsQ),
			R: dto.StatisticsFromInfra(statsR),
		},
	}

	return c.Status(fiber.StatusOK).JSON(
		dto.SuccessResponse(response, "QR factorization completed successfully"),
	)
}

// floatToIntMatrix convierte [][]float64 a [][]int redondeando al entero más cercano.
func floatToIntMatrix(m [][]float64) [][]int {
	result := make([][]int, len(m))
	for i, row := range m {
		result[i] = make([]int, len(row))
		for j, v := range row {
			result[i][j] = int(v + 0.5)
		}
	}
	return result
}
