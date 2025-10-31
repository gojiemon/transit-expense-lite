export type Masters = {
  staff: string[];
  origins: string[];
};

export type EntryPayload = {
  timestamp: string;
  month: string; // YYYY-MM
  name: string;
  origin: string;
  destination: string;
  route: string;
  transport: string; // 電車 / バス など
  oneWayFare: number;
  roundtripFare: number;
  daysCsv: string; // comma separated
  daysCount: number;
  total: number;
  note?: string;
};
