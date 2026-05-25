import { toZonedTime, formatInTimeZone } from "date-fns-tz";

const BERLIN_TZ = "Europe/Berlin";

export function todayInBerlin(): string {
  const berlinDate = toZonedTime(new Date(), BERLIN_TZ);
  return formatInTimeZone(berlinDate, BERLIN_TZ, "yyyy-MM-dd");
}

export function toISOInBerlin(date: Date): string {
  return formatInTimeZone(date, BERLIN_TZ, "yyyy-MM-dd'T'HH:mm:ssxxx");
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

export function formatDateBerlin(date: Date, format: string = "dd.MM.yyyy"): string {
  return formatInTimeZone(date, BERLIN_TZ, format);
}
