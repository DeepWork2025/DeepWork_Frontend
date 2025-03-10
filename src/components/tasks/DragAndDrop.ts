import { MutableRefObject } from "react";

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

export default function createDragAndDrop(
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  dragItem: MutableRefObject<DragItem | null>,
  dragNode: MutableRefObject<HTMLElement | null>
) {
  // 🚀 任务拖拽开始
  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    dragItem.current = item;
    dragNode.current = e.currentTarget as HTMLElement;
    e.dataTransfer.effectAllowed = "move";
  };

  // 🎯 任务拖拽悬停
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // 🎯 处理任务拖放
  const handleDrop = (e: React.DragEvent, targetItem: DragItem) => {
    e.preventDefault();

    if (!dragItem.current) return;

    const { type, taskIndex, subtaskIndex } = dragItem.current;

    if (type === "task") {
      // 🏷️ 拖动任务
      moveTask(taskIndex, targetItem.taskIndex);
    } else if (type === "subtask") {
      // 🏷️ 拖动子任务
      moveSubtask(taskIndex, subtaskIndex!, targetItem.taskIndex);
    }

    dragItem.current = null;
    dragNode.current = null;
  };

  // 🏷️ 任务拖拽到根部（变成独立任务）
  const handleDropOnRoot = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem.current || dragItem.current.type !== "subtask") return;

    const { taskIndex, subtaskIndex } = dragItem.current;
    extractSubtask(taskIndex, subtaskIndex!);

    dragItem.current = null;
    dragNode.current = null;
  };

  // 🏷️ 任务拖拽到根部（允许任务排序）
  const handleRootDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // 🔄 交换任务位置
  const moveTask = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setTasks((prev) => {
      const updatedTasks = [...prev];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);
      return updatedTasks;
    });
  };

  // 🔄 子任务变成另一个任务的子任务
  const moveSubtask = (
    fromTaskIndex: number,
    fromSubtaskIndex: number,
    toTaskIndex: number
  ) => {
    if (fromTaskIndex === toTaskIndex) return;

    setTasks((prev) => {
      const updatedTasks = [...prev];

      // 取出原来的子任务
      const [movedSubtask] = updatedTasks[fromTaskIndex].subtasks.splice(
        fromSubtaskIndex,
        1
      );

      // 插入到目标任务的 `subtasks` 里
      updatedTasks[toTaskIndex].subtasks.push(movedSubtask);

      return updatedTasks;
    });
  };

  // 🔄 子任务拖到根部，变成独立任务
  const extractSubtask = (fromTaskIndex: number, fromSubtaskIndex: number) => {
    setTasks((prev) => {
      const updatedTasks = [...prev];

      // 取出原来的子任务
      const [movedSubtask] = updatedTasks[fromTaskIndex].subtasks.splice(
        fromSubtaskIndex,
        1
      );

      // 变成新任务
      updatedTasks.push({
        text: movedSubtask.text,
        completed: movedSubtask.completed,
        subtasks: [],
        isExpanded: false,
      });

      return updatedTasks;
    });
  };

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDropOnRoot,
    handleRootDragOver,
  };
}
