import { google } from "googleapis";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

const BERLIN_TZ = "Europe/Berlin";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
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

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  try {
    const credentials = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "", "base64").toString()
    );

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const today = new Date();
    const berlinToday = toZonedTime(today, BERLIN_TZ);
    
    const startOfDay = new Date(berlinToday);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(berlinToday);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return (response.data.items || []) as CalendarEvent[];
  } catch (error) {
    console.error("Failed to fetch calendar events:", error);
    return [];
  }
}

export function formatEventTime(event: CalendarEvent): string {
  const startTime = event.start.dateTime || event.start.date;
  if (!startTime) return "No time";

  if (event.start.date) {
    return "All day";
  }

  const date = new Date(startTime);
  return formatInTimeZone(date, BERLIN_TZ, "HH:mm");
}
