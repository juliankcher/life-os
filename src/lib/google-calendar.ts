import { google } from "googleapis";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

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

function getCalendarClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
  }

  let credentials;
  try {
    const decoded = Buffer.from(raw, "base64").toString();
    credentials = JSON.parse(decoded);
  } catch {
    credentials = JSON.parse(raw);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  return google.calendar({ version: "v3", auth });
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
    const calendar = getCalendarClient();
    const { startOfDay, endOfDay } = getDayBoundsBerlin(new Date());

    const calendarsRes = await calendar.calendarList.list();
    const calendars = calendarsRes.data.items || [];

    if (calendars.length === 0) {
      console.warn("[Calendar] No calendars accessible. Did you share your calendar with the service account?");
      return [];
    }

    const allEvents: CalendarEvent[] = [];
    for (const cal of calendars) {
      if (!cal.id) continue;
      try {
        const response = await calendar.events.list({
          calendarId: cal.id,
          timeMin: startOfDay.toISOString(),
          timeMax: endOfDay.toISOString(),
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = (response.data.items || []).map((e) => ({
          id: e.id || "",
          summary: e.summary || "(Ohne Titel)",
          description: e.description || undefined,
          location: e.location || undefined,
          calendarName: cal.summary || undefined,
          calendarColor: cal.backgroundColor || undefined,
          start: { dateTime: e.start?.dateTime || undefined, date: e.start?.date || undefined },
          end: { dateTime: e.end?.dateTime || undefined, date: e.end?.date || undefined },
          htmlLink: e.htmlLink || "",
        }));
        allEvents.push(...events);
      } catch (err) {
        console.error(`[Calendar] Error fetching ${cal.summary}:`, err);
      }
    }

    allEvents.sort((a, b) => {
      const aTime = a.start.dateTime || a.start.date || "";
      const bTime = b.start.dateTime || b.start.date || "";
      return aTime.localeCompare(bTime);
    });

    return allEvents;
  } catch (error) {
    console.error("[Calendar] Failed:", error);
    return [];
  }
}

export async function getUpcomingEvents(daysAhead: number = 7): Promise<CalendarEvent[]> {
  try {
    const calendar = getCalendarClient();
    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + daysAhead);

    const calendarsRes = await calendar.calendarList.list();
    const calendars = calendarsRes.data.items || [];

    const allEvents: CalendarEvent[] = [];
    for (const cal of calendars) {
      if (!cal.id) continue;
      try {
        const response = await calendar.events.list({
          calendarId: cal.id,
          timeMin: now.toISOString(),
          timeMax: end.toISOString(),
          singleEvents: true,
          orderBy: "startTime",
          maxResults: 50,
        });

        const events = (response.data.items || []).map((e) => ({
          id: e.id || "",
          summary: e.summary || "(Ohne Titel)",
          description: e.description || undefined,
          location: e.location || undefined,
          calendarName: cal.summary || undefined,
          calendarColor: cal.backgroundColor || undefined,
          start: { dateTime: e.start?.dateTime || undefined, date: e.start?.date || undefined },
          end: { dateTime: e.end?.dateTime || undefined, date: e.end?.date || undefined },
          htmlLink: e.htmlLink || "",
        }));
        allEvents.push(...events);
      } catch (err) {
        console.error(`[Calendar] Error fetching ${cal.summary}:`, err);
      }
    }

    allEvents.sort((a, b) => {
      const aTime = a.start.dateTime || a.start.date || "";
      const bTime = b.start.dateTime || b.start.date || "";
      return aTime.localeCompare(bTime);
    });

    return allEvents;
  } catch (error) {
    console.error("[Calendar] Upcoming failed:", error);
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
  return !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
}
