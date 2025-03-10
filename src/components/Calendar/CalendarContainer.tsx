import { useEffect, useRef } from "react";
import DayCalendar from "./DayCalendar";
import WorkLogCalendar from "../workLog/WorkLogCalendar";

const CalendarContainer = () => {
  const leftCalendarRef = useRef<HTMLDivElement>(null);
  const rightCalendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function syncHeight() {
      if (leftCalendarRef.current && rightCalendarRef.current) {
        const maxHeight = Math.max(
          leftCalendarRef.current.clientHeight,
          rightCalendarRef.current.clientHeight
        );
        leftCalendarRef.current.style.height = `${maxHeight}px`;
        rightCalendarRef.current.style.height = `${maxHeight}px`;
      }
    }

    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, []);

  return (
    <div className="flex w-full space-x-4">
      {/* Left: Day Calendar */}
      <div ref={leftCalendarRef} className="w-1/2 bg-gray-100 p-4">
        <DayCalendar />
      </div>

      {/* Right: WorkLog Calendar */}
      <div ref={rightCalendarRef} className="w-1/2 bg-gray-100 p-4">
        <WorkLogCalendar />
      </div>
    </div>
  );
};

export default CalendarContainer;