import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-6xl font-bold text-slate-900 mb-4">
              🚀 Life OS
            </h1>
            <p className="text-xl text-slate-600">
              Your personal operating system for daily life, journaling & growth
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/journal"
              className="px-8 py-4 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition text-lg"
            >
              📔 Start Journal
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition text-lg"
            >
              📊 View Dashboard
            </Link>
          </div>

          <div className="pt-8 border-t border-slate-200 mt-12">
            <p className="text-slate-500 text-sm">
              Phase 1: Journaling & Google Calendar Integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
