"use client";

import { useState, useEffect } from "react";
import MatrixGrid from "@/components/MatrixGrid";
import LoginForm from "@/components/LoginForm";

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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [matrixInput, setMatrixInput] = useState("[[1,2,3],[4,5,6]]");
  const [degrees, setDegrees] = useState(90);
  const [activeOp, setActiveOp] = useState<"rotate" | "qr" | null>(null);
  const [rotateResult, setRotateResult] = useState<RotateResult | null>(null);
  const [qrResult, setQRResult] = useState<QRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for saved token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("jwt_token");
    const savedUser = localStorage.getItem("jwt_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (newToken: string, newUser: string) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("jwt_token", newToken);
    localStorage.setItem("jwt_user", newUser);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("jwt_user");
    setRotateResult(null);
    setQRResult(null);
  };

  const handleClear = () => {
    setMatrixInput("[[1,2,3],[4,5,6]]");
    setDegrees(90);
    setActiveOp(null);
    setRotateResult(null);
    setQRResult(null);
    setError(null);
  };

  const handleExample = () => {
    const examples = [
      "[[1,2],[3,4]]",
      "[[1,2,3],[4,5,6]]",
      "[[1,2,3],[4,5,6],[7,8,9]]",
      "[[5,6,1],[4,7,3],[2,8,9]]",
      "[[1,0,0],[0,2,0],[0,0,3]]",
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setMatrixInput(random);
    setActiveOp(null);
    setRotateResult(null);
    setQRResult(null);
    setError(null);
  };

  const handleRotate = async () => {
    setLoading(true);
    setError(null);
    setQRResult(null);
    setActiveOp("rotate");

    try {
      const matrix = JSON.parse(matrixInput);
      const res = await fetch(`${API_GO}/api/v1/matrix/rotate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ matrix, degrees }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          setError("Session expired. Please login again.");
          return;
        }
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
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ matrix }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          setError("Session expired. Please login again.");
          return;
        }
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

  // Show login if no token
  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Interseguro</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hola, {user}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
            >
              Salir
            </button>
            <a href="/dashboard" className="btn-interseguro text-sm">
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-interseguro">Matrix Operations</p>
          <h1 className="mt-2 text-2xl font-bold text-navy">Probar API</h1>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Matriz (JSON)
              </label>
              <textarea
                value={matrixInput}
                onChange={(e) => {
                  setMatrixInput(e.target.value);
                  setActiveOp(null);
                }}
                rows={3}
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 font-mono text-sm focus:border-interseguro focus:ring-2 focus:ring-interseguro/20 focus:outline-none transition-all"
              />
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-500">
                  Ejemplos: [[1,2],[3,4]] (2×2) — [[1,2,3],[4,5,6]] (2×3) — [[1,2,3],[4,5,6],[7,8,9]] (3×3)
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Rotar</span>: gira la matriz 90°, 180° o 270°
                </p>
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Factorización QR</span>: descompone en matrices Q (ortogonal) y R (triangular superior)
                </p>
              </div>
            </div>

            {activeOp !== "qr" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grados
                </label>
                <div className="mt-2 flex gap-2">
                  {[90, 180, 270].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDegrees(d);
                        setActiveOp(null);
                      }}
                      className={`px-4 py-2 text-sm font-medium transition-all ${
                        degrees === d
                          ? "bg-interseguro text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {d}°
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100" />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRotate}
                disabled={loading}
                className={`btn-interseguro ${activeOp === "rotate" ? "ring-2 ring-interseguro-light ring-offset-2" : ""}`}
              >
                {loading && activeOp === "rotate" ? "Procesando..." : "Rotar"}
              </button>
              <button
                onClick={handleQR}
                disabled={loading}
                className={`btn-interseguro ${activeOp === "qr" ? "ring-2 ring-interseguro-light ring-offset-2" : ""}`}
              >
                {loading && activeOp === "qr" ? "Procesando..." : "Factorización QR"}
              </button>
              <button
                onClick={handleExample}
                disabled={loading}
                className="px-5 py-3 text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
              >
                Ejemplo
              </button>
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-5 py-3 text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
              >
                Limpiar
              </button>
            </div>

            {error && (
              <div className="border border-danger/20 bg-danger/5 p-4 rounded-lg text-sm text-danger">
                {error}
              </div>
            )}

            {/* Resultado de Rotación */}
            {rotateResult && (
              <>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Original</p>
                      <div className="mt-3">
                        <MatrixGrid matrix={rotateResult.original} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Rotada ({rotateResult.degrees}°)</p>
                      <div className="mt-3">
                        <MatrixGrid matrix={rotateResult.rotated} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Estadísticas</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <div>
                      <p className="text-xs text-gray-500">Max</p>
                      <p className="text-xl font-bold text-navy">{rotateResult.statistics.max}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Min</p>
                      <p className="text-xl font-bold text-navy">{rotateResult.statistics.min}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Promedio</p>
                      <p className="text-xl font-bold text-navy">{rotateResult.statistics.average.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Suma</p>
                      <p className="text-xl font-bold text-navy">{rotateResult.statistics.sum}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Diagonal</p>
                      <p className="text-xl font-bold text-navy">{rotateResult.statistics.isDiagonal ? "Sí" : "No"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Resultado de QR */}
            {qrResult && (
              <>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Matrices Q y R</p>
                  <div className="mt-4 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Q (Ortogonal)</p>
                      <div className="mt-3">
                        <MatrixGrid matrix={qrResult.q.map(row => row.map(v => Math.round(v * 10000) / 10000))} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">R (Triangular Superior)</p>
                      <div className="mt-3">
                        <MatrixGrid matrix={qrResult.r.map(row => row.map(v => Math.round(v * 10000) / 10000))} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Estadísticas Q</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <div>
                      <p className="text-xs text-gray-500">Max</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.q.max}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Min</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.q.min}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Promedio</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.q.average.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Suma</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.q.sum}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Diagonal</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.q.isDiagonal ? "Sí" : "No"}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Estadísticas R</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <div>
                      <p className="text-xs text-gray-500">Max</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.r.max}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Min</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.r.min}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Promedio</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.r.average.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Suma</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.r.sum}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Diagonal</p>
                      <p className="text-xl font-bold text-navy">{qrResult.statistics.r.isDiagonal ? "Sí" : "No"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
