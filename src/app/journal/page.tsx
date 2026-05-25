import Link from "next/link";
import { loadTodayJournal } from "./actions";
import { JournalForm } from "./journal-form";

export default async function JournalPage() {
  const journalEntry = await loadTodayJournal();

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <nav className="mb-8 flex gap-3">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">← Home</Link>
          <span className="text-slate-400">|</span>
          <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium">📊 Dashboard</Link>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">📔 Zen-Modus</h1>
          <p className="text-slate-700 mb-2 text-lg">
            Tägliche Reflexion für Klarheit und Wachstum
          </p>
          <p className="text-slate-500 text-sm mb-8 capitalize">{today}</p>

          <JournalForm initialData={journalEntry} />
        </div>
      </div>
    </div>
  );
}
