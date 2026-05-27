import { formatInTimeZone, toZonedTime } from "date-fns-tz";
// @ts-ignore - node-ical has no types
import ical from "node-ical";

const BERLIN_TZ = "Europe/Berlin";

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  calendarName?: string;
  calendarColor?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
}

function getIcsUrls(): { url: string; name: string }[] {
  const urls: { url: string; name: string }[] = [];

  // Primary calendar
  const primary = process.env.GOOGLE_CALENDAR_ICS_URL;
  if (primary) {
    urls.push({ url: primary, name: "Julian" });
  }

  // Additional calendars: GOOGLE_CALENDAR_ICS_URL_2, _3, etc.
  for (let i = 2; i <= 10; i++) {
    const url = process.env[`GOOGLE_CALENDAR_ICS_URL_${i}`];
    const name = process.env[`GOOGLE_CALENDAR_NAME_${i}`] || `Kalender ${i}`;
    if (url) urls.push({ url, name });
  }

  return urls;
}

async function fetchAndParseCalendar(url: string, name: string): Promise<CalendarEvent[]> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "LifeOS/1.0" },
      // 10 second timeout via AbortController
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`[ICS] ${name} returned ${response.status}`);
      return [];
    }

    const icsText = await response.text();
    const parsed = ical.parseICS(icsText);

    const events: CalendarEvent[] = [];
    for (const key of Object.keys(parsed)) {
      const item = parsed[key];
      if (item.type !== "VEVENT") continue;

      const start = item.start as Date;
      const end = item.end as Date;
      const isAllDay = (item as any).datetype === "date";

      events.push({
        id: item.uid || key,
        summary: item.summary || "(Ohne Titel)",
        description: item.description || undefined,
        location: item.location || undefined,
        calendarName: name,
        calendarColor: undefined,
        start: isAllDay
          ? { date: start.toISOString().split("T")[0] }
          : { dateTime: start.toISOString() },
        end: isAllDay
          ? { date: end.toISOString().split("T")[0] }
          : { dateTime: end.toISOString() },
        htmlLink: "",
      });
    }

    return events;
  } catch (error) {
    console.error(`[ICS] Failed to fetch ${name}:`, error);
    return [];
  }
}

function filterEventsByDateRange(
  events: CalendarEvent[],
  start: Date,
  end: Date
): CalendarEvent[] {
  return events.filter((e) => {
    const eventStart = new Date(e.start.dateTime || e.start.date || "");
    const eventEnd = new Date(e.end.dateTime || e.end.date || "");
    // Event overlaps the range
    return eventEnd >= start && eventStart <= end;
  });
}

async function fetchAllEvents(): Promise<CalendarEvent[]> {
  const urls = getIcsUrls();
  if (urls.length === 0) return [];

  const results = await Promise.all(
    urls.map(({ url, name }) => fetchAndParseCalendar(url, name))
  );

  return results.flat();
}

function getDayBoundsBerlin(date: Date) {
  const berlinDate = toZonedTime(date, BERLIN_TZ);
  const dateStr = formatInTimeZone(berlinDate, BERLIN_TZ, "yyyy-MM-dd");
  const startOfDay = new Date(`${dateStr}T00:00:00+01:00`);
  const endOfDay = new Date(`${dateStr}T23:59:59+01:00`);
  return { startOfDay, endOfDay };
}

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  try {
    const all = await fetchAllEvents();
    const { startOfDay, endOfDay } = getDayBoundsBerlin(new Date());
    const filtered = filterEventsByDateRange(all, startOfDay, endOfDay);

    filtered.sort((a, b) => {
      const aTime = a.start.dateTime || a.start.date || "";
      const bTime = b.start.dateTime || b.start.date || "";
      return aTime.localeCompare(bTime);
    });

    return filtered;
  } catch (error) {
    console.error("[Calendar] getTodayEvents failed:", error);
    return [];
  }
}

export async function getUpcomingEvents(daysAhead: number = 7): Promise<CalendarEvent[]> {
  try {
    const all = await fetchAllEvents();
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + daysAhead);

    const filtered = filterEventsByDateRange(all, now, end);

    filtered.sort((a, b) => {
      const aTime = a.start.dateTime || a.start.date || "";
      const bTime = b.start.dateTime || b.start.date || "";
      return aTime.localeCompare(bTime);
    });

    return filtered.slice(0, 50);
  } catch (error) {
    console.error("[Calendar] getUpcomingEvents failed:", error);
    return [];
  }
}

export function formatEventTime(event: CalendarEvent): string {
  if (event.start.date) return "Ganztägig";
  const startTime = event.start.dateTime;
  const endTime = event.end.dateTime;
  if (!startTime) return "—";

  const start = formatInTimeZone(new Date(startTime), BERLIN_TZ, "HH:mm");
  const end = endTime ? formatInTimeZone(new Date(endTime), BERLIN_TZ, "HH:mm") : "";
  return end ? `${start} – ${end}` : start;
}

export function formatEventDate(event: CalendarEvent): string {
  const dateStr = event.start.dateTime || event.start.date;
  if (!dateStr) return "";
  return formatInTimeZone(new Date(dateStr), BERLIN_TZ, "EEEE, d. MMMM");
}

export function isCalendarConfigured(): boolean {
  return !!process.env.GOOGLE_CALENDAR_ICS_URL;
}

export async function getEventsInRange(start: Date, end: Date): Promise<CalendarEvent[]> {
  try {
    const all = await fetchAllEvents();
    const filtered = filterEventsByDateRange(all, start, end);

    filtered.sort((a, b) => {
      const aTime = a.start.dateTime || a.start.date || "";
      const bTime = b.start.dateTime || b.start.date || "";
      return aTime.localeCompare(bTime);
    });

    return filtered;
  } catch (error) {
    console.error("[Calendar] getEventsInRange failed:", error);
    return [];
  }
}
