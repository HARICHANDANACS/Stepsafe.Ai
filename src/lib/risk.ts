import { ActivityLevel, AgeGroup, ClimateData, RiskCard, RiskLevel, ChecklistItem, TimeWindow } from "./types";

const cToF = (c: number) => (c * 9) / 5 + 32;

function heatIndexF(tempF: number, humidity: number) {
  // Rothfusz regression approximation, bounded
  const T = tempF;
  const R = humidity;
  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;
  return Math.max(T, HI);
}

function levelFrom(value: number, bounds: [number, number, number]): RiskLevel {
  if (value < bounds[0]) return "low";
  if (value < bounds[1]) return "medium";
  if (value < bounds[2]) return "high";
  return "extreme";
}

export function pm25ToUsAqi(pm25: number): number {
  const ranges = [
    { bpL: 0, bpH: 12, aqiL: 0, aqiH: 50 },
    { bpL: 12.1, bpH: 35.4, aqiL: 51, aqiH: 100 },
    { bpL: 35.5, bpH: 55.4, aqiL: 101, aqiH: 150 },
    { bpL: 55.5, bpH: 150.4, aqiL: 151, aqiH: 200 },
    { bpL: 150.5, bpH: 250.4, aqiL: 201, aqiH: 300 },
    { bpL: 250.5, bpH: 350.4, aqiL: 301, aqiH: 400 },
    { bpL: 350.5, bpH: 500.4, aqiL: 401, aqiH: 500 },
  ];
  for (const r of ranges) {
    if (pm25 >= r.bpL && pm25 <= r.bpH) {
      const aqi =
        ((r.aqiH - r.aqiL) / (r.bpH - r.bpL)) * (pm25 - r.bpL) + r.aqiL;
      return Math.round(aqi);
    }
  }
  return Math.round(pm25); // fallback
}

export function computeRiskCards(data: ClimateData): RiskCard[] {
  const tempF = cToF(data.current.temperatureC);
  const hi = heatIndexF(tempF, data.current.humidity);
  const heatLevel = levelFrom(hi, [80, 95, 105]);

  const uvLevel = levelFrom(data.current.uvIndex, [3, 6, 8]);
  const aqiValue = data.current.aqi ?? 50;
  const aqiLevel = levelFrom(aqiValue, [50, 100, 150]);
  const humidityLevel = levelFrom(data.current.humidity, [60, 70, 80]);
  const rainLevel = levelFrom(data.current.precipProb, [20, 50, 80]);

  const cards: RiskCard[] = [
    {
      key: "heat",
      title: "Heat Risk",
      level: heatLevel,
      color: heatLevel === "low" ? "green" : heatLevel === "medium" ? "yellow" : "red",
      explanation:
        heatLevel === "low"
          ? `Feels comfortable. Heat index ~${Math.round(hi)}°F.`
          : heatLevel === "medium"
          ? `Heat index ~${Math.round(hi)}°F. Stay hydrated and limit exposure.`
          : heatLevel === "high"
          ? `High heat stress (~${Math.round(hi)}°F). Schedule breaks and shade.`
          : `Extreme heat (> ${Math.round(hi)}°F). Avoid strenuous outdoor activity.`,
    },
    {
      key: "uv",
      title: "UV Risk",
      level: uvLevel,
      color: uvLevel === "low" ? "green" : uvLevel === "medium" ? "yellow" : "red",
      explanation:
        uvLevel === "low"
          ? `UV index ${data.current.uvIndex}. Minimal protection needed.`
          : uvLevel === "medium"
          ? `UV index ${data.current.uvIndex}. Use sunscreen and protective clothing.`
          : uvLevel === "high"
          ? `UV index ${data.current.uvIndex}. Strong protection recommended.`
          : `UV index ${data.current.uvIndex}. Stay out of direct sun.`,
    },
    {
      key: "aqi",
      title: "Air Quality (AQI)",
      level: aqiLevel,
      color: aqiLevel === "low" ? "green" : aqiLevel === "medium" ? "yellow" : "red",
      explanation:
        aqiLevel === "low"
          ? `AQI ${aqiValue}. Good for outdoor activity.`
          : aqiLevel === "medium"
          ? `AQI ${aqiValue}. Sensitive groups should limit intense exercise.`
          : aqiLevel === "high"
          ? `AQI ${aqiValue}. Everyone may feel effects; reduce exposure.`
          : `AQI ${aqiValue}. Hazardous. Stay indoors if possible.`,
    },
    {
      key: "humidity",
      title: "Humidity Comfort",
      level: humidityLevel,
      color: humidityLevel === "low" ? "green" : humidityLevel === "medium" ? "yellow" : "red",
      explanation:
        humidityLevel === "low"
          ? `Humidity ${data.current.humidity}%. Comfortable.`
          : humidityLevel === "medium"
          ? `Humidity ${data.current.humidity}%. May feel sticky during exercise.`
          : humidityLevel === "high"
          ? `Humidity ${data.current.humidity}%. Heat stress increases; pace yourself.`
          : `Humidity ${data.current.humidity}%. Dangerous with heat; avoid exertion.`,
    },
    {
      key: "rain",
      title: "Rain Exposure",
      level: rainLevel,
      color: rainLevel === "low" ? "green" : rainLevel === "medium" ? "yellow" : "red",
      explanation:
        rainLevel === "low"
          ? `Precipitation chance ${data.current.precipProb}%. Low risk.`
          : rainLevel === "medium"
          ? `Precipitation ${data.current.precipProb}%. Pack light jacket or umbrella.`
          : rainLevel === "high"
          ? `Precipitation ${data.current.precipProb}%. Expect showers; waterproof gear.`
          : `Persistent heavy rain likely. Delay outdoor plans.`,
    },
  ];
  return cards;
}

export function buildChecklist(data: ClimateData, age: AgeGroup, activity: ActivityLevel): ChecklistItem[] {
  const tempF = cToF(data.current.temperatureC);
  const hi = heatIndexF(tempF, data.current.humidity);
  const aqi = data.current.aqi ?? 50;

  const baseWaterMl = activity === "high" ? 1000 : activity === "medium" ? 750 : 500;
  const heatBonus = hi > 95 ? 500 : hi > 85 ? 250 : 0;
  const ageBonus = age === "child" ? 100 : age === "elderly" ? 150 : 0;
  const waterMl = baseWaterMl + heatBonus + ageBonus;

  const items: ChecklistItem[] = [
    {
      title: "Recommended Water Intake",
      detail: `Drink at least ${Math.round(waterMl / 250)} cups (${waterMl} ml) today.`,
      required: true,
    },
    {
      title: "Clothing Suggestion",
      detail:
        hi >= 95
          ? "Light, breathable long sleeves; hat; seek shade."
          : hi >= 85
          ? "Light clothing; consider long sleeves for sun protection."
          : "Comfortable layers; adjust to conditions.",
      required: true,
    },
    {
      title: "Sunscreen Requirement",
      detail:
        data.current.uvIndex >= 3
          ? "Apply SPF 30+; reapply every 2 hours outdoors."
          : "Sunscreen optional; UV is low.",
      required: data.current.uvIndex >= 3,
    },
    {
      title: "Rain Preparation",
      detail:
        data.current.precipProb >= 50
          ? "Carry waterproof jacket or umbrella."
          : "Light rain possible; small umbrella optional.",
      required: data.current.precipProb >= 50,
    },
    {
      title: "Mask Recommendation",
      detail:
        aqi >= 100
          ? "Wear a well-fitted mask (AQI elevated)."
          : "No mask needed; air quality is OK.",
      required: aqi >= 100,
    },
  ];
  return items;
}

export function computeWindows(data: ClimateData): TimeWindow[] {
  // Aggregate into 3-hour blocks
  const blocks: { startIdx: number; endIdx: number }[] = [];
  for (let i = 0; i < data.hourly.length; i += 3) {
    blocks.push({ startIdx: i, endIdx: Math.min(i + 3, data.hourly.length) });
  }
  const windows: TimeWindow[] = blocks.map((b) => {
    const slice = data.hourly.slice(b.startIdx, b.endIdx);
    const avgTemp = slice.reduce((s, p) => s + p.temperatureC, 0) / slice.length;
    const avgUv = slice.reduce((s, p) => s + p.uvIndex, 0) / slice.length;
    const maxRain = Math.max(...slice.map((p) => p.precipProb));
    const hi = heatIndexF(cToF(avgTemp), data.current.humidity);
    const heatLevel = levelFrom(hi, [80, 95, 105]);
    const uvLevel = levelFrom(avgUv, [3, 6, 8]);
    const rainLevel = levelFrom(maxRain, [20, 50, 80]);
    const worst = [heatLevel, uvLevel, rainLevel].reduce<RiskLevel>((acc, lv) => {
      const order = { low: 0, medium: 1, high: 2, extreme: 3 } as const;
      return order[lv] > order[acc] ? lv : acc;
    }, "low");
    const status = worst === "low" ? "safe" : worst === "medium" ? "caution" : "unsafe";
    const reason =
      worst === "low"
        ? "Cool temps, low UV."
        : worst === "medium"
        ? "Rising UV/heat; take precautions."
        : "Peak heat or high UV/rain.";
    const start = slice[0]?.time ?? data.dateISO;
    const end = slice[slice.length - 1]?.time ?? data.dateISO;
    return { start, end, status, reason };
  });
  return windows;
}

export function buildRiskResult(data: ClimateData, age: AgeGroup, activity: ActivityLevel) {
  const cards = computeRiskCards(data);
  const checklist = buildChecklist(data, age, activity);
  const windows = computeWindows(data);
  return { cards, checklist, windows };
}

