-- Phase 1.1: Single-user mode for personal Life OS
-- Removes auth.users foreign key constraints and disables RLS
-- Uses service role key for all database operations

ALTER TABLE daily_entries DROP CONSTRAINT IF EXISTS daily_entries_user_id_fkey;
ALTER TABLE journal_entries DROP CONSTRAINT IF EXISTS journal_entries_user_id_fkey;
ALTER TABLE calendar_events DROP CONSTRAINT IF EXISTS calendar_events_user_id_fkey;
ALTER TABLE quick_captures DROP CONSTRAINT IF EXISTS quick_captures_user_id_fkey;

ALTER TABLE daily_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE quick_captures DISABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_queue DISABLE ROW LEVEL SECURITY;
