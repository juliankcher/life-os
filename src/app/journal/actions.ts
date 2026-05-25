"use server";

import { createClient } from "@/lib/supabase/server";
import { todayInBerlin } from "@/lib/dates";
import { z } from "zod";

const journalEntrySchema = z.object({
  wins: z.string().optional().default(""),
  feelings: z.string().optional().default(""),
  needs: z.string().optional().default(""),
  gratitude: z.string().optional().default(""),
  tomorrow: z.string().optional().default(""),
});

export async function saveJournalEntry(formData: z.infer<typeof journalEntrySchema>) {
  try {
    const validated = journalEntrySchema.parse(formData);
    const supabase = await createClient();
    const today = todayInBerlin();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Ensure daily_entries exists for today
    const { error: entryError } = await supabase
      .from("daily_entries")
      .upsert(
        { user_id: user.id, date: today },
        { onConflict: "user_id,date" }
      );

    if (entryError) throw entryError;

    // Save journal entry
    const { error } = await supabase
      .from("journal_entries")
      .upsert(
        {
          user_id: user.id,
          date: today,
          wins: validated.wins,
          feelings: validated.feelings,
          needs: validated.needs,
          gratitude: validated.gratitude,
          tomorrow: validated.tomorrow,
        },
        { onConflict: "user_id,date" }
      );

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Failed to save journal entry:", error);
    return { success: false, error: String(error) };
  }
}

export async function loadTodayJournal() {
  try {
    const supabase = await createClient();
    const today = todayInBerlin();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to load journal entry:", error);
    return null;
  }
}
