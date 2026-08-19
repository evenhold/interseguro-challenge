"use client";

import { useState } from "react";

const API_GO = process.env.NEXT_PUBLIC_API_GO_URL || "http://localhost:3001";

interface LoginFormProps {
  onLogin: (token: string, user: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_GO}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      onLogin(data.token, data.user);
    } catch {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-interseguro">Autenticación</p>
        <h1 className="mt-2 text-2xl font-bold text-navy">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-interseguro focus:ring-2 focus:ring-interseguro/20 focus:outline-none transition-all"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-interseguro focus:ring-2 focus:ring-interseguro/20 focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="border border-danger/20 bg-danger/5 p-3 rounded-lg text-sm text-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-interseguro w-full"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>


      </div>
    </div>
  );
}
