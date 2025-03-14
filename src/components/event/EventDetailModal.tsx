import React, { useState } from 'react';
import { EventData, Task } from '../../types/event.types';

// Calculate event duration
const getDuration = (start: Date | null, end: Date | null) => {
  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return ''; // Handle missing or invalid dates
  }

  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.round(durationMs / (1000 * 60));

  if (durationMinutes < 60) {
    return `${durationMinutes}m`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
};

interface EventModalProps {
  event: EventData;
  onClose: () => void;
  onDelete: (id: number) => void;
  onUpdate?: (updatedEvent: EventData) => void;
  onStartTimer?: () => void;
  onMarkComplete?: () => void;
}

const EventDetailModal: React.FC<EventModalProps> = ({ 
  event, 
  onClose, 
  onDelete,
  onUpdate,
  onStartTimer,
  onMarkComplete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<EventData>({...event});
  const [editedTasks, setEditedTasks] = useState<Task[]>(event.tasks || []);
  
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  
  // Format date for display
  const getFormattedDate = (date: Date) => {
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    return `${weekday}, ${day} ${month}`;
  };

  // Format time for display
  const getFormattedTime = (date: Date) => {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  const handleSaveChanges = () => {
    // Create updated event object with tasks included
    const updatedEvent: EventData = {
      ...editedEvent,
      tasks: editedTasks
    };
    
    if (onUpdate) {
      onUpdate(updatedEvent);
    }
    setIsEditing(false);
  };
  
  const handleTaskChange = (taskId: number, completed: boolean) => {
    setEditedTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? {...task, completed} : task
      )
    );
  };
  
  const handleTaskTitleChange = (taskId: number, title: string) => {
    setEditedTasks(tasks => 
      tasks.map(task => 
        task.id === taskId ? {...task, title} : task
      )
    );
  };
  
  const addNewTask = () => {
    const newId = Math.max(0, ...editedTasks.map(t => t.id)) + 1;
    setEditedTasks([...editedTasks, { id: newId, title: '', completed: false }]);
  };
  
  const removeTask = (taskId: number) => {
    setEditedTasks(tasks => tasks.filter(task => task.id !== taskId));
  };

  // Current tasks (either from event or empty array)
  const tasks = event.tasks || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        {/* Header with title and icons */}
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <input 
              type="text" 
              value={editedEvent.title} 
              onChange={(e) => setEditedEvent({...editedEvent, title: e.target.value})}
              className="text-xl font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
            />
          ) : (
            <h3 className="text-xl font-semibold">{event.title}</h3>
          )}
          <div className="flex space-x-2">
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Save changes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Edit event"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button 
              onClick={isEditing ? () => setIsEditing(false) : onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label={isEditing ? "Cancel editing" : "Close modal"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Event details */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{getFormattedDate(startTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{getFormattedTime(startTime)} - {getFormattedTime(endTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{getDuration(startTime, endTime)}</span>
          </div>
        </div>

        {/* Tasks section */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Tasks</h4>
          <div className="space-y-2">
            {isEditing ? (
              editedTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => handleTaskChange(task.id, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleTaskTitleChange(task.id, e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <button
                    onClick={() => removeTask(task.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              tasks.map(task => (
                <div key={task.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    disabled
                    className="h-4 w-4"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.title}
                  </span>
                </div>
              ))
            )}
            {isEditing && (
              <button
                onClick={addNewTask}
                className="mt-2 text-blue-500 hover:text-blue-700 flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          {onStartTimer && (
            <button
              onClick={onStartTimer}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Timer
            </button>
          )}
          {onMarkComplete && (
            <button
              onClick={onMarkComplete}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;