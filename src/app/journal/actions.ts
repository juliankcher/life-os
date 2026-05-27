"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { todayInBerlin } from "@/lib/dates";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const PERSONAL_USER_ID = "00000000-0000-0000-0000-000000000001";

const journalEntrySchema = z.object({
  wins: z.string().optional().default(""),
  feelings: z.string().optional().default(""),
  needs: z.string().optional().default(""),
  gratitude: z.string().optional().default(""),
  tomorrow: z.string().optional().default(""),
});

export async function saveJournalEntry(
  formData: z.infer<typeof journalEntrySchema>,
  targetDate?: string
) {
  try {
    const validated = journalEntrySchema.parse(formData);
    const supabase = createAdminClient();
    const date = targetDate || todayInBerlin();

    const { error: entryError } = await supabase
      .from("daily_entries")
      .upsert({ user_id: PERSONAL_USER_ID, date }, { onConflict: "user_id,date" });

    if (entryError) {
      return { success: false, error: `DB Error: ${entryError.message}` };
    }

    const { error } = await supabase
      .from("journal_entries")
      .upsert(
        {
          user_id: PERSONAL_USER_ID,
          date,
          wins: validated.wins,
          feelings: validated.feelings,
          needs: validated.needs,
          gratitude: validated.gratitude,
          tomorrow: validated.tomorrow,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,date" }
      );

    if (error) {
      return { success: false, error: `DB Error: ${error.message}` };
    }

    revalidatePath("/journal");
    revalidatePath("/journal/uebersicht");
    revalidatePath(`/journal/${date}`);

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: msg };
  }
}

export async function deleteJournalEntry(date: string) {
  try {
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("user_id", PERSONAL_USER_ID)
      .eq("date", date);

    if (error) return { success: false, error: error.message };

    revalidatePath("/journal");
    revalidatePath("/journal/uebersicht");
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function loadJournalByDate(date: string) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", PERSONAL_USER_ID)
      .eq("date", date)
      .maybeSingle();

    if (error) return null;
    return data || null;
  } catch {
    return null;
  }
}

export async function loadTodayJournal() {
  return loadJournalByDate(todayInBerlin());
}

export async function loadAllJournalEntries() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", PERSONAL_USER_ID)
      .order("date", { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getJournalStats() {
  const entries = await loadAllJournalEntries();
  const today = todayInBerlin();
  
  // Calculate current streak (consecutive days ending today or yesterday)
  let streak = 0;
  const sortedDates = entries.map(e => e.date).sort().reverse();
  
  if (sortedDates.length > 0) {
    const dateSet = new Set(sortedDates);
    let checkDate = new Date(today);
    
    // Allow streak to start from today or yesterday
    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (dateSet.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    total: entries.length,
    streak,
    firstEntry: entries[entries.length - 1]?.date || null,
    lastEntry: entries[0]?.date || null,
  };
}
