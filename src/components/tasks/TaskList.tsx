import type React from "react";
import { useState, useRef, useEffect } from "react";
import createDragAndDrop from "./DragAndDrop";

interface Subtask {
  text: string;
  completed: boolean;
}

interface Task {
  text: string;
  completed: boolean;
  subtasks: Subtask[];
  isExpanded: boolean;
}

interface DragItem {
  type: "task" | "subtask";
  taskIndex: number;
  subtaskIndex?: number;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);

  // Drag and drop refs
  const dragItem = useRef<DragItem | null>(null);
  const dragNode = useRef<HTMLElement | null>(null);

  // Initialize drag and drop
  const {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDropOnRoot,
    handleRootDragOver,
  } = createDragAndDrop(tasks, setTasks, dragItem, dragNode);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (dragNode.current) {
        dragNode.current.removeEventListener("dragend", () => {});
      }
    };
  }, []);

  // Task management functions
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      { text: newTask, completed: false, subtasks: [], isExpanded: false },
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
    e.preventDefault();

    if (newSubtask.trim() === "") return;

    setTasks((prev) => {
      const updatedTasks = [...prev];
      const task = updatedTasks[taskIndex];

      // Check if the subtask already exists
      const isSubtaskExists = task.subtasks.some(
        (subtask) => subtask.text === newSubtask.trim()
      );
      if (isSubtaskExists) return prev;

      task.subtasks.push({
        text: newSubtask.trim(),
        completed: false,
      });

      return updatedTasks;
    });

    setNewSubtask("");
    setActiveTaskIndex(null);
  };

  const toggleSubtask = (taskIndex: number, subtaskIndex: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const subtasks = [...updatedTasks[taskIndex].subtasks];

      const updatedSubtask = {
        ...subtasks[subtaskIndex],
        completed: !subtasks[subtaskIndex].completed,
      };

      subtasks[subtaskIndex] = updatedSubtask;

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
    setActiveTaskIndex(index);

    setTimeout(() => {
      const subtaskInput = document.getElementById(`subtask-input-${index}`);
      if (subtaskInput) {
        subtaskInput.focus();
      }
    }, 100);
  };

  const handleSubtaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubtask(e.target.value);
  };

  const handleBlurSubtaskInput = () => {
    if (newSubtask.trim() === "") {
      setActiveTaskIndex(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>

      {/* Root drop area */}
      <div
        onDragOver={handleRootDragOver}
        onDrop={handleDropOnRoot}
        className="rounded-lg p-2 transition-colors min-h-[200px]"
      >
        <ul className="space-y-3 mb-4">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="space-y-2 rounded p-2 transition-colors cursor-move"
              draggable
              onDragStart={(e) =>
                handleDragStart(e, { type: "task", taskIndex: index })
              }
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, { type: "task", taskIndex: index })}
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
                      <li
                        key={`${index}-${subtaskIndex}`}
                        className="flex items-center gap-3 rounded p-1 transition-colors cursor-move"
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, {
                            type: "subtask",
                            taskIndex: index,
                            subtaskIndex,
                          })
                        }
                        onDragOver={handleDragOver}
                        onDrop={(e) =>
                          handleDrop(e, {
                            type: "subtask",
                            taskIndex: index,
                            subtaskIndex,
                          })
                        }
                      >
                        <button
                          type="button"
                          onClick={() => toggleSubtask(index, subtaskIndex)}
                          className="w-5 h-5 border border-gray-400 rounded bg-gray-100 flex items-center justify-center"
                        >
                          {subtask.completed && "✓"}
                        </button>
                        <span
                          className={
                            subtask.completed
                              ? "line-through text-gray-500"
                              : ""
                          }
                        >
                          {subtask.text}
                        </span>
                      </li>
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
          ))}
        </ul>
      </div>

      <form
        onSubmit={addTask}
        className="bg-gray-100 p-4 rounded-lg flex items-center gap-3"
      >
        <div className="w-5 h-5 border border-gray-400 rounded bg-gray-200" />
        <input
          type="text"
          placeholder="Add a task"
          className="w-full bg-transparent border-none focus:outline-none text-gray-600 placeholder-gray-400"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
      </form>
    </div>
  );
}
