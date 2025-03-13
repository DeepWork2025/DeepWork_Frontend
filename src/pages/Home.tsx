import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Calendar from "../components/Calendar/Calendar";
import DayCalendar from "../components/Calendar/DayCalendar";
import RightSideBar from "../components/rightSideBar/RightSideBar";
import WorkLogCalendar from "../components/workLog/WorkLogCalendar";
import CalendarContainer from "../components/Calendar/CalendarContainer";
import LeftSideBar from "../components/leftSideBar/LeftSideBar";

const Home: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar 顶部导航栏 */}
      <Navbar />

      {/* 主体布局区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}

        <LeftSideBar />

        {/* Calendar */}
        <CalendarContainer />

        {/* 右侧边栏 */}
        <div className="w-[400px] bg-gray-200 ">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
