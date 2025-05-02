import React, { useState, Dispatch, SetStateAction } from "react";
import FullCalendarWrapper from "../calendar/FullCalendarWrapper";
import TaskList from "./TaskList";
import {
  convertTasksToCalendarEvents,
  updateTaskFromCalendarEvent,
  toggleTaskCompletionFromEvent,
} from "../../utils/taskCalendarUtils";
import { EventDropArg, EventClickArg } from "@fullcalendar/core";

// Define task-related interfaces if not imported
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
  dueDate?: string;
}

export interface TaskListProps {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}

const TaskCalendarIntegration: React.FC = () => {
  const [view, setView] = useState<"tasks" | "calendar">("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Custom event handlers for calendar integration
  const handleEventDrop = (info: EventDropArg) => {
    const eventId = info.event.id;
    const newStartTime = info.event.start!.toISOString();

    // Update tasks based on the calendar event change
    setTasks((prevTasks) =>
      updateTaskFromCalendarEvent(prevTasks, eventId, newStartTime)
    );
  };

  const handleEventClick = (info: EventClickArg) => {
    const eventId = info.event.id;

    // Toggle task completion when clicked
    setTasks((prevTasks) => toggleTaskCompletionFromEvent(prevTasks, eventId));
  };

  // Function to convert tasks to calendar events
  const getCalendarEvents = () => {
    return convertTasksToCalendarEvents(tasks);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* View Toggle Buttons */}
      <div className="bg-white p-4 border-b flex">
        <button
          onClick={() => setView("tasks")}
          className={`px-4 py-2 rounded-md mr-2 ${
            view === "tasks"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setView("calendar")}
          className={`px-4 py-2 rounded-md ${
            view === "calendar"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Calendar
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {view === "tasks" ? (
          <TaskList tasks={tasks} setTasks={setTasks} />
        ) : (
          <div className="p-4">
            {/* Custom props to pass to your calendar wrapper */}
            <FullCalendarWrapper
              selectedDate={new Date()} //TODO: insert to satisfy syntax
              customEvents={getCalendarEvents()}
              onEventDrop={handleEventDrop}
              onEventClick={handleEventClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCalendarIntegration;
