import React, { useState } from "react";
import MonthCalendar from "./MonthCalendar.tsx";
import WorkLogSummary from "./WorkLogSummary";

interface LeftSideBarProps { 
  selectedDate: Date; 
  onDateClick: (date: Date) => void; 
}
const LeftSideBar: React.FC<LeftSideBarProps> = ({ selectedDate, onDateClick }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div
      className={`bg-white h-full transition-all duration-300 ${
        isSidebarExpanded ? "w-[400px]" : "w-[80px]"
      }`}
    >
      <button
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="p-2 bg-customBlue1 hover:bg-customBlue2 transition w-full"
      >
        {isSidebarExpanded ? "⏪" : "⏩"}
      </button>
      {isSidebarExpanded && (
        <div className="p-4">
          <MonthCalendar
            selectedDate={selectedDate}
            onDateClick={onDateClick}
          />
          <WorkLogSummary
          selectedDate={selectedDate}
          />
        </div>
      )}
    </div>
  );
};

export default LeftSideBar;
