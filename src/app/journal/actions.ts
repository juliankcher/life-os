"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { todayInBerlin } from "@/lib/dates";
import { z } from "zod";

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

    console.log("[Journal] Saving for date:", today);

    const { error: entryError } = await supabase
      .from("daily_entries")
      .upsert(
        { user_id: PERSONAL_USER_ID, date: today },
        { onConflict: "user_id,date" }
      );

    if (entryError) {
      console.error("[Journal] daily_entries error:", entryError);
      return { success: false, error: `DB Error (daily_entries): ${entryError.message} | Code: ${entryError.code} | Details: ${entryError.details}` };
    }

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

    if (error) {
      console.error("[Journal] journal_entries error:", error);
      return { success: false, error: `DB Error (journal_entries): ${error.message} | Code: ${error.code}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[Journal] Caught error:", error);
    const errorMsg = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : typeof error === "object" 
        ? JSON.stringify(error) 
        : String(error);
    return { success: false, error: errorMsg };
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

    if (error) {
      console.error("[Journal Load] Error:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error("[Journal Load] Caught:", error);
    return null;
  }
}
