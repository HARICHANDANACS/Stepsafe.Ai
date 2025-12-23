"use client";
import { RiskCard } from "@/lib/types";

export default function RiskCardView({ card }: { card: RiskCard }) {
  const bg =
    card.color === "green" ? "#eaf7f3" : card.color === "yellow" ? "#fff7df" : "#ffe8e6";
  const border =
    card.color === "green" ? "#c6e6dc" : card.color === "yellow" ? "#ffe1a6" : "#ffc2bb";
  const pillBg =
    card.color === "green" ? "#cfece2" : card.color === "yellow" ? "#ffedbf" : "#ffcbc6";
  const pillColor = card.color === "red" ? "#8b2b20" : "#6b5b00";
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 18, color: "#183c3c" }}>{card.title}</h3>
        <span style={{ background: pillBg, color: pillColor, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
          {card.level}
        </span>
      </div>
      <p style={{ marginTop: 8, color: "#3a4a4a" }}>{card.explanation}</p>
    </div>
  );
}

