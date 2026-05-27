import Link from "next/link";
import { loadAllJournalEntries, getJournalStats } from "../actions";
import { JournalCalendar } from "./journal-calendar";

export default async function UebersichtPage() {
  const entries = await loadAllJournalEntries();
  const stats = await getJournalStats();

  const entriesByDate: Record<string, { id: string; preview: string }> = {};
  entries.forEach(entry => {
    const preview = [entry.wins, entry.feelings, entry.gratitude]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 80);
    entriesByDate[entry.date] = { id: entry.id, preview };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <nav className="mb-8 flex gap-3 flex-wrap">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">← Home</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal" className="text-slate-600 hover:text-slate-900 font-medium">📔 Heute</Link>
          <span className="text-slate-400">|</span>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">📊 Dashboard</Link>
        </nav>

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">📅 Journal-Übersicht</h1>
          <p className="text-slate-700 text-lg">Alle deine Reflexionen auf einen Blick</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs text-slate-600 font-medium">Gesamt-Einträge</div>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs text-slate-600 font-medium">Aktuelle Streak</div>
            <div className="text-3xl font-bold text-orange-500">{stats.streak} {stats.streak === 1 ? "Tag" : "Tage"}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-xs text-slate-600 font-medium">Erster Eintrag</div>
            <div className="text-lg font-bold text-slate-900">
              {stats.firstEntry 
                ? new Date(stats.firstEntry).toLocaleDateString("de-DE", { day: "numeric", month: "short" })
                : "—"}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xs text-slate-600 font-medium">Letzter Eintrag</div>
            <div className="text-lg font-bold text-slate-900">
              {stats.lastEntry 
                ? new Date(stats.lastEntry).toLocaleDateString("de-DE", { day: "numeric", month: "short" })
                : "—"}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 mb-8">
          <JournalCalendar entriesByDate={entriesByDate} />
        </div>

        {/* Recent Entries List */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📝 Letzte Einträge</h2>
          
          {entries.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-700 text-lg font-medium">Noch keine Einträge</p>
              <Link href="/journal" className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600">
                Ersten Eintrag schreiben
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.slice(0, 10).map(entry => {
                const date = new Date(entry.date);
                const preview = [entry.wins, entry.feelings, entry.gratitude]
                  .filter(Boolean)
                  .join(" · ")
                  .slice(0, 150);
                
                return (
                  <Link
                    key={entry.id}
                    href={`/journal/${entry.date}`}
                    className="block p-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition group"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600">
                        {date.toLocaleDateString("de-DE", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <span className="text-xs text-slate-500">→</span>
                    </div>
                    {preview && (
                      <p className="text-sm text-slate-600 line-clamp-2">{preview}</p>
                    )}
                  </Link>
                );
              })}
              
              {entries.length > 10 && (
                <p className="text-center text-sm text-slate-500 pt-4">
                  +{entries.length - 10} weitere Einträge
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
