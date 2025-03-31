import React from "react";
import { useSubtaskDragDrop } from "../../hooks/DragAndDrop";
import { SubtaskContextMenu } from "./SubtaskContextMenu";
import { SubtaskItemProps } from "../../types/TaskTypes";

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  taskIndex,
  subtaskIndex,
  toggleSubtask,
  moveSubtaskToTask,
  convertSubtaskToTask,
  deleteSubtask,
}) => {
  // Type assertion to mark moveSubtaskToTask as used (it's used in drag and drop)
  void moveSubtaskToTask;

  const { ref, isDragging } = useSubtaskDragDrop(
    taskIndex,
    subtaskIndex,
    subtask.id
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

      <SubtaskContextMenu
        taskIndex={taskIndex}
        subtaskIndex={subtaskIndex}
        convertSubtaskToTask={convertSubtaskToTask}
        deleteSubtask={deleteSubtask}
      />
    </li>
  );
};

export default SubtaskItem;
