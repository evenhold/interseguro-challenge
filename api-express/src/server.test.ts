import { describe, expect, it } from "vitest";

interface HealthResponse {
  status: string;
  service: string;
}

interface MessageResponse {
  message: string;
}

describe("API Express", () => {
  it("GET /health should return status ok", async () => {
    const res = await fetch("http://localhost:3002/health");
    const data = (await res.json()) as HealthResponse;

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.service).toBe("api-express");
  });

  it("GET / should return hello message", async () => {
    const res = await fetch("http://localhost:3002/");
    const data = (await res.json()) as MessageResponse;

    expect(res.status).toBe(200);
    expect(data.message).toBe("Hola mundo desde Express API");
  });
});
