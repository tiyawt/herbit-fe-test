"use client";

import { useCallback, useEffect, useState } from "react";
import { safeLoad, safeSave } from "@/lib/storage";
import { ymd, daysDiff } from "@/lib/date";
import { STREAK_KEY } from "@/constants/game";

export default function useDailyStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = safeLoad(STREAK_KEY);
    if (s?.count && s.lastDay) setStreak(s.count);
    else safeSave(STREAK_KEY, { count: 0, lastDay: null });
  }, []);

  const bumpIfNewDay = useCallback(() => {
    const today = ymd();
    const s = safeLoad(STREAK_KEY) || { count: 0, lastDay: null };
    if (s.lastDay === today) return;

    let nextCount = 1;
    if (s.lastDay) {
      const diff = daysDiff(new Date(s.lastDay), new Date(today));
      nextCount = diff === 1 ? (s.count || 0) + 1 : 1;
    }
    safeSave(STREAK_KEY, { count: nextCount, lastDay: today });
    setStreak(nextCount);
  }, []);

  return { streak, setStreak, bumpIfNewDay };
}
