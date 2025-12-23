import { NextRequest } from "next/server";
import { pm25ToUsAqi, buildRiskResult } from "@/lib/risk";
import { ActivityLevel, AgeGroup, ClimateData, ClimateHourlyPoint } from "@/lib/types";

async function geocodeCity(name: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=1`;
  const res = await fetch(url);
  const json = await res.json();
  const first = json.results?.[0];
  if (!first) throw new Error("City not found");
  return {
    latitude: first.latitude,
    longitude: first.longitude,
    name: first.name,
    country: first.country,
    timezone: first.timezone,
  };
}

async function fetchWeatherAQ(lat: number, lon: number) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,uv_index&current=temperature_2m,relative_humidity_2m,uv_index,precipitation_probability&timezone=auto`;
  const weatherRes = await fetch(weatherUrl);
  const w = await weatherRes.json();

  const pm25Url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=10000&limit=1&parameter=pm25`;
  const aqRes = await fetch(pm25Url);
  const aq = await aqRes.json();
  const pm = aq.results?.[0]?.measurements?.[0]?.value ?? null;
  const aqi = pm != null ? pm25ToUsAqi(pm) : null;

  const hourly: ClimateHourlyPoint[] = (w.hourly?.time ?? []).map((t: string, idx: number) => ({
    time: t,
    temperatureC: w.hourly.temperature_2m[idx],
    uvIndex: w.hourly.uv_index?.[idx] ?? 0,
    precipProb: w.hourly.precipitation_probability?.[idx] ?? 0,
  }));

  const data: ClimateData = {
    location: {
      latitude: lat,
      longitude: lon,
      timezone: w.timezone,
    },
    current: {
      temperatureC: w.current?.temperature_2m ?? hourly[0]?.temperatureC ?? 20,
      humidity: w.current?.relative_humidity_2m ?? 60,
      uvIndex: w.current?.uv_index ?? 0,
      precipProb: w.current?.precipitation_probability ?? 0,
      aqi,
    },
    hourly,
    dateISO: new Date().toISOString(),
  };
  return data;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const city = searchParams.get("city");
    const age = (searchParams.get("age") ?? "adult") as AgeGroup;
    const activity = (searchParams.get("activity") ?? "medium") as ActivityLevel;

    let loc;
    if (city) {
      loc = await geocodeCity(city);
    } else if (lat && lon) {
      loc = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      return Response.json({ error: "Provide city or lat/lon" }, { status: 400 });
    }
    const data = await fetchWeatherAQ(loc.latitude, loc.longitude);
    data.location = { ...data.location, ...loc };
    const result = buildRiskResult(data, age, activity);
    return Response.json({ data, result });
  } catch (e: unknown) {
    const msg = (e as Error).message ?? "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
