package middlewares

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

const testSecret = "test-secret-key"

func generateTestToken(user string, expiry time.Duration) string {
	claims := jwt.MapClaims{
		"user": user,
		"exp":  time.Now().Add(expiry).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(testSecret))
	return tokenString
}

func TestJWTMiddleware_ValidToken(t *testing.T) {
	app := fiber.New()
	app.Use(JWTMiddleware(testSecret))
	app.Get("/test", func(c *fiber.Ctx) error {
		user, ok := c.Locals("user").(string)
		if !ok || user != "admin" {
			t.Errorf("expected user 'admin', got %v", c.Locals("user"))
		}
		return c.JSON(fiber.Map{"user": user})
	})

	token := generateTestToken("admin", 1*time.Hour)
	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusOK)
	}
}

func TestJWTMiddleware_NoAuthorizationHeader(t *testing.T) {
	app := fiber.New()
	app.Use(JWTMiddleware(testSecret))
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusUnauthorized)
	}
}

func TestJWTMiddleware_InvalidFormat(t *testing.T) {
	app := fiber.New()
	app.Use(JWTMiddleware(testSecret))
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true})
	})

	tests := []struct {
		name  string
		auth  string
	}{
		{"no bearer prefix", "Token abc123"},
		{"only bearer", "Bearer"},
		{"empty value", "Bearer "},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/test", nil)
			req.Header.Set("Authorization", tt.auth)
			resp, err := app.Test(req)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if resp.StatusCode != http.StatusUnauthorized {
				t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusUnauthorized)
			}
		})
	}
}

func TestJWTMiddleware_ExpiredToken(t *testing.T) {
	app := fiber.New()
	app.Use(JWTMiddleware(testSecret))
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true})
	})

	token := generateTestToken("admin", -1*time.Hour)
	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusUnauthorized)
	}
}

func TestJWTMiddleware_WrongSecret(t *testing.T) {
	app := fiber.New()
	app.Use(JWTMiddleware(testSecret))
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true})
	})

	claims := jwt.MapClaims{
		"user": "admin",
		"exp":  time.Now().Add(1 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte("wrong-secret"))

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer "+tokenString)

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusUnauthorized)
	}
}

func TestJWTMiddleware_InvalidTokenString(t *testing.T) {
	app := fiber.New()
	app.Use(JWTMiddleware(testSecret))
	app.Get("/test", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true})
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer invalid-token-string")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("status = %d, want %d", resp.StatusCode, http.StatusUnauthorized)
	}
}
