package handlers

import "github.com/gofiber/fiber/v2"

type HealthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

func Health(c *fiber.Ctx) error {
	return c.JSON(HealthResponse{
		Status:  "ok",
		Service: "api-go",
	})
}

func Hello(c *fiber.Ctx) error {
	return c.JSON(MessageResponse{
		Message: "Hola mundo desde Go API",
	})
}
