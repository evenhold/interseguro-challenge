package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/interseguro-challenge-api-go/internal/domain"
	"github.com/user/interseguro-challenge-api-go/internal/usecase"
	"github.com/user/interseguro-challenge-api-go/pkg/dto"
)

// MatrixHandler maneja las peticiones HTTP relacionadas con matrices.
type MatrixHandler struct {
	usecase usecase.MatrixUsecase
}

// NewMatrixHandler crea una nueva instancia de MatrixHandler.
func NewMatrixHandler(uc usecase.MatrixUsecase) *MatrixHandler {
	return &MatrixHandler{usecase: uc}
}

// Rotate maneja POST /api/matrix/rotate.
// Recibe una matriz y los grados de rotación, retorna la matriz rotada.
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

	// Respuesta
	response := dto.RotateResponse{
		Original: matrix,
		Rotated:  rotated,
		Degrees:  req.Degrees,
	}

	return c.Status(fiber.StatusOK).JSON(
		dto.SuccessResponse(response, "matrix rotated successfully"),
	)
}
