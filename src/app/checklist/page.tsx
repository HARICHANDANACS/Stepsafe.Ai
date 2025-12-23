"use client";
import { useState } from "react";
import { loadSession } from "@/lib/store";
import ChecklistItemView from "@/components/ChecklistItem";
import Link from "next/link";
import { AppSession, ChecklistItem } from "@/lib/types";

export default function ChecklistPage() {
  const [session] = useState<AppSession | null>(() => loadSession<AppSession>());
  const items: ChecklistItem[] = session?.result?.checklist ?? [];

  return (
    <section style={{ padding: "10px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ color: "#153535", fontSize: 28, fontWeight: 800 }}>Before You Step Out</div>
        <div style={{ color: "#5a7272" }}>Your personalized safety checklist for today</div>
      </div>
      <div style={{ display: "grid", gap: 12, maxWidth: 720, margin: "0 auto" }}>
        {items.map((it, idx) => <ChecklistItemView key={idx} item={it} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18 }}>
        <Link href="/windows" style={{ background: "#0b6b57", color: "#fff", padding: "12px 16px", borderRadius: 10, fontWeight: 700 }}>
          View Safe Time Windows
        </Link>
        <Link href="/advisory" style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #cfe0db", color: "#0b6b57" }}>
          Skip to Advisory
        </Link>
      </div>
    </section>
  );
}
