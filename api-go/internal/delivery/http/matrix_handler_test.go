package http

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/user/interseguro-challenge-api-go/internal/infrastructure"
	"github.com/user/interseguro-challenge-api-go/internal/usecase"
)

// mockExpressServer levanta un servidor HTTP que simula api-express.
func mockExpressServer() *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"data": map[string]interface{}{
				"max": 6, "min": 1, "average": 3.5,
				"sum": 21, "isDiagonal": false,
			},
			"message": "statistics calculated successfully",
		})
	}))
}

func setupTestApp() (*fiber.App, *httptest.Server) {
	mock := mockExpressServer()
	client := infrastructure.NewExpressClient(mock.URL)

	app := fiber.New()
	uc := usecase.NewMatrixUsecase()
	handler := NewMatrixHandler(uc, client)
	RegisterRoutes(app, handler)
	return app, mock
}

func TestRotateHandler90(t *testing.T) {
	app, mock := setupTestApp()
	defer mock.Close()

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
	app, mock := setupTestApp()
	defer mock.Close()

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
	app, mock := setupTestApp()
	defer mock.Close()

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
	app, mock := setupTestApp()
	defer mock.Close()

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
	app, mock := setupTestApp()
	defer mock.Close()

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
