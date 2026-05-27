"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveJournalEntry, deleteJournalEntry } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface JournalFormProps {
  initialData?: {
    wins?: string;
    feelings?: string;
    needs?: string;
    gratitude?: string;
    tomorrow?: string;
  } | null;
  targetDate?: string;
  isExistingEntry?: boolean;
}

export function JournalForm({ initialData, targetDate, isExistingEntry }: JournalFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      wins: formData.get("wins") as string,
      feelings: formData.get("feelings") as string,
      needs: formData.get("needs") as string,
      gratitude: formData.get("gratitude") as string,
      tomorrow: formData.get("tomorrow") as string,
    };

    startTransition(async () => {
      const result = await saveJournalEntry(data, targetDate);
      if (result.success) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
        router.refresh();
      } else {
        setError(result.error || "Speichern fehlgeschlagen");
        setStatus("error");
      }
    });
  }

  async function handleDelete() {
    if (!targetDate || !confirm("Eintrag wirklich löschen?")) return;
    
    startTransition(async () => {
      const result = await deleteJournalEntry(targetDate);
      if (result.success) {
        router.push("/journal/uebersicht");
      } else {
        setError(result.error || "Löschen fehlgeschlagen");
        setStatus("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="wins" className="block text-base font-bold mb-2 text-slate-900">
          🏆 Erfolge
        </label>
        <Textarea id="wins" name="wins" defaultValue={initialData?.wins || ""}
          placeholder="Was lief gut? Worauf bist du stolz?" className="min-h-24" />
      </div>

      <div>
        <label htmlFor="feelings" className="block text-base font-bold mb-2 text-slate-900">
          💭 Gefühle
        </label>
        <Textarea id="feelings" name="feelings" defaultValue={initialData?.feelings || ""}
          placeholder="Wie hast du dich gefühlt?" className="min-h-24" />
      </div>

      <div>
        <label htmlFor="needs" className="block text-base font-bold mb-2 text-slate-900">
          🎯 Bedürfnisse
        </label>
        <Textarea id="needs" name="needs" defaultValue={initialData?.needs || ""}
          placeholder="Was brauchst du? Was fehlt dir?" className="min-h-24" />
      </div>

      <div>
        <label htmlFor="gratitude" className="block text-base font-bold mb-2 text-slate-900">
          ✨ Dankbarkeit
        </label>
        <Textarea id="gratitude" name="gratitude" defaultValue={initialData?.gratitude || ""}
          placeholder="Wofür bist du dankbar?" className="min-h-24" />
      </div>

      <div>
        <label htmlFor="tomorrow" className="block text-base font-bold mb-2 text-slate-900">
          🌅 Nächster Tag
        </label>
        <Textarea id="tomorrow" name="tomorrow" defaultValue={initialData?.tomorrow || ""}
          placeholder="Worauf willst du dich fokussieren?" className="min-h-24" />
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Button type="submit" disabled={isPending} className="flex-1 min-w-[200px]">
          {isPending ? "Speichere..." : isExistingEntry ? "Eintrag aktualisieren" : "Journal speichern"}
        </Button>
        
        {isExistingEntry && targetDate && (
          <Button type="button" onClick={handleDelete} disabled={isPending}
            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
            Löschen
          </Button>
        )}
        
        {status === "saved" && (
          <div className="text-green-600 font-bold">✓ Gespeichert!</div>
        )}
        {status === "error" && (
          <div className="text-red-600 font-bold text-sm max-w-md">{error}</div>
        )}
      </div>
    </form>
  );
}
