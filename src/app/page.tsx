import Link from "next/link";
import { getJournalStats } from "@/app/journal/actions";

export default async function Home() {
  const stats = await getJournalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-12">
          <div>
            <h1 className="text-6xl font-bold text-slate-900 mb-4">🚀 Life OS</h1>
            <p className="text-xl text-slate-700">
              Dein persönliches Betriebssystem
            </p>
          </div>
        </div>

        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 text-center">
              <div className="text-3xl mb-1">📊</div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-xs text-slate-600">Einträge</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 text-center">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-orange-500">{stats.streak}</div>
              <div className="text-xs text-slate-600">{stats.streak === 1 ? "Tag Streak" : "Tage Streak"}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 text-center">
              <div className="text-3xl mb-1">⭐</div>
              <div className="text-sm font-bold text-slate-900">
                {stats.lastEntry 
                  ? new Date(stats.lastEntry).toLocaleDateString("de-DE", { day: "numeric", month: "short" })
                  : "—"}
              </div>
              <div className="text-xs text-slate-600">Letzter Eintrag</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Link
            href="/journal"
            className="bg-blue-500 text-white p-6 rounded-xl shadow-md hover:bg-blue-600 transition group"
          >
            <div className="text-3xl mb-2">📔</div>
            <div className="text-xl font-bold mb-1">Journal</div>
            <div className="text-sm opacity-90">Heutiger Eintrag</div>
          </Link>

          <Link
            href="/kalender"
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition group"
          >
            <div className="text-3xl mb-2">🗓️</div>
            <div className="text-xl font-bold mb-1">Kalender</div>
            <div className="text-sm opacity-90">Termine planen</div>
          </Link>

          <Link
            href="/journal/uebersicht"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-slate-200 group"
          >
            <div className="text-3xl mb-2">📅</div>
            <div className="text-xl font-bold mb-1 text-slate-900">Journal-Übersicht</div>
            <div className="text-sm text-slate-600">Alle Einträge & Streaks</div>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-slate-200 group"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="text-xl font-bold mb-1 text-slate-900">Dashboard</div>
            <div className="text-sm text-slate-600">Heute & Stats</div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">Phase 1: Journaling Komplett</p>
        </div>
      </div>
    </div>
  );
}
