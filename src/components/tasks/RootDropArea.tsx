import React from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../hooks/DragAndDrop";
import { RootDropAreaProps } from "../../types/TaskTypes";

const RootDropArea: React.FC<RootDropAreaProps> = ({
  moveSubtaskToTask,
  children,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.SUBTASK,
    drop: (item: { taskIndex: number; subtaskIndex: number }) => {
      moveSubtaskToTask(item.taskIndex, item.subtaskIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[100px] ${isOver ? "bg-blue-50 rounded p-4" : ""}`}
    >
      {children}
    </div>
  );
};

export default RootDropArea;
