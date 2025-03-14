import React, { useState } from "react";
import TaskList from "../tasks/TaskList";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  isExpanded: boolean;
}

const RightSideBar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className=" h-screen overflow-hidden bg-gray-100 p-4 shadow-md ">
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default RightSideBar;
