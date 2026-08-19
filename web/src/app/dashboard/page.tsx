"use client";

import { useEffect, useState } from "react";

const API_GO = process.env.NEXT_PUBLIC_API_GO_URL || "http://localhost:3001";
const API_EXPRESS = process.env.NEXT_PUBLIC_API_EXPRESS_URL || "http://localhost:3002";

interface ServiceStatus {
  name: string;
  port: string;
  health: string;
  message: string;
  ok: boolean;
  lastChecked: string;
  responseTime: number;
}

export default function DashboardPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "API Go", port: ":3001", health: "—", message: "Loading...", ok: false, lastChecked: "—", responseTime: 0 },
    { name: "API Express", port: ":3002", health: "—", message: "Loading...", ok: false, lastChecked: "—", responseTime: 0 },
  ]);

  const checkHealth = async () => {
    const now = new Date().toLocaleTimeString();

    // Check API Go
    const goStart = Date.now();
    try {
      const r = await fetch(`${API_GO}/health`);
      const d = await r.json();
      const goTime = Date.now() - goStart;
      setServices((s) => [
        { ...s[0], health: d.status, message: d.service, ok: true, lastChecked: now, responseTime: goTime },
        s[1],
      ]);
    } catch {
      setServices((s) => [
        { ...s[0], health: "error", message: "Cannot connect", ok: false, lastChecked: now, responseTime: 0 },
        s[1],
      ]);
    }

    // Check API Express
    const expressStart = Date.now();
    try {
      const r = await fetch(`${API_EXPRESS}/health`);
      const d = await r.json();
      const expressTime = Date.now() - expressStart;
      setServices((s) => [
        s[0],
        { ...s[1], health: d.status, message: d.service, ok: true, lastChecked: now, responseTime: expressTime },
      ]);
    } catch {
      setServices((s) => [
        s[0],
        { ...s[1], health: "error", message: "Cannot connect", ok: false, lastChecked: now, responseTime: 0 },
      ]);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Interseguro</span>
          </div>
          <a href="/" className="btn-interseguro text-sm">
            Matrix
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-interseguro">Servicios</p>
              <h1 className="mt-2 text-2xl font-bold text-navy">Dashboard</h1>
            </div>
            <button
              onClick={checkHealth}
              className="btn-interseguro text-sm"
            >
              Actualizar
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.name}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{s.name}</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      s.ok ? "bg-success" : "bg-danger"
                    }`}
                  />
                  <span className="text-xl font-bold text-navy">{s.health.toUpperCase()}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{s.message}</p>
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                  <span>Última verificación: {s.lastChecked}</span>
                  <span>{s.responseTime > 0 ? `${s.responseTime}ms` : "—"}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500">
              Los servicios se verifican automáticamente cada 30 segundos. Haz clic en &quot;Actualizar&quot; para verificar ahora.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
