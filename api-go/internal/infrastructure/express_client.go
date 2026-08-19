package infrastructure

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// MatrixStatistics representa las estadísticas calculadas por api-express.
type MatrixStatistics struct {
	Max       int     `json:"max"`
	Min       int     `json:"min"`
	Average   float64 `json:"average"`
	Sum       int     `json:"sum"`
	IsDiagonal bool   `json:"isDiagonal"`
}

// ExpressClient es el cliente HTTP para comunicarse con api-express.
type ExpressClient struct {
	baseURL    string
	httpClient *http.Client
}

// NewExpressClient crea una nueva instancia de ExpressClient.
func NewExpressClient(baseURL string) *ExpressClient {
	return &ExpressClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// statsRequest representa el body enviado a api-express.
type statsRequest struct {
	Matrix [][]int `json:"matrix"`
}

// statsResponse representa la respuesta de api-express.
type statsResponse struct {
	Data MatrixStatistics `json:"data"`
}

// GetStatistics envía la matriz rotada a api-express y retorna las estadísticas.
func (c *ExpressClient) GetStatistics(matrix [][]int) (*MatrixStatistics, error) {
	body, err := json.Marshal(statsRequest{Matrix: matrix})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal matrix: %w", err)
	}

	url := fmt.Sprintf("%s/api/v1/matrix/statistics", c.baseURL)
	resp, err := c.httpClient.Post(url, "application/json", bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to call api-express: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("api-express returned status %d", resp.StatusCode)
	}

	var result statsResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &result.Data, nil
}
