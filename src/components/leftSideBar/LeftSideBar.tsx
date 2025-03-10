import React, {useState} from "react";
import Calendar from "../Calendar/Calendar";
import WorkLogTimer from "./WorklogTimer";

const LeftSideBar: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div
    className={`bg-gray-100 h-full transition-all duration-300 ${
      isSidebarExpanded ? "w-[320px]" : "w-[80px]"
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
        <Calendar />
        <WorkLogTimer />
      </div>
    )}
  </div>
  );
};

export default LeftSideBar;
