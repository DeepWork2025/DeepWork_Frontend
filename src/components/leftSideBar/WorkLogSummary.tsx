import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { EventData } from "../../types/event.types";

/**
 * Utility function to calculate total work log time
 */
export const calculateTodayWorkLogTime = (events: EventData[], date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const dayEvents = events.filter((event) => {
    const eventStart = new Date(event.startTime);
    return eventStart >= startOfDay && eventStart <= endOfDay;
  });

  let totalMs = 0;
  dayEvents.forEach((event) => {
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      totalMs += end.getTime() - start.getTime();
    }
  });

  const totalMinutes = Math.floor(totalMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    totalMs,
    totalMinutes,
    formatted: `${hours}h ${minutes}m`,
  };
};


/**
 * Component to display total logged work time
 */

interface WorkLogSummaryProps {
  selectedDate: Date;
}

const WorkLogSummary: React.FC<WorkLogSummaryProps> = ({selectedDate}) => {
  const events = useSelector((state: RootState) => state.events.events);
  const total = calculateTodayWorkLogTime(events, selectedDate);

  return (
    <div className="px-4 py-3 border-t mt-4 text-sm text-gray-700 bg-white shadow-sm rounded">
      <div className="font-medium text-gray-900">Total Work Time</div>
       <div className="font-medium text-gray-900">
        {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}'s Work Time
      </div>
      <div className="text-blue-600 font-semibold text-lg mt-1">
        {total.formatted}
      </div>
    </div>
  );
};

export default WorkLogSummary;