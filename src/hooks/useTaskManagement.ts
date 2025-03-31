import { Dispatch, SetStateAction } from "react";
import { Task } from "../types/TaskTypes";

export const useTaskManagement = (
  tasks: Task[],
  setTasks: Dispatch<SetStateAction<Task[]>>,
  newTask: string,
  setNewTask: Dispatch<SetStateAction<string>>,
  newSubtask: string,
  setNewSubtask: Dispatch<SetStateAction<string>>,
  activeTaskIndex: number | null,
  setActiveTaskIndex: Dispatch<SetStateAction<number | null>>
) => {
  const generateId = () => Math.random().toString(36).substring(2, 9);

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
    e.preventDefault();
    if (newSubtask.trim() === "") return;

    setTasks((prev) => {
      const updatedTasks = [...prev];
      const task = updatedTasks[taskIndex];

      const isSubtaskExists = task.subtasks.some(
        (subtask) => subtask.text === newSubtask.trim()
      );
      if (isSubtaskExists) return prev;

      task.subtasks.push({
        id: generateId(),
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
      subtasks[subtaskIndex] = {
        ...subtasks[subtaskIndex],
        completed: !subtasks[subtaskIndex].completed,
      };
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], subtasks };
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

  const moveSubtaskToTask = (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex?: number
  ) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      if (!updatedTasks[sourceTaskIndex]?.subtasks[subtaskIndex])
        return prevTasks;

      const subtaskToMove = {
        ...updatedTasks[sourceTaskIndex].subtasks[subtaskIndex],
      };
      updatedTasks[sourceTaskIndex].subtasks = updatedTasks[
        sourceTaskIndex
      ].subtasks.filter((_, index) => index !== subtaskIndex);

      if (targetTaskIndex !== undefined) {
        if (updatedTasks[targetTaskIndex]) {
          updatedTasks[targetTaskIndex].subtasks.push({
            ...subtaskToMove,
            id: generateId(),
          });
          if (!updatedTasks[targetTaskIndex].isExpanded) {
            updatedTasks[targetTaskIndex].isExpanded = true;
          }
        }
        return updatedTasks;
      }

      return [
        ...updatedTasks,
        {
          id: generateId(),
          text: subtaskToMove.text,
          completed: subtaskToMove.completed,
          subtasks: [],
          isExpanded: false,
        },
      ];
    });
  };

  const moveTaskToSubtask = (
    sourceTaskIndex: number,
    targetTaskIndex: number
  ) => {
    setTasks((prevTasks) => {
      if (sourceTaskIndex === targetTaskIndex) return prevTasks;
      if (
        sourceTaskIndex < 0 ||
        sourceTaskIndex >= prevTasks.length ||
        targetTaskIndex < 0 ||
        targetTaskIndex >= prevTasks.length
      ) {
        console.error(
          "Invalid task indices:",
          sourceTaskIndex,
          targetTaskIndex
        );
        return prevTasks;
      }

      const updatedTasks = [...prevTasks];
      const taskToMove = updatedTasks[sourceTaskIndex];
      const newSubtask = {
        id: generateId(),
        text: taskToMove.text,
        completed: taskToMove.completed,
      };

      updatedTasks[targetTaskIndex].subtasks.push(newSubtask);
      if (taskToMove.subtasks.length > 0) {
        updatedTasks[targetTaskIndex].subtasks = [
          ...updatedTasks[targetTaskIndex].subtasks,
          ...taskToMove.subtasks.map((subtask) => ({
            ...subtask,
            id: generateId(),
          })),
        ];
      }
      if (!updatedTasks[targetTaskIndex].isExpanded) {
        updatedTasks[targetTaskIndex].isExpanded = true;
      }

      return updatedTasks.filter((_, index) => index !== sourceTaskIndex);
    });
  };

  const reorderTask = (dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const draggedTask = updatedTasks[dragIndex];
      updatedTasks.splice(dragIndex, 1);
      updatedTasks.splice(hoverIndex, 0, draggedTask);
      return updatedTasks;
    });
  };

  const deleteTask = (taskIndex: number) => {
    setTasks((prevTasks) =>
      prevTasks.filter((_, index) => index !== taskIndex)
    );
  };

  const convertSubtaskToTask = (taskIndex: number, subtaskIndex: number) => {
    moveSubtaskToTask(taskIndex, subtaskIndex);
  };

  const deleteSubtask = (taskIndex: number, subtaskIndex: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex].subtasks = updatedTasks[
        taskIndex
      ].subtasks.filter((_, index) => index !== subtaskIndex);
      return updatedTasks;
    });
  };

  return {
    addTask,
    toggleTask,
    toggleSubtasks,
    addSubtask,
    toggleSubtask,
    handleAddSubtaskClick,
    handleSubtaskInputChange,
    handleBlurSubtaskInput,
    moveSubtaskToTask,
    moveTaskToSubtask,
    reorderTask,
    deleteTask,
    convertSubtaskToTask,
    deleteSubtask,
  };
};
