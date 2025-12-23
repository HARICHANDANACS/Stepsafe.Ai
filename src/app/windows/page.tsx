"use client";
import { useState } from "react";
import { loadSession } from "@/lib/store";
import TimeWindowCard from "@/components/TimeWindowCard";
import Link from "next/link";
import { AppSession, TimeWindow } from "@/lib/types";

export default function WindowsPage() {
  const [session] = useState<AppSession | null>(() => loadSession<AppSession>());
  const windows: TimeWindow[] = session?.result?.windows ?? [];
  return (
    <section style={{ padding: "10px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ color: "#153535", fontSize: 28, fontWeight: 800 }}>Safe Outdoor Time Windows</div>
        <div style={{ color: "#5a7272" }}>Plan your activities around these recommendations</div>
      </div>
      <div style={{ display: "grid", gap: 12, maxWidth: 720, margin: "0 auto" }}>
        {windows.map((w, idx) => <TimeWindowCard key={idx} w={w} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
        <Link href="/advisory" style={{ background: "#0b6b57", color: "#fff", padding: "12px 16px", borderRadius: 10, fontWeight: 700 }}>
          View AI Safety Advisory
        </Link>
      </div>
    </section>
  );
}
