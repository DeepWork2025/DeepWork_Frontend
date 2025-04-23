import React from "react";
import { AddTaskFormProps } from "../../types/TaskTypes";

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  newTask,
  setNewTask,
  addTask,
}) => {
  return (
    <li className="space-y-2">
      <form
        onSubmit={addTask}
        className="flex items-center gap-3 group relative"
      >
        <div className="w-5 h-5 border border-gray-400 rounded bg-gray-100 flex items-center justify-center text-gray-400">
          +
        </div>
        <input
          type="text"
          placeholder="Add a task..."
          className="flex-grow bg-transparent border-none focus:outline-none text-gray-600 placeholder-gray-400"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
      </form>
    </li>
  );
};

export default AddTaskForm;
