import { NextRequest } from "next/server";
import { AppSession, RiskCard } from "@/lib/types";

function deterministicSummary(payload: unknown) {
  const p = payload as AppSession;
  const city = p?.data?.location?.name ?? "your area";
  const cards: RiskCard[] = p?.result?.cards ?? [];
  const levels = Object.fromEntries(cards.map((c) => [c.key, c.level]));
  const uv = levels["uv"];
  const heat = levels["heat"];
  const aqi = levels["aqi"];
  const rain = levels["rain"];
  const msg =
    `Today in ${city}, ${heat} heat and ${uv} UV are the main concerns. ` +
    (aqi && aqi !== "low" ? `Air quality is ${aqi}; reduce intense activity. ` : ``) +
    (rain && rain !== "low" ? `Rain risk is ${rain}. ` : ``) +
    `Use sunscreen, hydrate, and plan around peak hours.`;
  return msg.slice(0, 300);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const text = deterministicSummary(body);
      return Response.json({ advisory: text });
    }
    const prompt =
      `Write a calm, professional safety advisory under 80 words.\n` +
      `Explain today's climate risks and why precautions are recommended.\n` +
      `Do not invent facts; only rephrase.\n` +
      `Input JSON:\n${JSON.stringify(body).slice(0, 4000)}`;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You convert computed climate risks into human-readable advice. Never invent new data." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 120,
      }),
    });
    const json = await res.json();
    const advisory =
      json?.choices?.[0]?.message?.content ??
      deterministicSummary(body);
    return Response.json({ advisory });
  } catch (e: unknown) {
    const msg = (e as Error).message ?? "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
