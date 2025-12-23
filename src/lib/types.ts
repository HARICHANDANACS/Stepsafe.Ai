export type AgeGroup = "child" | "adult" | "elderly";
export type ActivityLevel = "low" | "medium" | "high";

export type RiskLevel = "low" | "medium" | "high" | "extreme";

export interface Location {
  name?: string;
  latitude: number;
  longitude: number;
  country?: string;
  timezone?: string;
}

export interface ClimateCurrent {
  temperatureC: number;
  humidity: number;
  uvIndex: number;
  precipProb: number;
  aqi: number | null;
}

export interface ClimateHourlyPoint {
  time: string;
  temperatureC: number;
  uvIndex: number;
  precipProb: number;
}

export interface ClimateData {
  location: Location;
  current: ClimateCurrent;
  hourly: ClimateHourlyPoint[];
  dateISO: string;
}

export interface RiskCard {
  key: "heat" | "uv" | "aqi" | "humidity" | "rain";
  title: string;
  level: RiskLevel;
  color: "green" | "yellow" | "red";
  explanation: string;
}

export interface ChecklistItem {
  title: string;
  detail: string;
  required: boolean;
}

export interface TimeWindow {
  start: string;
  end: string;
  status: "safe" | "caution" | "unsafe";
  reason: string;
}

export interface RiskResult {
  cards: RiskCard[];
  checklist: ChecklistItem[];
  windows: TimeWindow[];
}

export interface AppSessionProfile {
  city?: string;
  latitude?: number;
  longitude?: number;
  ageGroup?: AgeGroup;
  activityLevel?: ActivityLevel;
}

export interface AppSession {
  data: ClimateData;
  result: RiskResult;
  advisory?: string;
  profile?: AppSessionProfile;
}
