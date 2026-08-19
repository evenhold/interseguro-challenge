import { describe, expect, it } from "vitest";
import { calculateStatistics } from "./statistics.service.js";

describe("calculateStatistics", () => {
  it("should calculate correct statistics for a 2x3 matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];

    const stats = calculateStatistics(matrix);

    expect(stats.max).toBe(6);
    expect(stats.min).toBe(1);
    expect(stats.sum).toBe(21);
    expect(stats.average).toBe(3.5);
    expect(stats.isDiagonal).toBe(false);
  });

  it("should calculate correct statistics for a 1x1 matrix", () => {
    const matrix = [[42]];

    const stats = calculateStatistics(matrix);

    expect(stats.max).toBe(42);
    expect(stats.min).toBe(42);
    expect(stats.sum).toBe(42);
    expect(stats.average).toBe(42);
    expect(stats.isDiagonal).toBe(true);
  });

  it("should calculate correct statistics for a diagonal matrix", () => {
    const matrix = [
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 3],
    ];

    const stats = calculateStatistics(matrix);

    expect(stats.max).toBe(3);
    expect(stats.min).toBe(0);
    expect(stats.sum).toBe(6);
    expect(stats.average).toBe(6 / 9);
    expect(stats.isDiagonal).toBe(true);
  });

  it("should calculate correct statistics for a non-diagonal matrix", () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ];

    const stats = calculateStatistics(matrix);

    expect(stats.max).toBe(4);
    expect(stats.min).toBe(1);
    expect(stats.isDiagonal).toBe(false);
  });

  it("should handle negative numbers", () => {
    const matrix = [
      [-5, 3],
      [10, -2],
    ];

    const stats = calculateStatistics(matrix);

    expect(stats.max).toBe(10);
    expect(stats.min).toBe(-5);
    expect(stats.sum).toBe(6);
    expect(stats.average).toBe(1.5);
    expect(stats.isDiagonal).toBe(false);
  });

  it("should handle matrix with all zeros", () => {
    const matrix = [
      [0, 0],
      [0, 0],
    ];

    const stats = calculateStatistics(matrix);

    expect(stats.max).toBe(0);
    expect(stats.min).toBe(0);
    expect(stats.sum).toBe(0);
    expect(stats.average).toBe(0);
    expect(stats.isDiagonal).toBe(true);
  });

  it("should throw error for empty matrix", () => {
    expect(() => calculateStatistics([])).toThrow("matrix must be non-empty");
  });

  it("should throw error for matrix with empty row", () => {
    expect(() => calculateStatistics([[]])).toThrow("matrix must be non-empty");
  });

  it("should calculate correct average with decimals", () => {
    const matrix = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];

    const stats = calculateStatistics(matrix);

    expect(stats.average).toBe(3.5);
    expect(stats.sum).toBe(21);
  });
});
