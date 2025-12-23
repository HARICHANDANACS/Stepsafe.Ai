"use client";
import { useEffect, useState } from "react";
import { saveSession } from "@/lib/store";
import { AgeGroup, ActivityLevel } from "@/lib/types";
import Link from "next/link";

export default function InputPage() {
  const [city, setCity] = useState("");
  const [age, setAge] = useState<AgeGroup>("adult");
  const [activity, setActivity] = useState<ActivityLevel>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchClimate(q: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/climate?${q}&age=${age}&activity=${activity}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      const advRes = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const advJson = await advRes.json();
      const session = { ...json, advisory: advJson.advisory };
      saveSession(session);
      window.location.href = "/risks";
    } catch (e: unknown) {
      setError((e as Error).message ?? "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  function autoDetect() {
    if (!navigator.geolocation) {
      setError("Geolocation unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchClimate(`lat=${latitude}&lon=${longitude}`);
      },
      () => setError("Location permission denied")
    );
  }

  function submitManual() {
    if (!city) return setError("Please enter a city");
    fetchClimate(`city=${encodeURIComponent(city)}`);
  }

  useEffect(() => {
    setError(null);
  }, [city, age, activity]);

  return (
    <section style={{ display: "grid", placeItems: "center", padding: "20px 0" }}>
      <div style={{ maxWidth: 640, width: "100%", background: "#f7fbfa", border: "1px solid #e6f0ec", borderRadius: 16, padding: 22 }}>
        <div style={{ textAlign: "center", marginBottom: 16, color: "#183c3c", fontWeight: 700, fontSize: 24 }}>
          Tell us about you
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ fontWeight: 600, color: "#325050" }}>Location</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
            style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #cfe0db" }}
          />
          <button onClick={autoDetect} style={{ background: "transparent", border: "none", color: "#0b6b57", textAlign: "left" }}>
            Auto-detect location
          </button>
          <label style={{ fontWeight: 600, color: "#325050", marginTop: 10 }}>Age Group (Optional)</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["child", "adult", "elderly"] as AgeGroup[]).map((a) => (
              <button
                key={a}
                onClick={() => setAge(a)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #cfe0db",
                  background: age === a ? "#e7f3f0" : "#fff",
                  color: "#0b6b57",
                }}
              >
                {a[0].toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
          <label style={{ fontWeight: 600, color: "#325050", marginTop: 10 }}>Outdoor Activity Level (Optional)</label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["low", "medium", "high"] as ActivityLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActivity(lvl)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #cfe0db",
                  background: activity === lvl ? "#e7f3f0" : "#fff",
                  color: "#0b6b57",
                }}
              >
                {lvl[0].toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
          {error && <div style={{ color: "#8b2b20" }}>{error}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              disabled={loading}
              onClick={submitManual}
              style={{
                background: "#0b6b57",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: 10,
                fontWeight: 700,
              }}
            >
              Continue
            </button>
            <Link href="/" style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #cfe0db", color: "#0b6b57" }}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
