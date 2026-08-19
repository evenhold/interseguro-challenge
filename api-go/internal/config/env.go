package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port  string
	Env   string
	Debug bool
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("NODE_ENV")
	if env == "" {
		env = "development"
	}

	debug := env == "development"

	return &Config{
		Port:  port,
		Env:   env,
		Debug: debug,
	}
}

func (c *Config) GetPortInt() int {
	port, _ := strconv.Atoi(c.Port)
	if port == 0 {
		port = 8080
	}
	return port
}
