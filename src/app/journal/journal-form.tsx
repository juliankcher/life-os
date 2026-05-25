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
  };
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
        setError(result.error || "Failed to save");
        setStatus("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="wins" className="block text-sm font-semibold mb-2">
          🏆 Wins (Today)
        </label>
        <Textarea
          id="wins"
          name="wins"
          defaultValue={initialData?.wins || ""}
          placeholder="What went well today?"
          className="min-h-24"
        />
      </div>

      <div>
        <label htmlFor="feelings" className="block text-sm font-semibold mb-2">
          💭 Feelings
        </label>
        <Textarea
          id="feelings"
          name="feelings"
          defaultValue={initialData?.feelings || ""}
          placeholder="How did you feel?"
          className="min-h-24"
        />
      </div>

      <div>
        <label htmlFor="needs" className="block text-sm font-semibold mb-2">
          🎯 Needs
        </label>
        <Textarea
          id="needs"
          name="needs"
          defaultValue={initialData?.needs || ""}
          placeholder="What do you need?"
          className="min-h-24"
        />
      </div>

      <div>
        <label htmlFor="gratitude" className="block text-sm font-semibold mb-2">
          ✨ Gratitude
        </label>
        <Textarea
          id="gratitude"
          name="gratitude"
          defaultValue={initialData?.gratitude || ""}
          placeholder="What are you grateful for?"
          className="min-h-24"
        />
      </div>

      <div>
        <label htmlFor="tomorrow" className="block text-sm font-semibold mb-2">
          🌅 Tomorrow
        </label>
        <Textarea
          id="tomorrow"
          name="tomorrow"
          defaultValue={initialData?.tomorrow || ""}
          placeholder="What do you want to focus on tomorrow?"
          className="min-h-24"
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? "Saving..." : "Save Journal"}
        </Button>
        
        {status === "saved" && (
          <div className="text-green-600 font-semibold self-center">✓ Saved!</div>
        )}
        {status === "error" && (
          <div className="text-red-600 font-semibold self-center">{error}</div>
        )}
      </div>
    </form>
  );
}
