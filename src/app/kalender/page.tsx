import Link from "next/link";
import { getEventsInRange, isCalendarConfigured, type CalendarEvent } from "@/lib/google-calendar";
import { CalendarView } from "./calendar-view";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const configured = isCalendarConfigured();

  const now = new Date();
  const year = parseInt(params.year || String(now.getFullYear()));
  const month = parseInt(params.month || String(now.getMonth()));

  // Calculate range: include surrounding month to handle calendar grid (6 weeks)
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const rangeStart = new Date(firstOfMonth);
  rangeStart.setDate(rangeStart.getDate() - 7);
  const rangeEnd = new Date(lastOfMonth);
  rangeEnd.setDate(rangeEnd.getDate() + 7);

  const events = configured ? await getEventsInRange(rangeStart, rangeEnd) : [];

  // Serialize events for client component
  const serializedEvents = events.map((e) => ({
    id: e.id,
    summary: e.summary,
    description: e.description,
    location: e.location,
    calendarName: e.calendarName,
    startDateTime: e.start.dateTime || null,
    startDate: e.start.date || null,
    endDateTime: e.end.dateTime || null,
    endDate: e.end.date || null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-6 flex gap-3 flex-wrap">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">← Home</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal" className="text-slate-600 hover:text-slate-900 font-medium">📔 Journal</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal/uebersicht" className="text-slate-600 hover:text-slate-900 font-medium">📅 Journal-Übersicht</Link>
          <span className="text-slate-400">|</span>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">📊 Dashboard</Link>
        </nav>

        {!configured && (
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-bold text-amber-900 mb-1">⚙️ Kalender nicht konfiguriert</h3>
            <p className="text-sm text-amber-800">
              Füge <code>GOOGLE_CALENDAR_ICS_URL</code> in <code>.env.local</code> hinzu.
            </p>
          </div>
        )}

        <CalendarView
          year={year}
          month={month}
          events={serializedEvents}
        />
      </div>
    </div>
  );
}
