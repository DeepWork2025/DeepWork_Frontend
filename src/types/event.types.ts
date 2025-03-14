export interface Task {
    id: number;
    title: string;
    completed: boolean;
}

export interface EventData {
    id: number;            // Unique identifier
    title: string;          // Event title
    startTime: string;      // ISO 8601 format: "2025-02-25T10:00:00"
    endTime: string;        // ISO 8601 format: "2025-02-25T10:00:00"
    description?: string;   // Optional description
    color?: string;         // Event color
    label?: string;         // Category/type of event
    backgroundColor?: string;
    allDay?: boolean;
    tasks?: Task[];         // Optional array of tasks
    extendedProps?: {
        type?: 'task' | 'subtask';
        taskId?: string;
        subtaskId?: string;
        originalTaskId?: string;
        originalSubtaskId?: string;
        parentTaskTitle?: string;
        isCompleted?: boolean;
    };
}