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
    drop: (item: DragItem) => {
      if (item.type === ItemTypes.SUBTASK && item.subtaskIndex !== undefined) {
        // A subtask was dropped on this task - move it to become a subtask of this task
        moveSubtaskToTask(item.taskIndex, item.subtaskIndex, taskIndex);
      } else if (item.type === ItemTypes.TASK) {
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

// Add this new hook
export const useTaskReorderDragDrop = (index, id, moveTask) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { type: ItemTypes.TASK, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

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
      moveTask(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
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
};
