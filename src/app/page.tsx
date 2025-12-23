import Link from "next/link";

export default function Home() {
  return (
    <section style={{ display: "grid", placeItems: "center", padding: "40px 0" }}>
      <div style={{ textAlign: "center", maxWidth: 760 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ width: 36, height: 36, borderRadius: 18, background: "#d0f0eb" }} />
          <span style={{ width: 36, height: 36, borderRadius: 18, background: "#d8f5ff" }} />
          <span style={{ width: 36, height: 36, borderRadius: 18, background: "#eaf7f3" }} />
        </div>
        <h1 style={{ fontSize: 48, lineHeight: 1.1, color: "#102a2a", marginBottom: 8 }}>
          StepSafe AI
        </h1>
        <div style={{ color: "#0b6b57", fontWeight: 600, marginBottom: 10 }}>
          Your Climate-Aware Safety Companion
        </div>
        <p style={{ color: "#3a4a4a", fontSize: 18, marginBottom: 26 }}>
          Personalized outdoor safety guidance based on real-time weather and air quality.
          Clear, actionable recommendations before you step outside.
        </p>
        <Link
          href="/input"
          style={{
            background: "#0b6b57",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: 10,
            fontWeight: 700,
          }}
        >
          Check Today’s Outdoor Safety
        </Link>
      </div>
    </section>
  );
}
