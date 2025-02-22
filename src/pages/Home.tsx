import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Calendar from "../components/calendar/Calendar";
import Timer from "../components/timer/Timer";
import TimeAxis from "../components/timeAxis/TimeAxis";
import RightSideBar from "../components/rightSideBar/RightSideBar";

const Home: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar 顶部导航栏 */}
      <Navbar />

      {/* 主体布局区域 */}
      <div className="flex flex-1">
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
              <Timer />
            </div>
          )}
        </div>

        {/* 中间 TimeAxis */}
        <div className="flex-1">
          <TimeAxis />
        </div>

        {/* 右侧边栏 */}
        <div className="w-[400px] bg-gray-200">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
