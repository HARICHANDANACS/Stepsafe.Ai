"use client";
import { useState } from "react";
import { loadSession } from "@/lib/store";
import RiskCardView from "@/components/RiskCard";
import Link from "next/link";
import { AppSession, RiskCard } from "@/lib/types";

export default function RisksPage() {
  const [session] = useState<AppSession | null>(() => loadSession<AppSession>());

  const cards: RiskCard[] = session?.result?.cards ?? [];
  const place = session?.data?.location?.name
    ? `${session.data.location.name}${session.data.location.country ? ", " + session.data.location.country : ""}`
    : "Selected Location";
  const dateISO = session?.data?.dateISO;
  const date = dateISO ? new Date(dateISO).toLocaleDateString() : "";

  return (
    <section style={{ padding: "10px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ color: "#153535", fontSize: 28, fontWeight: 800 }}>Climate Risks at a Glance</div>
        <div style={{ color: "#5a7272" }}>{place} • {date}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {cards.map((c, idx) => <RiskCardView key={idx} card={c} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <Link href="/checklist" style={{ background: "#0b6b57", color: "#fff", padding: "12px 16px", borderRadius: 10, fontWeight: 700 }}>
          View Safety Checklist
        </Link>
      </div>
    </section>
  );
}
