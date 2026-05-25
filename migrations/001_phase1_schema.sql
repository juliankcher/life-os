-- Life OS Phase 1: Journaling & Calendar Schema
-- This migration creates the core tables for journaling and daily entries

-- Enable RLS and UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Daily Entries (core reference table)
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Journal Entries (Zen-Modus)
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  wins TEXT,
  feelings TEXT,
  needs TEXT,
  gratitude TEXT,
  tomorrow TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Calendar Events (cached from Google Calendar)
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  google_event_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  is_all_day BOOLEAN DEFAULT false,
  event_date TEXT,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, google_event_id)
);

-- Quick Captures (for future Telegram integration)
CREATE TABLE IF NOT EXISTS quick_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT, -- 'telegram', 'api', 'web'
  category TEXT,
  captured_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ingestion Queue (for webhook processing)
CREATE TABLE IF NOT EXISTS ingestion_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  source TEXT NOT NULL, -- 'telegram', 'shopify', 'health', etc
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY "Users can view their own daily entries"
  ON daily_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily entries"
  ON daily_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily entries"
  ON daily_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own calendar events"
  ON calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events"
  ON calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own quick captures"
  ON quick_captures FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quick captures"
  ON quick_captures FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON daily_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, event_date);
CREATE INDEX IF NOT EXISTS idx_quick_captures_user_date ON quick_captures(user_id, captured_date);
CREATE INDEX IF NOT EXISTS idx_ingestion_queue_source ON ingestion_queue(source, processed);
