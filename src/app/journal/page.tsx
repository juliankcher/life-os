import Link from "next/link";
import { loadTodayJournal, getJournalStats } from "./actions";
import { JournalForm } from "./journal-form";

export default async function JournalPage() {
  const journalEntry = await loadTodayJournal();
  const stats = await getJournalStats();

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <nav className="mb-6 flex gap-3 flex-wrap">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">← Home</Link>
          <span className="text-slate-400">|</span>
          <Link href="/kalender" className="text-slate-600 hover:text-slate-900 font-medium">🗓️ Kalender</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal/uebersicht" className="text-slate-600 hover:text-slate-900 font-medium">📅 Übersicht</Link>
          <span className="text-slate-400">|</span>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">📊 Dashboard</Link>
        </nav>

        {stats.streak > 0 && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="text-orange-900 font-medium">
              {stats.streak}-Tage Streak! {journalEntry ? "Weiter so!" : "Schreib heute um den Streak zu halten."}
            </span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">📔 Zen-Modus</h1>
          <p className="text-slate-700 mb-2 text-lg">Tägliche Reflexion für Klarheit und Wachstum</p>
          <p className="text-slate-500 text-sm mb-6 capitalize">{today}</p>

          {journalEntry && (
            <p className="text-green-600 text-sm font-medium mb-6">✓ Du hast heute schon geschrieben - bearbeiten möglich</p>
          )}

          <JournalForm initialData={journalEntry} isExistingEntry={!!journalEntry} />
        </div>
      </div>
    </div>
  );
}
