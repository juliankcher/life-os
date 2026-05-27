import { config } from "dotenv";
config({ path: ".env.local" });
import ical from "node-ical";

const url = process.env.GOOGLE_CALENDAR_ICS_URL;
if (!url) {
  console.error("❌ GOOGLE_CALENDAR_ICS_URL nicht gesetzt");
  process.exit(1);
}

console.log("📥 Lade Kalender von:", url.slice(0, 80) + "...");

const response = await fetch(url);
if (!response.ok) {
  console.error("❌ HTTP", response.status);
  process.exit(1);
}

const text = await response.text();
console.log("✓ ICS Daten erhalten:", text.length, "Bytes\n");

const parsed = ical.parseICS(text);
const events = Object.values(parsed).filter((e) => e.type === "VEVENT");

console.log(`✓ ${events.length} Termine gefunden gesamt\n`);

// Show next 10 upcoming events
const now = new Date();
const upcoming = events
  .filter((e) => new Date(e.end) >= now)
  .sort((a, b) => new Date(a.start) - new Date(b.start))
  .slice(0, 10);

console.log("📅 Nächste 10 Termine:\n");
for (const e of upcoming) {
  const start = new Date(e.start);
  const dateStr = start.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(`  ${dateStr}  -  ${e.summary}`);
}
