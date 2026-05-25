import Link from "next/link";
import { getTodayEvents, formatEventTime } from "@/lib/google-calendar";

export default async function DashboardPage() {
  const events = await getTodayEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation */}
        <nav className="mb-12 flex gap-4">
          <Link
            href="/journal"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
          >
            📔 Journal
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold"
          >
            📊 Dashboard
          </Link>
        </nav>

        {/* Today's Events Card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">📅 Today's Calendar</h1>
          <p className="text-slate-600 mb-6">
            Your schedule for today from Google Calendar
          </p>

          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
                >
                  <div className="text-xl">⏰</div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">
                      {event.summary}
                    </div>
                    {event.description && (
                      <div className="text-sm text-slate-600 mt-1">
                        {event.description}
                      </div>
                    )}
                    <div className="text-sm text-slate-500 mt-2">
                      {formatEventTime(event)}
                    </div>
                  </div>
                  {event.htmlLink && (
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      View →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No events scheduled for today</p>
              <p className="text-slate-500 text-sm mt-2">
                Your calendar is clear. Great opportunity to focus!
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl mb-2">📌</div>
            <div className="text-sm text-slate-600">Events Today</div>
            <div className="text-3xl font-bold text-slate-900">{events.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-sm text-slate-600">Free Time</div>
            <div className="text-3xl font-bold text-slate-900">∞</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-2xl mb-2">✨</div>
            <div className="text-sm text-slate-600">Status</div>
            <div className="text-3xl font-bold text-green-600">Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
