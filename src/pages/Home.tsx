import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import RightSideBar from "../components/rightSideBar/RightSideBar";
import CalendarContainer from "../components/calendar/CalendarContainer";
import LeftSideBar from "../components/leftSideBar/LeftSideBar";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar 顶部导航栏 */}
      <Navbar />

      {/* 主体布局区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧边栏 */}

        <LeftSideBar
        selectedDate={selectedDate}
        onDateClick={setSelectedDate}
        />

        {/* Calendar */}
        <CalendarContainer
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        />

        {/* 右侧边栏 */}
        <div className="w-[400px] bg-gray-200 ">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
