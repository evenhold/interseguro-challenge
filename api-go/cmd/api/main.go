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
	deliveryHTTP "github.com/user/interseguro-challenge-api-go/internal/delivery/http"
	"github.com/user/interseguro-challenge-api-go/internal/infrastructure"
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

	// Matrix rotation routes (Clean Architecture)
	matrixUsecase := usecase.NewMatrixUsecase()

	// Express client para estadísticas
	expressURL := os.Getenv("API_EXPRESS_URL")
	if expressURL == "" {
		expressURL = "http://api-express:3000"
	}
	expressClient := infrastructure.NewExpressClient(expressURL, cfg.InternalSecret)

	// Auth handler
	authHandler := deliveryHTTP.NewAuthHandler(cfg)

	// Matrix handler
	matrixHandler := deliveryHTTP.NewMatrixHandler(matrixUsecase, expressClient)

	// Register routes
	deliveryHTTP.RegisterRoutes(app, matrixHandler, authHandler, cfg)

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
