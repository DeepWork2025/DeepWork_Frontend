import React from "react";
import {
  useTaskReorderDragDrop,
  useTaskSubtaskConversion,
} from "../../hooks/DragAndDrop";
import { TaskContextMenu } from "./TaskContextMenu";
import DraggableTask from "./DraggableTask";
import SubtaskItem from "./SubtaskItem";
import { TaskItemProps } from "../../types/TaskTypes";

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  toggleTask,
  toggleSubtasks,
  toggleSubtask,
  handleAddSubtaskClick,
  moveSubtaskToTask,
  moveTaskToSubtask,
  reorderTask,
  activeTaskIndex,
  newSubtask,
  handleSubtaskInputChange,
  handleBlurSubtaskInput,
  addSubtask,
  convertSubtaskToTask,
  deleteTask,
  deleteSubtask,
}) => {
  const {
    ref,
    isDragging,
    isOver: isOverForReorder,
  } = useTaskReorderDragDrop(index, task.id, reorderTask);

  const { ref: contentRef, isOver: isOverForConversion } =
    useTaskSubtaskConversion(index, moveSubtaskToTask, moveTaskToSubtask);

  const hasHiddenSubtasks = task.subtasks.length > 0 && !task.isExpanded;

  return (
    <li
      ref={ref}
      className={`space-y-2 ${isDragging ? "opacity-50" : ""} ${
        isOverForReorder ? "bg-gray-100 rounded" : ""
      }`}
    >
      <DraggableTask task={task}>
        <div
          ref={contentRef}
          className={`flex items-center gap-3 group relative ${
            isOverForConversion ? "bg-blue-50 rounded p-1" : ""
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTask(index);
            }}
            className="w-5 h-5 border border-gray-400 rounded bg-gray-100 flex items-center justify-center"
          >
            {task.completed && "✓"}
          </button>

          <span
            className={`flex-grow ${
              task.completed ? "line-through text-gray-500" : ""
            } cursor-pointer flex items-center`}
            onClick={(e) => {
              e.stopPropagation();
              if (task.subtasks.length > 0) {
                toggleSubtasks(index);
              }
            }}
          >
            {task.text}

            {hasHiddenSubtasks && (
              <span className="ml-2 text-gray-400 text-sm flex items-center">
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="ml-1 text-xs">{task.subtasks.length}</span>
              </span>
            )}

            {task.subtasks.length > 0 && task.isExpanded && (
              <span className="ml-2 text-gray-400 text-sm flex items-center">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="ml-1 text-xs">{task.subtasks.length}</span>
              </span>
            )}
          </span>

          <TaskContextMenu
            taskIndex={index}
            handleAddSubtaskClick={handleAddSubtaskClick}
            deleteTask={deleteTask}
            toggleSubtasks={toggleSubtasks}
            hasSubtasks={task.subtasks.length > 0}
            isExpanded={task.isExpanded}
          />
        </div>
      </DraggableTask>

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
                deleteSubtask={deleteSubtask}
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

export default TaskItem;
