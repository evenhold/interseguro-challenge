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
	deliveryHTTP "github.com/user/interseguro-challenge-api-go/internal/delivery/http"
	"github.com/user/interseguro-challenge-api-go/internal/config"
	"github.com/user/interseguro-challenge-api-go/internal/handlers"
	"github.com/user/interseguro-challenge-api-go/internal/middlewares"
	"github.com/user/interseguro-challenge-api-go/internal/usecase"
	"go.uber.org/zap"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("no .env file found, using environment variables")
	}

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

	// Health routes (existing)
	app.Get("/health", handlers.Health)
	app.Get("/", handlers.Hello)

	// Matrix rotation routes (new — Clean Architecture)
	matrixUsecase := usecase.NewMatrixUsecase()
	matrixHandler := deliveryHTTP.NewMatrixHandler(matrixUsecase)
	deliveryHTTP.RegisterRoutes(app, matrixHandler)

	// 404 handler
	app.Use(middlewares.NotFoundHandler)

	// Graceful shutdown
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
