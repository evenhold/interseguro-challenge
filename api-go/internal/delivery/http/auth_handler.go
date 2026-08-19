package http

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/user/interseguro-challenge-api-go/internal/config"
)

// AuthHandler maneja las rutas de autenticación
type AuthHandler struct {
	config *config.Config
}

// NewAuthHandler crea una nueva instancia de AuthHandler
func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{config: cfg}
}

// LoginRequest estructura del request de login
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse estructura del response de login
type LoginResponse struct {
	Token string `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
	User string `json:"user"`
}

// Login maneja la autenticación y genera un JWT
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validar credenciales
	if req.Username != h.config.AdminUser || req.Password != h.config.AdminPass {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid credentials",
		})
	}

	// Calcular tiempo de expiración
	expiresAt := time.Now().Add(time.Duration(h.config.JWTExpiryHours) * time.Hour)

	// Crear claims
	claims := jwt.MapClaims{
		"user": req.Username,
		"exp":  expiresAt.Unix(),
	}

	// Crear token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Firmar token
	tokenString, err := token.SignedString([]byte(h.config.JWTSecret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	return c.JSON(LoginResponse{
		Token:     tokenString,
		ExpiresAt: expiresAt,
		User:      req.Username,
	})
}
