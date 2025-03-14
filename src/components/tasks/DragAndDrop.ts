"use client";

import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";

// Define item types for drag and drop
export const ItemTypes = {
  TASK: "task",
  SUBTASK: "subtask",
};

// Interface for drag items
export interface DragItem {
  type: string;
  taskIndex: number;
  subtaskIndex?: number;
  id: string;
  index?: number;
}

// Hook for making a task draggable and a drop target for subtasks
export function useTaskDragDrop(
  taskIndex: number,
  taskId: string,
  moveSubtaskToTask: (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex: number
  ) => void,
  moveTaskToSubtask: (sourceTaskIndex: number, targetTaskIndex: number) => void
) {
  const ref = useRef<HTMLLIElement>(null);

  // Make task draggable
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { type: ItemTypes.TASK, taskIndex, id: taskId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Make task a drop target for subtasks
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.SUBTASK, ItemTypes.TASK],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }

      if (item.type === ItemTypes.SUBTASK && item.subtaskIndex !== undefined) {
        moveSubtaskToTask(item.taskIndex, item.subtaskIndex, taskIndex);
      } else if (
        item.type === ItemTypes.TASK &&
        item.taskIndex !== undefined &&
        item.taskIndex !== taskIndex
      ) {
        moveTaskToSubtask(item.taskIndex, taskIndex);
      }
    },
    canDrop: (item: DragItem) => {
      return (
        item.type === ItemTypes.SUBTASK ||
        (item.type === ItemTypes.TASK && item.taskIndex !== taskIndex)
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  drag(drop(ref));

  return { ref, isDragging, isOver };
}

// Hook for making a subtask draggable
export function useSubtaskDragDrop(
  taskIndex: number,
  subtaskIndex: number,
  subtaskId: string
) {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SUBTASK,
    item: {
      type: ItemTypes.SUBTASK,
      taskIndex,
      subtaskIndex,
      id: subtaskId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return { ref, isDragging };
}

// Hook for task reordering
export function useTaskReorderDragDrop(
  taskIndex: number,
  taskId: string,
  reorderTask: (dragIndex: number, hoverIndex: number) => void
) {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: {
      type: ItemTypes.TASK,
      id: taskId,
      taskIndex,
      index: taskIndex,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.taskIndex !== undefined ? item.taskIndex : item.index;
      if (dragIndex === undefined) {
        return;
      }

      const hoverIndex = taskIndex;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      reorderTask(dragIndex, hoverIndex);

      item.taskIndex = hoverIndex;
      if (item.index !== undefined) {
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return {
    ref,
    isDragging,
    isOver,
  };
}

// Hook for task-to-subtask conversion
export function useTaskSubtaskConversion(
  taskIndex: number,
  moveSubtaskToTask: (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex: number
  ) => void,
  moveTaskToSubtask: (sourceTaskIndex: number, targetTaskIndex: number) => void
) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.SUBTASK, ItemTypes.TASK],
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }

      if (item.type === ItemTypes.SUBTASK && item.subtaskIndex !== undefined) {
        moveSubtaskToTask(item.taskIndex, item.subtaskIndex, taskIndex);
      } else if (item.type === ItemTypes.TASK) {
        const sourceIndex = item.taskIndex !== undefined ? item.taskIndex : item.index;
        if (sourceIndex !== undefined && sourceIndex !== taskIndex) {
          moveTaskToSubtask(sourceIndex, taskIndex);
        }
      }
    },
    canDrop: (item: DragItem) => {
      const sourceIndex = item.taskIndex !== undefined ? item.taskIndex : item.index;
      return (
        item.type === ItemTypes.SUBTASK ||
        (item.type === ItemTypes.TASK && sourceIndex !== taskIndex)
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  return { ref, isOver };
}
