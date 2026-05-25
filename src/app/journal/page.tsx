import { loadTodayJournal } from "./actions";
import { JournalForm } from "./journal-form";

export default async function JournalPage() {
  const journalEntry = await loadTodayJournal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">📔 Zen-Modus</h1>
          <p className="text-slate-600 mb-8">
            Daily reflection and journaling for clarity and growth
          </p>

          <JournalForm initialData={journalEntry} />
        </div>
      </div>
    </div>
  );
}
