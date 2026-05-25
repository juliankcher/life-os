"use client";

import { useState, useTransition } from "react";
import { saveJournalEntry } from "./actions";
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
}

export function JournalForm({ initialData }: JournalFormProps) {
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
      const result = await saveJournalEntry(data);
      if (result.success) {
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setError(result.error || "Speichern fehlgeschlagen");
        setStatus("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="wins" className="block text-base font-bold mb-2 text-slate-900">
          🏆 Erfolge heute
        </label>
        <Textarea
          id="wins"
          name="wins"
          defaultValue={initialData?.wins || ""}
          placeholder="Was lief heute gut? Worauf bist du stolz?"
          className="min-h-24 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="feelings" className="block text-base font-bold mb-2 text-slate-900">
          💭 Gefühle
        </label>
        <Textarea
          id="feelings"
          name="feelings"
          defaultValue={initialData?.feelings || ""}
          placeholder="Wie hast du dich heute gefühlt?"
          className="min-h-24 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="needs" className="block text-base font-bold mb-2 text-slate-900">
          🎯 Bedürfnisse
        </label>
        <Textarea
          id="needs"
          name="needs"
          defaultValue={initialData?.needs || ""}
          placeholder="Was brauchst du gerade? Was fehlt dir?"
          className="min-h-24 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="gratitude" className="block text-base font-bold mb-2 text-slate-900">
          ✨ Dankbarkeit
        </label>
        <Textarea
          id="gratitude"
          name="gratitude"
          defaultValue={initialData?.gratitude || ""}
          placeholder="Wofür bist du heute dankbar?"
          className="min-h-24 text-slate-900"
        />
      </div>

      <div>
        <label htmlFor="tomorrow" className="block text-base font-bold mb-2 text-slate-900">
          🌅 Morgen
        </label>
        <Textarea
          id="tomorrow"
          name="tomorrow"
          defaultValue={initialData?.tomorrow || ""}
          placeholder="Worauf willst du dich morgen fokussieren?"
          className="min-h-24 text-slate-900"
        />
      </div>

      <div className="flex gap-4 items-center">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? "Speichere..." : "Journal speichern"}
        </Button>
        
        {status === "saved" && (
          <div className="text-green-600 font-bold">✓ Gespeichert!</div>
        )}
        {status === "error" && (
          <div className="text-red-600 font-bold text-sm">{error}</div>
        )}
      </div>
    </form>
  );
}
