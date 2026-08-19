package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port           string
	Env            string
	Debug          bool
	JWTSecret      string
	JWTExpiryHours int
	AdminUser      string
	AdminPass      string
	InternalSecret string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	debug := env == "development"

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "interseguro-jwt-secret-2024"
	}

	jwtExpiryHours, _ := strconv.Atoi(os.Getenv("JWT_EXPIRY_HOURS"))
	if jwtExpiryHours == 0 {
		jwtExpiryHours = 24
	}

	adminUser := os.Getenv("API_ADMIN_USER")
	if adminUser == "" {
		adminUser = "admin"
	}

	adminPass := os.Getenv("API_ADMIN_PASS")
	if adminPass == "" {
		adminPass = "matrix123"
	}

	internalSecret := os.Getenv("INTERNAL_SECRET")
	if internalSecret == "" {
		internalSecret = "internal-service-secret"
	}

	return &Config{
		Port:           port,
		Env:            env,
		Debug:          debug,
		JWTSecret:      jwtSecret,
		JWTExpiryHours: jwtExpiryHours,
		AdminUser:      adminUser,
		AdminPass:      adminPass,
		InternalSecret: internalSecret,
	}
}

func (c *Config) GetPortInt() int {
	port, _ := strconv.Atoi(c.Port)
	if port == 0 {
		port = 8080
	}
	return port
}
