package http

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/interseguro-challenge-api-go/internal/config"
	"github.com/user/interseguro-challenge-api-go/internal/middlewares"
)

// RegisterRoutes registra todas las rutas de la API.
func RegisterRoutes(app *fiber.App, matrixHandler *MatrixHandler, authHandler *AuthHandler, cfg *config.Config) {
	// Rutas públicas (sin autenticación)
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "api-go",
		})
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "API Go - Matrix Operations",
		})
	})

	// Ruta de login (pública)
	api := app.Group("/api/v1")
	auth := api.Group("/auth")
	auth.Post("/login", authHandler.Login)

	// Rutas protegidas con JWT
	matrix := api.Group("/matrix")
	matrix.Use(middlewares.JWTMiddleware(cfg.JWTSecret))
	matrix.Post("/rotate", matrixHandler.Rotate)
	matrix.Post("/qr", matrixHandler.QR)
}
