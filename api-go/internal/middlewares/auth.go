package middlewares

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// JWTMiddleware valida el token JWT en el header Authorization
func JWTMiddleware(jwtSecret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Obtener header Authorization
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header required",
			})
		}

		// Verificar formato "Bearer <token>"
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header must be Bearer {token}",
			})
		}

		tokenString := parts[1]

		// Parsear y validar token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Verificar algoritmo de firma
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid signing method")
			}
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}

		// Extraer claims y guardar en context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Locals("user", claims["user"])
		}

		return c.Next()
	}
}
