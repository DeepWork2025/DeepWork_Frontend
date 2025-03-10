import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Calendar from "../components/Calendar/Calendar";
import DayCalendar from "../components/Calendar/DayCalendar";
import RightSideBar from "../components/rightSideBar/RightSideBar";
import WorkLogCalendar from "../components/workLog/WorkLogCalendar";
import CalendarContainer from "../components/Calendar/CalendarContainer";

const Home: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar 顶部导航栏 */}
      <Navbar />

      {/* 主体布局区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}
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
            </div>
          )}
        </div>
          <CalendarContainer />

        {/* 右侧边栏 */}
        <div className="w-[400px] bg-gray-200 overflow-y-auto">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
