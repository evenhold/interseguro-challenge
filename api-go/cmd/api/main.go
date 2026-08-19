package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/user/interseguro-challenge-api-go/internal/config"
	"github.com/user/interseguro-challenge-api-go/internal/handlers"
	"github.com/user/interseguro-challenge-api-go/internal/middlewares"
	"go.uber.org/zap"
)

func main() {
	godotenv.Load()

	cfg := config.Load()
	logger := config.NewLogger(cfg.Debug)
	defer logger.Sync()

	app := fiber.New(fiber.Config{
		ErrorHandler: middlewares.ErrorHandler(logger),
	})

	app.Use(cors.New())
	app.Use(func(c *fiber.Ctx) error {
		start := time.Now()
		err := c.Next()
		logger.Info("request",
			zap.String("method", c.Method()),
			zap.String("path", c.Path()),
			zap.Int("status", c.Response().StatusCode()),
			zap.Duration("latency", time.Since(start)),
		)
		return err
	})

	app.Get("/health", handlers.Health)
	app.Get("/", handlers.Hello)

	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Not found",
		})
	})

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		<-ctx.Done()
		logger.Info("shutting down gracefully")
		_ = app.Shutdown()
	}()

	logger.Info("server starting", zap.String("port", cfg.Port))
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
