import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3002";

interface StatisticsData {
  max: number;
  min: number;
  average: number;
  sum: number;
  isDiagonal: boolean;
}

interface StatisticsResponse {
  data: StatisticsData;
  message: string;
}

interface ErrorResponse {
  error: string;
}

describe("POST /api/v1/matrix/statistics", () => {
  it("should return statistics for valid matrix", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/matrix/statistics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrix: [[1, 5], [3, 2]] }),
    });
    const data = (await res.json()) as StatisticsResponse;

    expect(res.status).toBe(200);
    expect(data.data).toEqual({
      max: 5,
      min: 1,
      average: 2.75,
      sum: 11,
      isDiagonal: false,
    });
    expect(data.message).toBe("statistics calculated successfully");
  });

  it("should return 400 for empty matrix", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/matrix/statistics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrix: [] }),
    });
    const data = (await res.json()) as ErrorResponse;

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("should return 400 for missing matrix", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/matrix/statistics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = (await res.json()) as ErrorResponse;

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("should return 400 for non-array matrix", async () => {
    const res = await fetch(`${BASE_URL}/api/v1/matrix/statistics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matrix: "not-an-array" }),
    });
    const data = (await res.json()) as ErrorResponse;

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });
});
