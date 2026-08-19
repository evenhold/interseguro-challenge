"use client";

import { useState } from "react";
import MatrixGrid from "@/components/MatrixGrid";

const API_GO = process.env.NEXT_PUBLIC_API_GO_URL || "http://localhost:3001";

interface Statistics {
  max: number;
  min: number;
  average: number;
  sum: number;
  isDiagonal: boolean;
}

interface RotateResult {
  original: number[][];
  rotated: number[][];
  degrees: number;
  statistics: Statistics;
}

export default function Home() {
  const [matrixInput, setMatrixInput] = useState("[[1,2,3],[4,5,6]]");
  const [degrees, setDegrees] = useState(90);
  const [result, setResult] = useState<RotateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRotate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const matrix = JSON.parse(matrixInput);
      const res = await fetch(`${API_GO}/api/v1/matrix/rotate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrix, degrees }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
        return;
      }

      setResult(data.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">Interseguro</span>
          <a href="/dashboard" className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black">
            Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Matrix Rotation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Probar API</h1>

        <div className="mt-12 space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500">
              Matriz (JSON)
            </label>
            <textarea
              value={matrixInput}
              onChange={(e) => setMatrixInput(e.target.value)}
              rows={3}
              className="mt-2 w-full border border-gray-200 p-3 font-mono text-sm focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500">
              Grados
            </label>
            <div className="mt-2 flex gap-2">
              {[90, 180, 270].map((d) => (
                <button
                  key={d}
                  onClick={() => setDegrees(d)}
                  className={`border px-4 py-2 text-sm ${
                    degrees === d
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:border-black"
                  }`}
                >
                  {d}°
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRotate}
            disabled={loading}
            className="border border-black bg-black px-6 py-3 text-sm text-white uppercase tracking-[0.15em] hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Rotando..." : "Rotar"}
          </button>

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 font-mono text-sm text-red-700">
              {error}
            </div>
          )}

          {result && (
            <>
              <div className="border border-gray-200 p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Original</p>
                    <div className="mt-2">
                      <MatrixGrid matrix={result.original} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Rotada ({result.degrees}°)</p>
                    <div className="mt-2">
                      <MatrixGrid matrix={result.rotated} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Estadísticas</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div>
                    <p className="text-xs text-gray-400">Max</p>
                    <p className="text-2xl font-bold">{result.statistics.max}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Min</p>
                    <p className="text-2xl font-bold">{result.statistics.min}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Promedio</p>
                    <p className="text-2xl font-bold">{result.statistics.average.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Suma</p>
                    <p className="text-2xl font-bold">{result.statistics.sum}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Diagonal</p>
                    <p className="text-2xl font-bold">{result.statistics.isDiagonal ? "Sí" : "No"}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
