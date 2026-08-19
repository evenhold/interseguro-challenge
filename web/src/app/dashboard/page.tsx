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
}

export default function DashboardPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "API Go", port: ":3001", health: "—", message: "Loading...", ok: false },
    { name: "API Express", port: ":3002", health: "—", message: "Loading...", ok: false },
  ]);

  useEffect(() => {
    fetch(`${API_GO}/health`)
      .then((r) => r.json())
      .then((d) =>
        setServices((s) => [
          { ...s[0], health: d.status, message: d.service, ok: true },
          s[1],
        ])
      )
      .catch(() =>
        setServices((s) => [
          { ...s[0], health: "error", message: "Cannot connect", ok: false },
          s[1],
        ])
      );

    fetch(`${API_GO}/`)
      .then((r) => r.json())
      .then((d) => setServices((s) => [{ ...s[0], message: d.message }, s[1]]))
      .catch(() => {});

    fetch(`${API_EXPRESS}/health`)
      .then((r) => r.json())
      .then((d) =>
        setServices((s) => [
          s[0],
          { ...s[1], health: d.status, message: d.service, ok: true },
        ])
      )
      .catch(() =>
        setServices((s) => [
          s[0],
          { ...s[1], health: "error", message: "Cannot connect", ok: false },
        ])
      );

    fetch(`${API_EXPRESS}/`)
      .then((r) => r.json())
      .then((d) => setServices((s) => [s[0], { ...s[1], message: d.message }]))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">Interseguro</span>
          <a href="/" className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black">
            Matrix
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Servicios</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="mt-12 grid gap-px sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.name}
              className="border border-gray-200 p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{s.name}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    s.ok ? "bg-green-500" : "bg-red-400"
                  }`}
                />
                <span className="text-2xl font-bold">{s.health.toUpperCase()}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{s.message}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
