.PHONY: dev build run test lint clean

GOBIN := /usr/local/go/bin/go
SERVER := ./cmd/api

dev:
	$(GOBIN) run $(SERVER)

build:
	$(GOBIN) build -o bin/server $(SERVER)

run: build
	./bin/server

test:
	$(GOBIN) test ./... -v

test-cover:
	$(GOBIN) test ./... -coverprofile=coverage.out
	$(GOBIN) tool cover -html=coverage.out

lint:
	$(GOBIN) vet ./...

clean:
	rm -rf bin/ coverage.out
