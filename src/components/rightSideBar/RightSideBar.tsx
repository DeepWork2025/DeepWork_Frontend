import React from "react";
import TaskList from "../tasks/TaskList";

const RightSideBar: React.FC = () => {
  return (
    <div className=" h-screen overflow-hidden bg-gray-100 p-4 shadow-md ">
      <TaskList />
    </div>
  );
};

export default RightSideBar;
