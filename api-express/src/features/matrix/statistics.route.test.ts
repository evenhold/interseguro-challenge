import { describe, expect, it } from "vitest";
import { secrets } from "../../config/secrets.js";

describe("POST /api/v1/matrix/statistics", () => {
  it("should return 401 without internal secret", async () => {
    const res = await fetch("http://localhost:3002/api/v1/matrix/statistics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrix: [[1, 2], [3, 4]] }),
    });

    expect(res.status).toBe(401);
  });

  it("should return 401 with wrong internal secret", async () => {
    const res = await fetch("http://localhost:3002/api/v1/matrix/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": "wrong-secret",
      },
      body: JSON.stringify({ matrix: [[1, 2], [3, 4]] }),
    });

    expect(res.status).toBe(401);
  });

  it("should return statistics with valid internal secret", async () => {
    const res = await fetch("http://localhost:3002/api/v1/matrix/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": secrets.internalSecret,
      },
      body: JSON.stringify({ matrix: [[1, 2, 3], [4, 5, 6]] }),
    });

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.data.max).toBe(6);
    expect(data.data.min).toBe(1);
    expect(data.data.sum).toBe(21);
  });
});

describe("GET /health", () => {
  it("should return status ok without authentication", async () => {
    const res = await fetch("http://localhost:3002/health");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
  });
});
