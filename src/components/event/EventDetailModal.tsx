import React, { useState } from 'react';
import { EventData } from '../../types/event.types';

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
  const [editedTasks, setEditedTasks] = useState(event.tasks || [
    { id: 1, title: 'task1', completed: false },
    { id: 2, title: 'task2', completed: false }
  ]);
  
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
    const updatedEvent = {
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

  // Current tasks (either from event or placeholder)
  const tasks = event.tasks || [
    { id: 1, title: 'task1', completed: false },
    { id: 2, title: 'task2', completed: false }
  ];

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

        {/* Type */}
        <div className="mb-4">
          {isEditing ? (
            <div className="flex items-center">
              <span className="font-medium mr-2">Type:</span>
              <select 
                value={editedEvent.label || ''}
                onChange={(e) => setEditedEvent({...editedEvent, label: e.target.value})}
                className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                <option value="deep">Deep</option>
                <option value="meeting">Meeting</option>
                <option value="personal">Personal</option>
                {/* Add more event types as needed */}
              </select>
            </div>
          ) : (
            <p><span className="font-medium">Type:</span> {event.label || 'None'}</p>
          )}
        </div>

        {/* Time and date with clock icon */}
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            {isEditing ? (
              <div className="flex space-x-2">
                <div>
                  <label className="text-xs block">Start</label>
                  <input 
                    type="datetime-local" 
                    value={editedEvent.startTime ? new Date(editedEvent.startTime).toISOString().slice(0, 16) : ''} 
                    onChange={(e) => setEditedEvent({...editedEvent, startTime: new Date(e.target.value).toISOString()})}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs block">End</label>
                  <input 
                    type="datetime-local" 
                    value={editedEvent.endTime ? new Date(editedEvent.endTime).toISOString().slice(0, 16) : ''} 
                    onChange={(e) => setEditedEvent({...editedEvent, endTime: new Date(e.target.value).toISOString()})}
                    className="border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            ) : (
              <>
                <p>{getFormattedTime(startTime)} - {getFormattedTime(endTime)}</p>
                <p className="text-gray-600">{getFormattedDate(startTime)}</p>
              </>
            )}
          </div>
        </div>

        {/* Tasks section */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h4 className="font-medium">Tasks</h4>
            {isEditing && (
              <button 
                onClick={addNewTask} 
                className="ml-2 text-blue-500 p-1 hover:bg-blue-100 rounded-full"
                aria-label="Add task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
          <ul className="ml-7 space-y-1">
            {isEditing ? (
              editedTasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={(e) => handleTaskChange(task.id, e.target.checked)}
                    className="mr-2" 
                  />
                  <input 
                    type="text" 
                    value={task.title} 
                    onChange={(e) => handleTaskTitleChange(task.id, e.target.value)}
                    className="border-b border-gray-300 focus:outline-none focus:border-blue-500 flex-grow"
                  />
                  <button 
                    onClick={() => removeTask(task.id)}
                    className="ml-2 text-red-500 p-1 hover:bg-red-100 rounded-full"
                    aria-label="Remove task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-7V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))
            ) : (
              tasks.map(task => (
                <li key={task.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    className="mr-2" 
                    readOnly 
                  />
                  <span>{task.title}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Description if available */}
        <div className="mb-4">
          <p className="font-medium">Description:</p>
          {isEditing ? (
            <textarea
              value={editedEvent.description || ''}
              onChange={(e) => setEditedEvent({...editedEvent, description: e.target.value})}
              className="w-full border rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          ) : (
            event.description ? (
              <p className="mt-1">{event.description}</p>
            ) : (
              <p className="mt-1 text-gray-500 italic">No description</p>
            )
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          {!isEditing && (
            <>
              {onStartTimer && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={onStartTimer}
                >
                  Start Timer
                </button>
              )}
              
              {onMarkComplete && (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                  onClick={onMarkComplete}
                >
                  Mark Complete
                </button>
              )}
              
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
              >
                Delete
              </button>
            </>
          )}
          
          {isEditing && (
            <>
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;