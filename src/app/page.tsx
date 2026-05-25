import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-6xl font-bold text-slate-900 mb-4">🚀 Life OS</h1>
            <p className="text-xl text-slate-700">
              Dein persönliches Betriebssystem für Alltag, Journaling & Wachstum
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/journal"
              className="px-8 py-4 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition text-lg shadow-md"
            >
              📔 Journal öffnen
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 transition text-lg shadow-md border border-slate-300"
            >
              📊 Dashboard
            </Link>
          </div>

          <div className="pt-8 border-t border-slate-200 mt-12">
            <p className="text-slate-500 text-sm">Phase 1: Journaling & Google Calendar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
