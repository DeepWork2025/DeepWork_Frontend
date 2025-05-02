import React from "react";
import TaskList from "../tasks/TaskList";
import FullCalendarWrapper from "../calendar/FullCalendarWrapper";
import { Task } from "../../types/TaskTypes";

interface TaskCalendarLayoutProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskCalendarLayout: React.FC<TaskCalendarLayoutProps> = ({
  tasks,
  setTasks,
}) => {
  return (
    <div className="flex gap-4 p-4">
      <TaskList tasks={tasks} setTasks={setTasks} />
      <div className="flex-grow">
        <FullCalendarWrapper selectedDate={new Date()}/>
      </div>
    </div>
  );
};

export default TaskCalendarLayout;
