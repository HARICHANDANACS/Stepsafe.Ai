"use client";
import { TimeWindow } from "@/lib/types";

export default function TimeWindowCard({ w }: { w: TimeWindow }) {
  const color =
    w.status === "safe" ? "#eaf7f3" : w.status === "caution" ? "#fff7df" : "#ffe8e6";
  const border =
    w.status === "safe" ? "#c6e6dc" : w.status === "caution" ? "#ffe1a6" : "#ffc2bb";
  const labelColor = w.status === "unsafe" ? "#8b2b20" : "#6b5b00";
  const labelBg =
    w.status === "safe" ? "#cfece2" : w.status === "caution" ? "#ffedbf" : "#ffcbc6";
  const timeFmt = (s: string) => new Date(s).toLocaleTimeString([], { hour: "numeric" });
  return (
    <div style={{ background: color, border: `1px solid ${border}`, borderRadius: 14, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600, color: "#183c3c" }}>
          {timeFmt(w.start)} – {timeFmt(w.end)}
        </div>
        <span style={{ background: labelBg, color: labelColor, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
          {w.status}
        </span>
      </div>
      <div style={{ marginTop: 6, color: "#475b5b", fontSize: 14 }}>{w.reason}</div>
    </div>
  );
}

