import { WorkLogData } from "../types/workLog.type";

interface WorkLogSummary {
  totalMs: number;
  totalMinutes: number;
  formatted: string;
}

/**
 * Calculates total work time for a given date,
 * including a live-running timer if an active log is passed.
 */
export const calculateTodayWorkLogTime = (
  logs: WorkLogData[],
  date: Date,
  activeLog?: WorkLogData,
  elapsedMs?: number
): WorkLogSummary => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  let totalMs = 0;

  // Sum durations for logs on the given date
  logs.forEach((log) => {
    const start = new Date(log.start);
    const end = new Date(log.end);

    if (
      start >= startOfDay &&
      start <= endOfDay &&
      !isNaN(start.getTime()) &&
      !isNaN(end.getTime())
    ) {
      totalMs += end.getTime() - start.getTime();
    }
  });

  // If an active log is running on the same day, include its live duration
  if (activeLog && elapsedMs) {
    const activeStart = new Date(activeLog.start);
    if (activeStart >= startOfDay && activeStart <= endOfDay) {
      totalMs += elapsedMs;
    }
  }

  const totalMinutes = Math.floor(totalMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    totalMs,
    totalMinutes,
    formatted: `${hours}h ${minutes}m`,
  };
};