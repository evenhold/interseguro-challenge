package http

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/user/interseguro-challenge-api-go/internal/usecase"
)

func setupTestApp() *fiber.App {
	app := fiber.New()
	uc := usecase.NewMatrixUsecase()
	handler := NewMatrixHandler(uc)
	RegisterRoutes(app, handler)
	return app
}

func TestRotateHandler90(t *testing.T) {
	app := setupTestApp()

	body := `{"matrix": [[1,2,3],[4,5,6]], "degrees": 90}`
	req := httptest.NewRequest("POST", "/api/v1/matrix/rotate", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("expected status 200, got %d", resp.StatusCode)
	}

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)

	if result["message"] != "matrix rotated successfully" {
		t.Errorf("unexpected message: %v", result["message"])
	}
}

func TestRotateHandler180(t *testing.T) {
	app := setupTestApp()

	body := `{"matrix": [[1,2],[3,4]], "degrees": 180}`
	req := httptest.NewRequest("POST", "/api/v1/matrix/rotate", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("expected status 200, got %d", resp.StatusCode)
	}
}

func TestRotateHandlerInvalidDegrees(t *testing.T) {
	app := setupTestApp()

	body := `{"matrix": [[1,2],[3,4]], "degrees": 45}`
	req := httptest.NewRequest("POST", "/api/v1/matrix/rotate", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != fiber.StatusBadRequest {
		t.Errorf("expected status 400, got %d", resp.StatusCode)
	}
}

func TestRotateHandlerInvalidJSON(t *testing.T) {
	app := setupTestApp()

	body := `{invalid json}`
	req := httptest.NewRequest("POST", "/api/v1/matrix/rotate", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != fiber.StatusBadRequest {
		t.Errorf("expected status 400, got %d", resp.StatusCode)
	}
}

func TestRotateHandlerEmptyMatrix(t *testing.T) {
	app := setupTestApp()

	body := `{"matrix": [], "degrees": 90}`
	req := httptest.NewRequest("POST", "/api/v1/matrix/rotate", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if resp.StatusCode != fiber.StatusBadRequest {
		t.Errorf("expected status 400, got %d", resp.StatusCode)
	}
}
