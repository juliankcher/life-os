"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SerializedEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  calendarName?: string;
  startDateTime: string | null;
  startDate: string | null;
  endDateTime: string | null;
  endDate: string | null;
}

interface CalendarViewProps {
  year: number;
  month: number;
  events: SerializedEvent[];
}

const MONTHS_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const DAYS_DE_LONG = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const DAYS_DE_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// Color palette for different calendars
const CALENDAR_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Julian: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-900", dot: "bg-blue-500" },
  Geburtstage: { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-900", dot: "bg-pink-500" },
  Tasks: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-900", dot: "bg-purple-500" },
  Feiertage: { bg: "bg-green-100", border: "border-green-400", text: "text-green-900", dot: "bg-green-500" },
};

function getColorClasses(calendarName?: string) {
  if (!calendarName) return CALENDAR_COLORS.Julian;
  if (calendarName.includes("Feiertage")) return CALENDAR_COLORS.Feiertage;
  if (calendarName.includes("Geburts")) return CALENDAR_COLORS.Geburtstage;
  if (calendarName.includes("Task")) return CALENDAR_COLORS.Tasks;
  return CALENDAR_COLORS[calendarName] || CALENDAR_COLORS.Julian;
}

function getEventDate(e: SerializedEvent): string {
  const dt = e.startDateTime || e.startDate || "";
  return dt.split("T")[0];
}

function formatTime(e: SerializedEvent): string {
  if (e.startDate) return "Ganztägig";
  if (!e.startDateTime) return "";
  const d = new Date(e.startDateTime);
  return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });
}

function formatTimeRange(e: SerializedEvent): string {
  if (e.startDate) return "Ganztägig";
  if (!e.startDateTime) return "";
  const start = new Date(e.startDateTime).toLocaleTimeString("de-DE", {
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
  });
  if (!e.endDateTime) return start;
  const end = new Date(e.endDateTime).toLocaleTimeString("de-DE", {
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin",
  });
  return `${start} – ${end}`;
}

export function CalendarView({ year, month, events }: CalendarViewProps) {
  const router = useRouter();
  const [view, setView] = useState<"month" | "week" | "agenda">("month");
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, SerializedEvent[]> = {};
    for (const e of events) {
      const date = getEventDate(e);
      if (!map[date]) map[date] = [];
      map[date].push(e);
    }
    return map;
  }, [events]);

  // Build month grid (6 weeks)
  const grid = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0
    const gridStart = new Date(firstDay);
    gridStart.setDate(gridStart.getDate() - startWeekday);

    const weeks: Array<Array<{ date: string; day: number; isCurrentMonth: boolean }>> = [];
    for (let w = 0; w < 6; w++) {
      const week: Array<{ date: string; day: number; isCurrentMonth: boolean }> = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(gridStart);
        cellDate.setDate(gridStart.getDate() + w * 7 + d);
        const dateStr = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, "0")}-${String(cellDate.getDate()).padStart(2, "0")}`;
        week.push({
          date: dateStr,
          day: cellDate.getDate(),
          isCurrentMonth: cellDate.getMonth() === month,
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [year, month]);

  const totalEventsThisMonth = useMemo(() => {
    return events.filter((e) => {
      const d = new Date(getEventDate(e));
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [events, year, month]);

  const selectedEvents = eventsByDate[selectedDate] || [];

  function navMonth(delta: number) {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    router.push(`/kalender?year=${newYear}&month=${newMonth}`);
  }

  function goToday() {
    const now = new Date();
    router.push(`/kalender?year=${now.getFullYear()}&month=${now.getMonth()}`);
    setSelectedDate(today);
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">📅 Kalender</h1>
            <p className="text-slate-600">
              {totalEventsThisMonth} {totalEventsThisMonth === 1 ? "Termin" : "Termine"} in {MONTHS_DE[month]} {year}
            </p>
          </div>

          {/* View Switcher */}
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setView("month")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                view === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              Monat
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                view === "week" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              Woche
            </button>
            <button
              onClick={() => setView("agenda")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                view === "agenda" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
              }`}
            >
              Agenda
            </button>
          </div>
        </div>

        {/* Month nav - mobile responsive */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 items-center">
            <button onClick={() => navMonth(-1)} className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium" aria-label="Vorheriger Monat">
              ←
            </button>
            <button onClick={goToday} className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium text-sm">
              Heute
            </button>
            <button onClick={() => navMonth(1)} className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium" aria-label="Nächster Monat">
              →
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 order-first w-full sm:order-none sm:w-auto text-center sm:text-left">
            {MONTHS_DE[month]} {year}
          </h2>
          <button
            disabled
            title="Bald verfügbar (Phase 2)"
            className="px-3 py-2 rounded-lg bg-slate-200 text-slate-500 font-medium text-sm cursor-not-allowed whitespace-nowrap"
          >
            + Termin
          </button>
        </div>
      </div>

      {view === "month" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Month Grid */}
          <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4 border border-slate-200">
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
              {DAYS_DE_SHORT.map((d) => (
                <div key={d} className="text-center text-[10px] sm:text-xs font-bold text-slate-500 py-1 sm:py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {grid.flat().map((cell, idx) => {
                const dayEvents = eventsByDate[cell.date] || [];
                const isToday = cell.date === today;
                const isSelected = cell.date === selectedDate;

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(cell.date)}
                    className={`
                      min-h-[60px] sm:min-h-[90px] p-1 sm:p-2 rounded-md sm:rounded-lg border text-left transition relative overflow-hidden
                      ${cell.isCurrentMonth ? "bg-white" : "bg-slate-50"}
                      ${isSelected ? "border-blue-500 border-2 ring-1 sm:ring-2 ring-blue-200" : "border-slate-200 active:bg-slate-100 hover:border-slate-400"}
                      ${isToday ? "ring-1 ring-orange-400" : ""}
                    `}
                  >
                    <div className={`text-xs sm:text-sm font-bold mb-0.5 sm:mb-1 ${
                      !cell.isCurrentMonth ? "text-slate-400" :
                      isToday ? "text-orange-600" : "text-slate-900"
                    }`}>
                      {cell.day}
                      {isToday && <span className="ml-0.5 sm:ml-1 text-[8px] sm:text-xs">●</span>}
                    </div>

                    {/* Mobile: just dots, Desktop: event names */}
                    <div className="hidden sm:block space-y-0.5">
                      {dayEvents.slice(0, 3).map((e) => {
                        const c = getColorClasses(e.calendarName);
                        return (
                          <div
                            key={e.id}
                            className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium ${c.bg} ${c.text} ${c.border} border`}
                            title={`${e.summary} (${formatTime(e)})`}
                          >
                            {!e.startDate && (
                              <span className="opacity-70">{formatTime(e)} </span>
                            )}
                            {e.summary}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-slate-500 font-medium pl-1.5">
                          +{dayEvents.length - 3} weitere
                        </div>
                      )}
                    </div>

                    {/* Mobile: just colored dots */}
                    <div className="flex sm:hidden gap-0.5 flex-wrap mt-0.5">
                      {dayEvents.slice(0, 4).map((e) => {
                        const c = getColorClasses(e.calendarName);
                        return (
                          <div
                            key={e.id}
                            className={`w-1.5 h-1.5 rounded-full ${c.dot}`}
                          />
                        );
                      })}
                      {dayEvents.length > 4 && (
                        <div className="text-[8px] text-slate-500">+{dayEvents.length - 4}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-4 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded ring-1 ring-orange-400"></div>
                <span className="text-slate-600">Heute</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-slate-600">Hauptkalender</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-slate-600">Feiertage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-pink-500"></div>
                <span className="text-slate-600">Geburtstage</span>
              </div>
            </div>
          </div>

          {/* Day Details Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 h-fit lg:sticky lg:top-4">
            <h3 className="font-bold text-slate-900 mb-1">
              {new Date(selectedDate).toLocaleDateString("de-DE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {selectedEvents.length} {selectedEvents.length === 1 ? "Termin" : "Termine"}
            </p>

            {selectedEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedEvents.map((e) => {
                  const c = getColorClasses(e.calendarName);
                  return (
                    <div
                      key={e.id}
                      className={`p-3 rounded-lg border ${c.border} ${c.bg}`}
                    >
                      <div className={`font-bold text-sm ${c.text}`}>{e.summary}</div>
                      <div className="text-xs text-slate-600 mt-1">⏰ {formatTimeRange(e)}</div>
                      {e.location && (
                        <div className="text-xs text-slate-600 mt-0.5">📍 {e.location}</div>
                      )}
                      {e.description && (
                        <div className="text-xs text-slate-600 mt-1 line-clamp-2">{e.description}</div>
                      )}
                      {e.calendarName && (
                        <div className="text-[10px] text-slate-500 mt-1">{e.calendarName}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="text-sm text-slate-600">Keine Termine</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200">
              <Link
                href={`/journal/${selectedDate}`}
                className="block text-center px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700"
              >
                📔 Journal für diesen Tag
              </Link>
            </div>
          </div>
        </div>
      )}

      {view === "agenda" && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Termin-Liste</h2>
          {events.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Keine Termine in diesem Zeitraum</p>
          ) : (
            <div className="space-y-2">
              {events.map((e) => {
                const c = getColorClasses(e.calendarName);
                const eventDate = new Date(getEventDate(e));
                return (
                  <div key={e.id} className={`flex items-start gap-3 p-3 rounded-lg border ${c.border} ${c.bg}`}>
                    <div className="text-center min-w-[60px]">
                      <div className="text-[10px] text-slate-600 uppercase font-bold">
                        {eventDate.toLocaleDateString("de-DE", { weekday: "short" })}
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{eventDate.getDate()}</div>
                      <div className="text-[10px] text-slate-600">
                        {eventDate.toLocaleDateString("de-DE", { month: "short" })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold ${c.text}`}>{e.summary}</div>
                      <div className="text-xs text-slate-600 mt-0.5">⏰ {formatTimeRange(e)}</div>
                      {e.location && (
                        <div className="text-xs text-slate-600 mt-0.5">📍 {e.location}</div>
                      )}
                      {e.calendarName && (
                        <div className="text-[10px] text-slate-500 mt-1">{e.calendarName}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view === "week" && (
        <WeekView events={events} selectedDate={selectedDate} eventsByDate={eventsByDate} />
      )}
    </div>
  );
}

function WeekView({
  selectedDate,
  eventsByDate,
}: {
  events: SerializedEvent[];
  selectedDate: string;
  eventsByDate: Record<string, SerializedEvent[]>;
}) {
  // Get Monday of the week containing selectedDate
  const center = new Date(selectedDate);
  const dayOfWeek = (center.getDay() + 6) % 7;
  const monday = new Date(center);
  monday.setDate(center.getDate() - dayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { date: dateStr, dayObj: d };
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(({ date, dayObj }) => {
          const dayEvents = eventsByDate[date] || [];
          const isToday = date === today;
          return (
            <div
              key={date}
              className={`p-3 rounded-lg border min-h-[300px] ${
                isToday ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="text-center mb-3 pb-2 border-b border-slate-200">
                <div className="text-xs text-slate-600 font-bold uppercase">
                  {DAYS_DE_LONG[(dayObj.getDay() + 6) % 7].slice(0, 3)}
                </div>
                <div className={`text-2xl font-bold ${isToday ? "text-orange-600" : "text-slate-900"}`}>
                  {dayObj.getDate()}
                </div>
              </div>
              <div className="space-y-1">
                {dayEvents.map((e) => {
                  const c = getColorClasses(e.calendarName);
                  return (
                    <div
                      key={e.id}
                      className={`text-xs p-2 rounded border ${c.bg} ${c.border} ${c.text}`}
                    >
                      <div className="font-bold truncate">{e.summary}</div>
                      <div className="opacity-75 mt-0.5">{formatTimeRange(e)}</div>
                    </div>
                  );
                })}
                {dayEvents.length === 0 && (
                  <div className="text-xs text-slate-400 italic text-center py-2">—</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
