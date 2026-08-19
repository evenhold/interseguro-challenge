"use client";

import { useEffect, useState } from "react";

const API_GO = process.env.NEXT_PUBLIC_API_GO_URL || "http://localhost:3001";
const API_EXPRESS = process.env.NEXT_PUBLIC_API_EXPRESS_URL || "http://localhost:3002";

interface ServiceStatus {
  name: string;
  health: string;
  message: string;
  ok: boolean;
}

export default function Home() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "API Go (Fiber)", health: "Loading...", message: "Loading...", ok: false },
    { name: "API Express", health: "Loading...", message: "Loading...", ok: false },
  ]);

  useEffect(() => {
    fetch(`${API_GO}/health`)
      .then((r) => r.json())
      .then((d) => setServices((s) => [{ ...s[0], health: `${d.status} - ${d.service}`, ok: true }, s[1]]))
      .catch(() => setServices((s) => [{ ...s[0], health: "Error", message: "Cannot connect", ok: false }, s[1]]));

    fetch(`${API_GO}/`)
      .then((r) => r.json())
      .then((d) => setServices((s) => [{ ...s[0], message: d.message }, s[1]]))
      .catch(() => {});

    fetch(`${API_EXPRESS}/health`)
      .then((r) => r.json())
      .then((d) => setServices((s) => [s[0], { ...s[1], health: `${d.status} - ${d.service}`, ok: true }]))
      .catch(() => setServices((s) => [s[0], { ...s[1], health: "Error", message: "Cannot connect", ok: false }]));

    fetch(`${API_EXPRESS}/`)
      .then((r) => r.json())
      .then((d) => setServices((s) => [s[0], { ...s[1], message: d.message }]))
      .catch(() => {});
  }, []);

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Interseguro Challenge</h1>
      <p style={{ color: "#666" }}>Microservicios — Go + Express</p>

      {services.map((s) => (
        <div
          key={s.name}
          style={{
            padding: "1rem",
            marginTop: "1rem",
            border: `1px solid ${s.ok ? "#22c55e" : "#e5e7eb"}`,
            borderRadius: "8px",
            backgroundColor: s.ok ? "#f0fdf4" : "#fef2f2",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1rem" }}>{s.name}</h2>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>
            <strong>Health:</strong> {s.health}
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
            <strong>Message:</strong> {s.message}
          </p>
        </div>
      ))}
    </main>
  );
}
