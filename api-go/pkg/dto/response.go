package dto

// APIResponse es una respuesta genérica para todos los endpoints.
type APIResponse struct {
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

// SuccessResponse retorna una respuesta exitosa con datos.
func SuccessResponse(data interface{}, message string) APIResponse {
	return APIResponse{
		Data:    data,
		Message: message,
	}
}

// ErrorResponse retorna una respuesta de error.
func ErrorResponse(err string) APIResponse {
	return APIResponse{
		Error: err,
	}
}
