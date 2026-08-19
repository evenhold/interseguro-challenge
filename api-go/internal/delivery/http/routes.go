package http

import "github.com/gofiber/fiber/v2"

// RegisterRoutes registra todas las rutas de la API.
func RegisterRoutes(app *fiber.App, rotateHandler *MatrixHandler) {
	api := app.Group("/api/v1")

	matrix := api.Group("/matrix")
	matrix.Post("/rotate", rotateHandler.Rotate)
}
