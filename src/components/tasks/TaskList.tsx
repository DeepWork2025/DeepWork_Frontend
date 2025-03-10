"use client";

import type React from "react";
import { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTaskDragDrop, useSubtaskDragDrop, ItemTypes } from "./DragAndDrop";
import { SubtaskContextMenu } from "./SubContextMenu";

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

// Separate component for subtasks
const SubtaskItem = ({
  subtask,
  taskIndex,
  subtaskIndex,
  toggleSubtask,
  moveSubtaskToTask,
  convertSubtaskToTask,
}) => {
  const { ref, isDragging } = useSubtaskDragDrop(
    taskIndex,
    subtaskIndex,
    subtask.id,
    moveSubtaskToTask
  );

  return (
    <li
      ref={ref}
      className={`flex items-center gap-3 group ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => toggleSubtask(taskIndex, subtaskIndex)}
        className="w-5 h-5 border border-gray-400 rounded bg-gray-100 flex items-center justify-center"
      >
        {subtask.completed && "✓"}
      </button>
      <span className={subtask.completed ? "line-through text-gray-500" : ""}>
        {subtask.text}
      </span>

      {/* Add context menu for subtask actions */}
      <SubtaskContextMenu
        taskIndex={taskIndex}
        subtaskIndex={subtaskIndex}
        convertSubtaskToTask={convertSubtaskToTask}
      />
    </li>
  );
};

// Separate component for tasks
const TaskItem = ({
  task,
  index,
  toggleTask,
  toggleSubtasks,
  toggleSubtask,
  handleAddSubtaskClick,
  moveSubtaskToTask,
  moveTaskToSubtask,
  activeTaskIndex,
  newSubtask,
  handleSubtaskInputChange,
  handleBlurSubtaskInput,
  addSubtask,
  convertSubtaskToTask,
}) => {
  const { ref, isDragging, isOver } = useTaskDragDrop(
    index,
    task.id,
    moveSubtaskToTask,
    moveTaskToSubtask
  );

  return (
    <li
      ref={ref}
      className={`space-y-2 ${isDragging ? "opacity-50" : ""} ${
        isOver ? "bg-gray-100 rounded" : ""
      }`}
    >
      <div className="flex items-center gap-3 group relative">
        <button
          type="button"
          onClick={() => toggleTask(index)}
          className="w-5 h-5 border border-gray-400 rounded bg-gray-100 flex items-center justify-center"
        >
          {task.completed && "✓"}
        </button>

        <span
          className={`flex-grow ${
            task.completed ? "line-through text-gray-500" : ""
          }`}
        >
          {task.text}
        </span>

        <button
          type="button"
          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity absolute right-10 text-gray-500 hover:text-gray-700"
          onClick={() => handleAddSubtaskClick(index)}
          title="Add subtask"
        >
          +
        </button>

        {(task.subtasks.length > 0 || task.isExpanded) && (
          <button
            type="button"
            className="w-8 h-8 text-gray-500 hover:text-gray-700"
            onClick={() => toggleSubtasks(index)}
            title={task.isExpanded ? "Hide subtasks" : "Show subtasks"}
          >
            {task.isExpanded ? "▼" : "►"}
          </button>
        )}
      </div>

      {task.isExpanded && (
        <div className="ml-8 space-y-2">
          <ul className="space-y-2">
            {task.subtasks.map((subtask, subtaskIndex) => (
              <SubtaskItem
                key={`${index}-${subtaskIndex}`}
                subtask={subtask}
                taskIndex={index}
                subtaskIndex={subtaskIndex}
                toggleSubtask={toggleSubtask}
                moveSubtaskToTask={moveSubtaskToTask}
                convertSubtaskToTask={convertSubtaskToTask}
              />
            ))}
          </ul>

          {activeTaskIndex === index && (
            <form
              onSubmit={(e) => addSubtask(index, e)}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 border border-gray-400 rounded bg-gray-100" />
              <input
                id={`subtask-input-${index}`}
                type="text"
                placeholder="Add a subtask"
                className="w-full bg-transparent border-none focus:outline-none text-gray-600 placeholder-gray-400"
                value={newSubtask}
                onChange={handleSubtaskInputChange}
                onBlur={handleBlurSubtaskInput}
              />
            </form>
          )}
        </div>
      )}
    </li>
  );
};

// Add Task Form component
const AddTaskForm = ({ newTask, setNewTask, addTask }) => {
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
        <button
          type="submit"
          className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
          disabled={newTask.trim() === ""}
          title="Add task"
        ></button>
      </form>
    </li>
  );
};

// Root drop area component
// Modified RootDropArea component
const RootDropArea = ({ moveSubtaskToTask, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.SUBTASK,
    drop: (item, monitor) => {
      // Only handle the drop if it wasn't handled by a child component
      if (monitor.didDrop()) {
        return;
      }

      // When a subtask is dropped here, convert it to a main task
      // by calling moveSubtaskToTask without a targetTaskIndex
      moveSubtaskToTask(item.taskIndex, item.subtaskIndex);
    },
    // Only collect isOver if we're not over a child
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div
      ref={drop}
      className={`w-full h-full ${isOver ? "bg-gray-50" : ""}`}
      style={{ minHeight: "100px" }}
    >
      {children}
    </div>
  );
};

export default function TaskList() {
  // Initialize with an empty array instead of sample tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: generateId(),
        text: newTask,
        completed: false,
        subtasks: [],
        isExpanded: false,
      },
    ]);
    setNewTask("");
  };

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleSubtasks = (index: number) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, isExpanded: !task.isExpanded } : task
      )
    );
  };

  const addSubtask = (taskIndex: number, e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission

    if (newSubtask.trim() === "") return;

    setTasks((prev) => {
      const updatedTasks = [...prev];
      const task = updatedTasks[taskIndex];

      // Check if the subtask already exists
      const isSubtaskExists = task.subtasks.some(
        (subtask) => subtask.text === newSubtask.trim()
      );
      if (isSubtaskExists) return prev; // Don't add if the subtask already exists

      task.subtasks.push({
        id: generateId(),
        text: newSubtask.trim(),
        completed: false,
      });

      return updatedTasks;
    });

    setNewSubtask(""); // Clear the input field after adding
    setActiveTaskIndex(null); // Reset active task index
  };

  const toggleSubtask = (taskIndex: number, subtaskIndex: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const subtasks = [...updatedTasks[taskIndex].subtasks];

      // Create a new subtask object with toggled completed state
      const updatedSubtask = {
        ...subtasks[subtaskIndex],
        completed: !subtasks[subtaskIndex].completed,
      };

      // Replace the subtask in the array
      subtasks[subtaskIndex] = updatedSubtask;

      // Update the task with the new subtasks array
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        subtasks,
      };

      return updatedTasks;
    });
  };

  const handleAddSubtaskClick = (index: number) => {
    if (!tasks[index].isExpanded) {
      toggleSubtasks(index);
    }
    // Set active task to the current one
    setActiveTaskIndex(index);

    setTimeout(() => {
      const subtaskInput = document.getElementById(`subtask-input-${index}`);
      if (subtaskInput) {
        subtaskInput.focus();
      }
    }, 100);
  };

  // Function to handle input for a specific task
  const handleSubtaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubtask(e.target.value);
  };

  // Function to handle clicking away from subtask input
  const handleBlurSubtaskInput = () => {
    // Only clear active task index if the subtask input is empty
    if (newSubtask.trim() === "") {
      setActiveTaskIndex(null);
    }
  };

  // Move a subtask to become a main task or another task's subtask
  // Modified moveSubtaskToTask function
  const moveSubtaskToTask = (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex?: number
  ) => {
    setTasks((prevTasks) => {
      // Create a copy of the tasks array
      const updatedTasks = [...prevTasks];

      // If the subtask doesn't exist (it might have been already moved), return the current state
      if (
        !updatedTasks[sourceTaskIndex] ||
        !updatedTasks[sourceTaskIndex].subtasks[subtaskIndex]
      ) {
        return prevTasks;
      }

      // Get the subtask to be moved
      const subtaskToMove = {
        ...updatedTasks[sourceTaskIndex].subtasks[subtaskIndex],
      };

      // Remove the subtask from its original position
      updatedTasks[sourceTaskIndex].subtasks = updatedTasks[
        sourceTaskIndex
      ].subtasks.filter((_, index) => index !== subtaskIndex);

      if (targetTaskIndex !== undefined) {
        // Move to another task's subtasks
        if (updatedTasks[targetTaskIndex]) {
          // Ensure target task exists
          updatedTasks[targetTaskIndex].subtasks.push({
            ...subtaskToMove,
            id: generateId(), // Generate a new ID for the moved subtask
          });

          // Make sure the target task is expanded
          if (!updatedTasks[targetTaskIndex].isExpanded) {
            updatedTasks[targetTaskIndex].isExpanded = true;
          }
        }

        return updatedTasks;
      } else {
        // Create a new task from the subtask
        const newTask: Task = {
          id: generateId(),
          text: subtaskToMove.text,
          completed: subtaskToMove.completed,
          subtasks: [],
          isExpanded: false,
        };

        // Add the new task to the tasks array
        return [...updatedTasks, newTask];
      }
    });
  };

  // Move a task to become a subtask of another task
  const moveTaskToSubtask = (
    sourceTaskIndex: number,
    targetTaskIndex: number
  ) => {
    setTasks((prevTasks) => {
      // Don't allow a task to become its own subtask
      if (sourceTaskIndex === targetTaskIndex) return prevTasks;

      const updatedTasks = [...prevTasks];

      // Get the task to be moved
      const taskToMove = updatedTasks[sourceTaskIndex];

      // Create a new subtask from the task
      const newSubtask: Subtask = {
        id: generateId(),
        text: taskToMove.text,
        completed: taskToMove.completed,
      };

      // Add the subtask to the target task
      updatedTasks[targetTaskIndex].subtasks.push(newSubtask);

      // If the task being moved has subtasks, move them to the target task as well
      if (taskToMove.subtasks.length > 0) {
        updatedTasks[targetTaskIndex].subtasks = [
          ...updatedTasks[targetTaskIndex].subtasks,
          ...taskToMove.subtasks.map((subtask) => ({
            ...subtask,
            id: generateId(), // Generate new IDs for the moved subtasks
          })),
        ];
      }

      // Make sure the target task is expanded to show the new subtasks
      if (!updatedTasks[targetTaskIndex].isExpanded) {
        updatedTasks[targetTaskIndex].isExpanded = true;
      }

      // Remove the original task
      return updatedTasks.filter((_, index) => index !== sourceTaskIndex);
    });
  };

  // Add a button to convert a subtask to a task
  const convertSubtaskToTask = (taskIndex: number, subtaskIndex: number) => {
    moveSubtaskToTask(taskIndex, subtaskIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-screen overflow-hidden max-w-md mx-auto p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Tasks</h2>

        <RootDropArea moveSubtaskToTask={moveSubtaskToTask}>
          <ul className="space-y-3 mb-4">
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                toggleTask={toggleTask}
                toggleSubtasks={toggleSubtasks}
                toggleSubtask={toggleSubtask}
                handleAddSubtaskClick={handleAddSubtaskClick}
                moveSubtaskToTask={moveSubtaskToTask}
                moveTaskToSubtask={moveTaskToSubtask}
                activeTaskIndex={activeTaskIndex}
                newSubtask={newSubtask}
                handleSubtaskInputChange={handleSubtaskInputChange}
                handleBlurSubtaskInput={handleBlurSubtaskInput}
                addSubtask={addSubtask}
                convertSubtaskToTask={convertSubtaskToTask}
              />
            ))}

            {/* Add Task Form at the end of the tasks list */}
            <AddTaskForm
              newTask={newTask}
              setNewTask={setNewTask}
              addTask={addTask}
            />
          </ul>
        </RootDropArea>
      </div>
    </DndProvider>
  );
}
