import Link from "next/link";
import {
  getTodayEvents,
  getUpcomingEvents,
  formatEventTime,
  isCalendarConfigured,
  type CalendarEvent,
} from "@/lib/google-calendar";

export const revalidate = 300;

export default async function DashboardPage() {
  const configured = isCalendarConfigured();
  const todayEvents = configured ? await getTodayEvents() : [];
  const upcomingEvents = configured ? await getUpcomingEvents(7) : [];

  const today = new Date().toISOString().split("T")[0];
  const futureEvents = upcomingEvents.filter((e) => {
    const eventDate = (e.start.dateTime || e.start.date || "").split("T")[0];
    return eventDate > today;
  });

  const eventsByDate: Record<string, CalendarEvent[]> = {};
  futureEvents.forEach((e) => {
    const eventDate = (e.start.dateTime || e.start.date || "").split("T")[0];
    if (!eventsByDate[eventDate]) eventsByDate[eventDate] = [];
    eventsByDate[eventDate].push(e);
  });

  const todayStr = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="mb-6 flex gap-3 flex-wrap">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">← Home</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal" className="text-slate-600 hover:text-slate-900 font-medium">📔 Journal</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal/uebersicht" className="text-slate-600 hover:text-slate-900 font-medium">📅 Übersicht</Link>
        </nav>

        {!configured && (
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h3 className="font-bold text-amber-900 mb-1">Google Calendar nicht konfiguriert</h3>
                <p className="text-sm text-amber-800">
                  Folge der Anleitung um deinen Kalender zu verbinden (Service Account einrichten).
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-slate-200">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">📅 Heute</h1>
          <p className="text-slate-700 text-lg mb-2">Dein Kalender für heute</p>
          <p className="text-slate-500 text-sm mb-6 capitalize">{todayStr}</p>

          {todayEvents.length > 0 ? (
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-700 text-lg font-medium">Keine Termine heute</p>
              <p className="text-slate-500 text-sm mt-2">Perfekter Tag zum Fokussieren ✨</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon="📌" label="Heute" value={todayEvents.length.toString()} />
          <StatCard icon="📆" label="Nächste 7 Tage" value={futureEvents.length.toString()} />
          <StatCard icon="⏱️" label="Free Time" value="∞" />
          <StatCard icon="✨" label="Status" value="Bereit" valueColor="text-green-600" />
        </div>

        {Object.keys(eventsByDate).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">🗓️ Nächste 7 Tage</h2>
            <div className="space-y-6">
              {Object.entries(eventsByDate).map(([date, events]) => {
                const dateObj = new Date(date);
                const dayLabel = dateObj.toLocaleDateString("de-DE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                });
                return (
                  <div key={date}>
                    <h3 className="font-bold text-slate-800 mb-2 pb-1 border-b border-slate-200 capitalize">
                      {dayLabel}
                    </h3>
                    <div className="space-y-2 mt-3">
                      {events.map((event) => (
                        <EventCard key={event.id} event={event} compact />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const color = event.calendarColor || "#3b82f6";

  return (
    <a
      href={event.htmlLink || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition group"
    >
      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <div className="font-bold text-slate-900 group-hover:text-blue-700">{event.summary}</div>
          <div className="text-sm text-slate-600 font-medium whitespace-nowrap">{formatEventTime(event)}</div>
        </div>
        {event.location && <div className="text-xs text-slate-600 mt-1">📍 {event.location}</div>}
        {!compact && event.description && (
          <div className="text-sm text-slate-600 mt-1 line-clamp-2">{event.description}</div>
        )}
        {event.calendarName && <div className="text-xs text-slate-500 mt-1">{event.calendarName}</div>}
      </div>
    </a>
  );
}

function StatCard({ icon, label, value, valueColor = "text-slate-900" }: {
  icon: string; label: string; value: string; valueColor?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-slate-600 font-medium">{label}</div>
      <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}
