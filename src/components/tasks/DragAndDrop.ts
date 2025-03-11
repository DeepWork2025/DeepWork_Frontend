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
  index?: number; // Added for compatibility with useTaskReorderDragDrop
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
      // If the drop was already handled by a child component, don't handle it again
      if (monitor.didDrop()) {
        return;
      }

      if (item.type === ItemTypes.SUBTASK && item.subtaskIndex !== undefined) {
        // A subtask was dropped on this task - move it to become a subtask of this task
        moveSubtaskToTask(item.taskIndex, item.subtaskIndex, taskIndex);
      } else if (
        item.type === ItemTypes.TASK &&
        item.taskIndex !== undefined &&
        item.taskIndex !== taskIndex
      ) {
        // A task was dropped on this task - move it to become a subtask of this task
        moveTaskToSubtask(item.taskIndex, taskIndex);
      }
    },
    // Don't allow dropping on itself
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

  // Apply both drag and drop refs to the element
  drag(drop(ref));

  return { ref, isDragging, isOver };
}

// Hook for making a subtask draggable
export function useSubtaskDragDrop(
  taskIndex: number,
  subtaskIndex: number,
  subtaskId: string,
  moveSubtaskToTask: (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex?: number
  ) => void
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

// Fixed useTaskReorderDragDrop hook
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
      taskIndex, // Use consistent naming
      index: taskIndex, // Keep index for backward compatibility
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

      // Use either taskIndex or index, whichever is available
      const dragIndex =
        item.taskIndex !== undefined ? item.taskIndex : item.index;
      const hoverIndex = taskIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      reorderTask(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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

// New hook for task-to-subtask conversion only (no reordering)
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

  // Make task a drop target for subtasks and other tasks
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.SUBTASK, ItemTypes.TASK],
    drop: (item: DragItem, monitor) => {
      // If the drop was already handled by a child component, don't handle it again
      if (monitor.didDrop()) {
        return;
      }

      if (item.type === ItemTypes.SUBTASK && item.subtaskIndex !== undefined) {
        // A subtask was dropped on this task - move it to become a subtask of this task
        moveSubtaskToTask(item.taskIndex, item.subtaskIndex, taskIndex);
      } else if (item.type === ItemTypes.TASK) {
        // Get the taskIndex, either from taskIndex or index property
        const sourceIndex =
          item.taskIndex !== undefined ? item.taskIndex : item.index;

        // Only proceed if we have a valid source index and it's not the same as target
        if (sourceIndex !== undefined && sourceIndex !== taskIndex) {
          // A task was dropped on this task - move it to become a subtask of this task
          moveTaskToSubtask(sourceIndex, taskIndex);
        }
      }
    },
    // Don't allow dropping on itself
    canDrop: (item: DragItem) => {
      const sourceIndex =
        item.taskIndex !== undefined ? item.taskIndex : item.index;
      return (
        item.type === ItemTypes.SUBTASK ||
        (item.type === ItemTypes.TASK && sourceIndex !== taskIndex)
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  drop(ref);

  return { ref, isOver };
}
