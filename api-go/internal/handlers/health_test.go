package handlers

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func setupApp() *fiber.App {
	app := fiber.New()
	app.Get("/health", Health)
	app.Get("/", Hello)
	return app
}

func TestHealth(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest("GET", "/health", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}

	var body HealthResponse
	json.NewDecoder(resp.Body).Decode(&body)

	if body.Status != "ok" {
		t.Errorf("expected status ok, got %s", body.Status)
	}
	if body.Service != "api-go" {
		t.Errorf("expected service api-go, got %s", body.Service)
	}
}

func TestHello(t *testing.T) {
	app := setupApp()

	req := httptest.NewRequest("GET", "/", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("expected 200, got %d", resp.StatusCode)
	}

	var body MessageResponse
	json.NewDecoder(resp.Body).Decode(&body)

	if body.Message != "Hola mundo desde Go API" {
		t.Errorf("expected hello message, got %s", body.Message)
	}
}

func TestNotFound(t *testing.T) {
	app := setupApp()
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(404).JSON(fiber.Map{"error": "Not found"})
	})

	req := httptest.NewRequest("GET", "/nonexistent", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}

	if resp.StatusCode != 404 {
		t.Errorf("expected 404, got %d", resp.StatusCode)
	}
}
