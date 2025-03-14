import React, { useState } from "react";
import MonthCalendar from "../calendar/MonthCalendar";
import WorkLogTimer from "./WorkLogTimer";

const LeftSideBar: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div
      className={`bg-gray-100 h-full transition-all duration-300 ${
        isSidebarExpanded ? "w-[400px]" : "w-[80px]"
      }`}
    >
      <button
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="p-2 bg-gray-300 hover:bg-gray-400 transition w-full"
      >
        {isSidebarExpanded ? "⏪" : "⏩"}
      </button>
      {isSidebarExpanded && (
        <div className="p-4">
          <MonthCalendar />
          <WorkLogTimer />
        </div>
      )}
    </div>
  );
};

export default LeftSideBar;
