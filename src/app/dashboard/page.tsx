import Link from "next/link";
import { getTodayEvents, formatEventTime } from "@/lib/google-calendar";

export default async function DashboardPage() {
  const events = await getTodayEvents();

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-8 flex gap-3">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">← Home</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal" className="text-slate-600 hover:text-slate-900 font-medium">📔 Journal</Link>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-slate-200">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">📅 Heute</h1>
          <p className="text-slate-700 text-lg mb-2">Dein Kalender für heute</p>
          <p className="text-slate-500 text-sm mb-6 capitalize">{today}</p>

          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                >
                  <div className="text-xl">⏰</div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{event.summary}</div>
                    {event.description && (
                      <div className="text-sm text-slate-700 mt-1">{event.description}</div>
                    )}
                    <div className="text-sm text-slate-600 mt-2 font-medium">{formatEventTime(event)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-700 text-lg font-medium">Keine Termine heute</p>
              <p className="text-slate-500 text-sm mt-2">
                Perfekter Tag zum Fokussieren! ✨
              </p>
              <p className="text-slate-400 text-xs mt-4">
                (Google Calendar Integration noch nicht konfiguriert)
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="text-2xl mb-2">📌</div>
            <div className="text-sm text-slate-600 font-medium">Termine heute</div>
            <div className="text-3xl font-bold text-slate-900">{events.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-sm text-slate-600 font-medium">Freie Zeit</div>
            <div className="text-3xl font-bold text-slate-900">∞</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-sm text-slate-600 font-medium">Status</div>
            <div className="text-3xl font-bold text-green-600">Bereit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
