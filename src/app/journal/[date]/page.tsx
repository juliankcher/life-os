import Link from "next/link";
import { notFound } from "next/navigation";
import { loadJournalByDate } from "../actions";
import { JournalForm } from "../journal-form";

export default async function JournalDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const entry = await loadJournalByDate(date);
  const dateObj = new Date(date);
  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;
  const isFuture = date > today;

  const formattedDate = dateObj.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const prev = new Date(dateObj); prev.setDate(prev.getDate() - 1);
  const next = new Date(dateObj); next.setDate(next.getDate() + 1);
  const prevDate = prev.toISOString().split("T")[0];
  const nextDate = next.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <nav className="mb-6 flex gap-3 flex-wrap">
          <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">← Home</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal" className="text-slate-600 hover:text-slate-900 font-medium">📔 Heute</Link>
          <span className="text-slate-400">|</span>
          <Link href="/journal/uebersicht" className="text-slate-600 hover:text-slate-900 font-medium">📅 Übersicht</Link>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h1 className="text-3xl font-bold text-slate-900 capitalize">
              {isToday ? "📔 Heute" : "📔 " + formattedDate}
            </h1>
            <div className="flex gap-2">
              <Link href={`/journal/${prevDate}`} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium">
                ← {prev.toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
              </Link>
              {nextDate <= today && (
                <Link href={`/journal/${nextDate}`} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium">
                  {next.toLocaleDateString("de-DE", { day: "numeric", month: "short" })} →
                </Link>
              )}
            </div>
          </div>

          {!isToday && (
            <p className="text-slate-500 text-sm mb-2 capitalize">{formattedDate}</p>
          )}

          {entry ? (
            <p className="text-green-600 text-sm font-medium mb-6">✓ Eintrag vorhanden</p>
          ) : (
            <p className="text-slate-500 text-sm mb-6">Noch kein Eintrag für diesen Tag</p>
          )}

          {isFuture ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-600">🔮 Dieser Tag liegt in der Zukunft</p>
              <p className="text-slate-500 text-sm mt-2">Du kannst nur für heute oder vergangene Tage schreiben</p>
            </div>
          ) : (
            <JournalForm initialData={entry} targetDate={date} isExistingEntry={!!entry} />
          )}
        </div>
      </div>
    </div>
  );
}
