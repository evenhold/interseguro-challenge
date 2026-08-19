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

interface QRResult {
  original: number[][];
  q: number[][];
  r: number[][];
  statistics: { q: Statistics; r: Statistics };
}

export default function Home() {
  const [matrixInput, setMatrixInput] = useState("[[1,2,3],[4,5,6]]");
  const [degrees, setDegrees] = useState(90);
  const [activeOp, setActiveOp] = useState<"rotate" | "qr">("rotate");
  const [rotateResult, setRotateResult] = useState<RotateResult | null>(null);
  const [qrResult, setQRResult] = useState<QRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRotate = async () => {
    setLoading(true);
    setError(null);
    setQRResult(null);
    setActiveOp("rotate");

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

      setRotateResult(data.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQR = async () => {
    setLoading(true);
    setError(null);
    setRotateResult(null);
    setActiveOp("qr");

    try {
      const matrix = JSON.parse(matrixInput);
      const res = await fetch(`${API_GO}/api/v1/matrix/qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrix }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
        return;
      }

      setQRResult(data.data);
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
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Matrix Operations</p>
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

          {activeOp === "rotate" && (
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
          )}

          <div className="flex gap-3">
            <button
              onClick={handleRotate}
              disabled={loading}
              className={`border px-6 py-3 text-sm uppercase tracking-[0.15em] disabled:opacity-50 ${
                activeOp === "rotate"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-600 hover:border-black"
              }`}
            >
              {loading && activeOp === "rotate" ? "Procesando..." : "Rotar"}
            </button>
            <button
              onClick={handleQR}
              disabled={loading}
              className={`border px-6 py-3 text-sm uppercase tracking-[0.15em] disabled:opacity-50 ${
                activeOp === "qr"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-gray-600 hover:border-black"
              }`}
            >
              {loading && activeOp === "qr" ? "Procesando..." : "Factorización QR"}
            </button>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 font-mono text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Resultado de Rotación */}
          {rotateResult && (
            <>
              <div className="border border-gray-200 p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Original</p>
                    <div className="mt-2">
                      <MatrixGrid matrix={rotateResult.original} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Rotada ({rotateResult.degrees}°)</p>
                    <div className="mt-2">
                      <MatrixGrid matrix={rotateResult.rotated} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Estadísticas</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div>
                    <p className="text-xs text-gray-400">Max</p>
                    <p className="text-2xl font-bold">{rotateResult.statistics.max}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Min</p>
                    <p className="text-2xl font-bold">{rotateResult.statistics.min}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Promedio</p>
                    <p className="text-2xl font-bold">{rotateResult.statistics.average.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Suma</p>
                    <p className="text-2xl font-bold">{rotateResult.statistics.sum}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Diagonal</p>
                    <p className="text-2xl font-bold">{rotateResult.statistics.isDiagonal ? "Sí" : "No"}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Resultado de QR */}
          {qrResult && (
            <>
              <div className="border border-gray-200 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Matrices Q y R</p>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Q (Ortogonal)</p>
                    <div className="mt-2">
                      <MatrixGrid matrix={qrResult.q.map(row => row.map(v => Math.round(v * 10000) / 10000))} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">R (Triangular Superior)</p>
                    <div className="mt-2">
                      <MatrixGrid matrix={qrResult.r.map(row => row.map(v => Math.round(v * 10000) / 10000))} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Estadísticas Q</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div>
                    <p className="text-xs text-gray-400">Max</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.q.max}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Min</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.q.min}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Promedio</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.q.average.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Suma</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.q.sum}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Diagonal</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.q.isDiagonal ? "Sí" : "No"}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Estadísticas R</p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div>
                    <p className="text-xs text-gray-400">Max</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.r.max}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Min</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.r.min}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Promedio</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.r.average.toFixed(3)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Suma</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.r.sum}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Diagonal</p>
                    <p className="text-2xl font-bold">{qrResult.statistics.r.isDiagonal ? "Sí" : "No"}</p>
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
