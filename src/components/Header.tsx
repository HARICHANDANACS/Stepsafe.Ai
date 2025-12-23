"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { path: "/", label: "Home" },
  { path: "/input", label: "Input" },
  { path: "/risks", label: "Risks" },
  { path: "/checklist", label: "Checklist" },
  { path: "/windows", label: "Windows" },
  { path: "/advisory", label: "Advisory" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header style={{ borderBottom: "1px solid #e6f0ec", background: "#f7fbfa" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontWeight: 700, color: "#0b6b57" }}>
          StepSafe AI
        </Link>
        <nav style={{ display: "flex", gap: 12 }}>
          {steps.map((s) => (
            <Link
              key={s.path}
              href={s.path}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 13,
                color: pathname === s.path ? "#fff" : "#0b6b57",
                background: pathname === s.path ? "#0b6b57" : "#e7f3f0",
              }}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

