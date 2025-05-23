import React from "react";
import { useDrag } from "react-dnd";

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks: Subtask[];
  isExpanded: boolean;
}

interface DraggableTaskProps {
  task: Task;
  children: React.ReactNode;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({ task, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: {
      id: `task-${task.id}`,
      title: task.text,
      extendedProps: {
        taskId: task.id,
        isTaskEvent: true,
        description: task.text,
        label: "Deep",
      },
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div className="flex items-center gap-2">
      {/* Calendar drag handle */}
      <div
        ref={drag}
        className={`cursor-move px-2 py-1 text-gray-500 hover:text-gray-700 ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      {/* Task content */}
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default DraggableTask;
