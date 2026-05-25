"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { todayInBerlin } from "@/lib/dates";
import { z } from "zod";

// Single-user mode: fixed user ID for personal Life OS
const PERSONAL_USER_ID = "00000000-0000-0000-0000-000000000001";

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
    const supabase = createAdminClient();
    const today = todayInBerlin();

    // Ensure daily_entries exists for today
    const { error: entryError } = await supabase
      .from("daily_entries")
      .upsert(
        { user_id: PERSONAL_USER_ID, date: today },
        { onConflict: "user_id,date" }
      );

    if (entryError) throw entryError;

    // Save journal entry
    const { error } = await supabase
      .from("journal_entries")
      .upsert(
        {
          user_id: PERSONAL_USER_ID,
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
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function loadTodayJournal() {
  try {
    const supabase = createAdminClient();
    const today = todayInBerlin();

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", PERSONAL_USER_ID)
      .eq("date", today)
      .maybeSingle();

    if (error) throw error;

    return data || null;
  } catch (error) {
    console.error("Failed to load journal entry:", error);
    return null;
  }
}
