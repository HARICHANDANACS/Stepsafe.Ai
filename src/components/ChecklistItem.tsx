"use client";
import { ChecklistItem } from "@/lib/types";

export default function ChecklistItemView({ item }: { item: ChecklistItem }) {
  return (
    <div style={{ background: "#f4fbf9", border: "1px solid #d8eee8", borderRadius: 14, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: item.required ? "#0b6b57" : "#cdebe3" }} />
        <div>
          <div style={{ fontWeight: 600, color: "#183c3c" }}>{item.title}</div>
          <div style={{ fontSize: 14, color: "#475b5b" }}>{item.detail}</div>
        </div>
      </div>
    </div>
  );
}

