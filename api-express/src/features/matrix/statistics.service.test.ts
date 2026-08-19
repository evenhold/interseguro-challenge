import { describe, expect, it } from "vitest";
import { calculateStatistics } from "./statistics.service.js";

describe("calculateStatistics", () => {
  it("should calculate stats for a 2x2 matrix", () => {
    const matrix = [
      [1, 5],
      [3, 2],
    ];
    const result = calculateStatistics(matrix);

    expect(result.max).toBe(5);
    expect(result.min).toBe(1);
    expect(result.sum).toBe(11);
    expect(result.average).toBe(2.75);
    expect(result.isDiagonal).toBe(false);
  });

  it("should calculate stats for a 3x3 matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const result = calculateStatistics(matrix);

    expect(result.max).toBe(9);
    expect(result.min).toBe(1);
    expect(result.sum).toBe(45);
    expect(result.average).toBe(5);
    expect(result.isDiagonal).toBe(false);
  });

  it("should return isDiagonal=true for diagonal matrix", () => {
    const matrix = [
      [5, 0, 0],
      [0, 3, 0],
      [0, 0, 7],
    ];
    const result = calculateStatistics(matrix);

    expect(result.max).toBe(7);
    expect(result.min).toBe(0);
    expect(result.sum).toBe(15);
    expect(result.isDiagonal).toBe(true);
  });

  it("should return isDiagonal=false for non-diagonal matrix", () => {
    const matrix = [
      [5, 1, 0],
      [0, 3, 0],
      [0, 0, 7],
    ];
    const result = calculateStatistics(matrix);

    expect(result.isDiagonal).toBe(false);
  });

  it("should handle a single element matrix", () => {
    const matrix = [[42]];
    const result = calculateStatistics(matrix);

    expect(result.max).toBe(42);
    expect(result.min).toBe(42);
    expect(result.sum).toBe(42);
    expect(result.average).toBe(42);
    expect(result.isDiagonal).toBe(true);
  });

  it("should handle negative numbers", () => {
    const matrix = [
      [-3, 1],
      [2, -5],
    ];
    const result = calculateStatistics(matrix);

    expect(result.max).toBe(2);
    expect(result.min).toBe(-5);
    expect(result.sum).toBe(-5);
    expect(result.average).toBe(-1.25);
  });

  it("should handle rectangular matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const result = calculateStatistics(matrix);

    expect(result.max).toBe(6);
    expect(result.min).toBe(1);
    expect(result.sum).toBe(21);
    expect(result.average).toBe(3.5);
    expect(result.isDiagonal).toBe(false);
  });

  it("should throw on empty matrix", () => {
    expect(() => calculateStatistics([])).toThrow("matrix must be non-empty");
  });

  it("should throw on empty row", () => {
    expect(() => calculateStatistics([[]])).toThrow("matrix must be non-empty");
  });
});
