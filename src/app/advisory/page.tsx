"use client";
import { useState } from "react";
import { loadSession } from "@/lib/store";
import Link from "next/link";
import { AppSession } from "@/lib/types";

export default function AdvisoryPage() {
  const [session] = useState<AppSession | null>(() => loadSession<AppSession>());

  return (
    <section style={{ padding: "10px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ color: "#153535", fontSize: 28, fontWeight: 800 }}>Safety Advisory</div>
        <div style={{ color: "#5a7272" }}>A calm, human-readable summary for today</div>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#f7fbfa", border: "1px solid #e6f0ec", borderRadius: 16, padding: 20 }}>
        <p style={{ color: "#2b3f3f", fontSize: 18 }}>{session?.advisory ?? ""}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <Link href="/" style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #cfe0db", color: "#0b6b57" }}>
          Back to Home
        </Link>
      </div>
    </section>
  );
}
