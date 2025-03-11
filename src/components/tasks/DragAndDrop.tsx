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

// Hook for making a task draggable and a drop target for subtasks and task reordering
export function useTaskDragDrop(
  taskIndex: number,
  taskId: string,
  moveSubtaskToTask: (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex: number
  ) => void,
  moveTaskToSubtask: (sourceTaskIndex: number, targetTaskIndex: number) => void,
  reorderTask?: (dragIndex: number, hoverIndex: number) => void
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

  // Make task a drop target for subtasks and other tasks
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.SUBTASK, ItemTypes.TASK],
    hover: (item: DragItem, monitor) => {
      // Only handle task reordering in hover
      if (
        !reorderTask ||
        item.type !== ItemTypes.TASK ||
        item.taskIndex === taskIndex
      ) {
        return;
      }

      // Get rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Get mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the item's height
      // When dragging downward, only move when the cursor is below 50%
      // When dragging upward, only move when the cursor is above 50%

      // Dragging downward
      if (item.taskIndex < taskIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upward
      if (item.taskIndex > taskIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      reorderTask(item.taskIndex, taskIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.taskIndex = taskIndex;
    },
    drop: (item: DragItem, monitor) => {
      // Handle dropping subtasks on tasks
      if (item.type === ItemTypes.SUBTASK && item.subtaskIndex !== undefined) {
        // A subtask was dropped on this task - move it to become a subtask of this task
        moveSubtaskToTask(item.taskIndex, item.subtaskIndex, taskIndex);
        return;
      }

      // Handle dropping tasks on tasks to make them subtasks
      // Only do this if the drop was completed (not just a hover/reorder)
      if (
        item.type === ItemTypes.TASK &&
        item.taskIndex !== taskIndex &&
        monitor.didDrop() === false
      ) {
        moveTaskToSubtask(item.taskIndex, taskIndex);
      }
    },
    // Don't allow dropping on itself for subtask conversion
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
