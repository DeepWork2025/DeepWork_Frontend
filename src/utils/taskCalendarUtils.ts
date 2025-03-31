import { EventInput } from "@fullcalendar/core";
import { Task } from "../types/TaskTypes";

/**
 * Converts tasks and subtasks to calendar events
 * @param tasks Array of task objects from the task list
 * @param options Configuration options for event creation
 * @returns Array of calendar events compatible with FullCalendar
 */
export const convertTasksToCalendarEvents = (
  tasks: Task[],
  options: {
    defaultDuration?: number; // Duration in minutes
    taskColor?: string;
    completedTaskColor?: string;
    subtaskColor?: string;
    completedSubtaskColor?: string;
    includeSubtasks?: boolean;
  } = {}
): EventInput[] => {
  // Set default options
  const {
    defaultDuration = 60, // Default 1 hour duration
    taskColor = "#2196f3",
    completedTaskColor = "#4caf50",
    subtaskColor = "#90caf9",
    completedSubtaskColor = "#8bc34a",
    includeSubtasks = true,
  } = options;

  const events: EventInput[] = [];
  const currentDate = new Date();

  // Function to generate a time that's during working hours (9am-5pm)
  const generateDefaultTime = (index: number): Date => {
    const date = new Date(currentDate);
    // Start at 9am
    date.setHours(9 + (index % 8), 0, 0, 0);
    return date;
  };

  // Process each task
  tasks.forEach((task, taskIndex) => {
    let startTime: Date;

    // Use task's dueDate if available, otherwise generate a default time
    if (task.dueDate) {
      startTime = new Date(task.dueDate);
    } else {
      startTime = generateDefaultTime(taskIndex);
    }

    // Create end time based on the default duration
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + defaultDuration);

    // Create event for the task
    const taskEvent: EventInput = {
      id: String(Number(task.id.replace(/\D/g, "")) || taskIndex + 1), // Convert string id to number or use index+1
      title: task.text,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      color: task.completed ? completedTaskColor : taskColor,
      extendedProps: {
        type: "task",
        originalTaskId: task.id,
        isCompleted: task.completed,
      },
    };

    events.push(taskEvent);

    // Add subtasks if included in options
    if (includeSubtasks && task.subtasks.length > 0) {
      task.subtasks.forEach((subtask, subtaskIndex) => {
        // For subtasks, offset the start time by defaultDuration + a little extra per subtask
        const subtaskStartTime = new Date(endTime);
        subtaskStartTime.setMinutes(
          subtaskStartTime.getMinutes() + subtaskIndex * 30
        );

        const subtaskEndTime = new Date(subtaskStartTime);
        subtaskEndTime.setMinutes(
          subtaskEndTime.getMinutes() + defaultDuration / 2
        ); // Half the duration for subtasks

        const subtaskEvent: EventInput = {
          id: String(Number(`${taskIndex + 1}${subtaskIndex + 1}`) + 1000), // Create a unique ID
          title: `${task.text}: ${subtask.text}`,
          start: subtaskStartTime.toISOString(),
          end: subtaskEndTime.toISOString(),
          color: subtask.completed ? completedSubtaskColor : subtaskColor,
          extendedProps: {
            type: "subtask",
            originalTaskId: task.id,
            originalSubtaskId: subtask.id,
            parentTaskTitle: task.text,
            isCompleted: subtask.completed,
          },
        };

        events.push(subtaskEvent);
      });
    }
  });

  return events;
};

/**
 * Updates task data based on calendar event changes
 * @param tasks Current tasks array
 * @param eventId ID of the event that changed
 * @param newStartTime New start time from the calendar event
 * @returns Updated tasks array
 */
export const updateTaskFromCalendarEvent = (
  tasks: Task[],
  eventId: string,
  newStartTime: string
): Task[] => {
  // Create a copy of the tasks array to avoid mutating the original
  const updatedTasks = [...tasks];

  // Find the event with the given ID in all events
  const allEvents = convertTasksToCalendarEvents(tasks);
  const event = allEvents.find((e) => e.id === eventId);

  if (!event) return tasks; // Event not found

  // Determine if it's a task or subtask
  if (event.extendedProps?.type === "task") {
    const taskId = event.extendedProps.originalTaskId;
    const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      // Update the task's due date
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        dueDate: newStartTime,
      };
    }
  } else if (event.extendedProps?.type === "subtask") {
    const taskId = event.extendedProps.originalTaskId;
    const subtaskId = event.extendedProps.originalSubtaskId;

    const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      const subtaskIndex = updatedTasks[taskIndex].subtasks.findIndex(
        (s) => s.id === subtaskId
      );

      if (subtaskIndex !== -1) {
        // Create a new subtasks array
        const updatedSubtasks = [...updatedTasks[taskIndex].subtasks];

        // Update the specific subtask
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          dueDate: newStartTime,
        };

        // Update the task with the new subtasks array
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          subtasks: updatedSubtasks,
        };
      }
    }
  }

  return updatedTasks;
};

/**
 * Updates task completion status based on calendar event interaction
 * @param tasks Current tasks array
 * @param eventId ID of the event that was clicked
 * @returns Updated tasks array with toggled completion status
 */
export const toggleTaskCompletionFromEvent = (
  tasks: Task[],
  eventId: string
): Task[] => {
  // Create a copy of the tasks array
  const updatedTasks = [...tasks];

  // Find the event with the given ID
  const allEvents = convertTasksToCalendarEvents(tasks);
  const event = allEvents.find((e) => e.id === eventId);

  if (!event) return tasks; // Event not found

  // Toggle completion based on event type
  if (event.extendedProps?.type === "task") {
    const taskId = event.extendedProps.originalTaskId;
    const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      // Toggle task completion
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        completed: !updatedTasks[taskIndex].completed,
      };
    }
  } else if (event.extendedProps?.type === "subtask") {
    const taskId = event.extendedProps.originalTaskId;
    const subtaskId = event.extendedProps.originalSubtaskId;

    const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      const subtaskIndex = updatedTasks[taskIndex].subtasks.findIndex(
        (s) => s.id === subtaskId
      );

      if (subtaskIndex !== -1) {
        // Create a new subtasks array
        const updatedSubtasks = [...updatedTasks[taskIndex].subtasks];

        // Toggle subtask completion
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          completed: !updatedSubtasks[subtaskIndex].completed,
        };

        // Update the task with the new subtasks array
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          subtasks: updatedSubtasks,
        };
      }
    }
  }

  return updatedTasks;
};
