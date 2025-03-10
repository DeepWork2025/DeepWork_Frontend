import React from "react";
import Calendar from "../Calendar/Calendar";
import Timer from "../timer/Timer";

const LeftSideBar: React.FC = () => {
  return (
    <div className="w-[320px] h-screen bg-gray-100 p-4 shadow-md flex flex-col \">
      <Calendar />
      <Timer />
    </div>
  );
};

export default LeftSideBar;
