export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks: Subtask[];
  isExpanded: boolean;
  dueDate?: string;
}

export interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export interface SubtaskItemProps {
  subtask: Subtask;
  taskIndex: number;
  subtaskIndex: number;
  toggleSubtask: (taskIndex: number, subtaskIndex: number) => void;
  moveSubtaskToTask: (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex?: number
  ) => void;
  convertSubtaskToTask: (taskIndex: number, subtaskIndex: number) => void;
  deleteSubtask: (taskIndex: number, subtaskIndex: number) => void;
}

export interface TaskItemProps {
  task: Task;
  index: number;
  toggleTask: (index: number) => void;
  toggleSubtasks: (index: number) => void;
  toggleSubtask: (taskIndex: number, subtaskIndex: number) => void;
  handleAddSubtaskClick: (index: number) => void;
  moveSubtaskToTask: (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex?: number
  ) => void;
  moveTaskToSubtask: (sourceTaskIndex: number, targetTaskIndex: number) => void;
  reorderTask: (sourceIndex: number, targetIndex: number) => void;
  activeTaskIndex: number | null;
  newSubtask: string;
  handleSubtaskInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlurSubtaskInput: () => void;
  addSubtask: (taskIndex: number, e: React.FormEvent) => void;
  convertSubtaskToTask: (taskIndex: number, subtaskIndex: number) => void;
  deleteTask: (taskIndex: number) => void;
  deleteSubtask: (taskIndex: number, subtaskIndex: number) => void;
}

export interface AddTaskFormProps {
  newTask: string;
  setNewTask: (value: string) => void;
  addTask: (e: React.FormEvent) => void;
}

export interface RootDropAreaProps {
  moveSubtaskToTask: (
    sourceTaskIndex: number,
    subtaskIndex: number,
    targetTaskIndex?: number
  ) => void;
  children: React.ReactNode;
}
