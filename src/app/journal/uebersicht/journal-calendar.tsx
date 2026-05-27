"use client";

import { useState } from "react";
import Link from "next/link";

interface JournalCalendarProps {
  entriesByDate: Record<string, { id: string; preview: string }>;
}

const MONTHS_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const DAYS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function JournalCalendar({ entriesByDate }: JournalCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date().toISOString().split("T")[0];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Monday = 0 in our system
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  
  const weeks: Array<Array<{ date: string; day: number } | null>> = [];
  let currentWeek: Array<{ date: string; day: number } | null> = [];
  
  // Pad start
  for (let i = 0; i < startWeekday; i++) {
    currentWeek.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    currentWeek.push({ date: dateStr, day });
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium">
          ← Vorher
        </button>
        <h2 className="text-2xl font-bold text-slate-900">
          {MONTHS_DE[month]} {year}
        </h2>
        <button onClick={nextMonth} className="px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium">
          Nachher →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_DE.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((cell, idx) => {
          if (!cell) {
            return <div key={idx} className="aspect-square" />;
          }
          
          const hasEntry = !!entriesByDate[cell.date];
          const isToday = cell.date === today;
          const isFuture = cell.date > today;
          
          return (
            <Link
              key={idx}
              href={`/journal/${cell.date}`}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg
                text-sm font-medium transition-all relative
                ${isFuture ? "text-slate-300 hover:bg-slate-50" : ""}
                ${!isFuture && !hasEntry ? "text-slate-700 hover:bg-slate-100" : ""}
                ${hasEntry ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm" : ""}
                ${isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""}
              `}
            >
              <span>{cell.day}</span>
              {hasEntry && (
                <span className="text-xs mt-0.5">✓</span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Eintrag vorhanden</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-blue-500"></div>
          <span>Heute</span>
        </div>
      </div>
    </div>
  );
}
