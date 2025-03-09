import React from 'react';
import { EventImpl } from '@fullcalendar/core/internal';

interface WorkLogBlockProps {
  event: EventImpl;
  onClick?: (workLog: EventImpl) => void;
}

const WorkLogBlock: React.FC<WorkLogBlockProps> = ({ event, onClick }) => {
  console.log("Rendering WorkLogBlock:", event); // Debugging line

  // ensure start and end are valid Date objects
  const startTime = event.start? new Date(event.start) : null;
  const endTime = event.end ? new Date(event.end) : null;

  // Format time to be more readable
  const formatTime = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return 'Invalid Time';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

   // Get event duration in minutes
   const getDuration = () => {
    if (!startTime || !endTime || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return ''; // Handle missing or invalid dates
    }

    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    if (durationMinutes < 60) {
      return `${durationMinutes}m`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Determine background color based on event properties.
  const getBgColor = () => {
    // Example: different colors based on extendedProps.type
    if (event.extendedProps?.type === 'deep') return 'bg-blue-500';
    if (event.extendedProps?.type === 'shallow') return 'bg-green-500';
    
    // Default color
    return 'bg-indigo-500';
  };


  return (
    <div className={`p-2 ${getBgColor()} text-white rounded-md shadow-md mb-1 cursor-pointer hover:brightness-95 transition-all`}
    onClick={() => onClick?.(event)}>

    <div className="font-bold truncate">{event.title}</div>
    <div className="text-xs flex justify-between">
      <span>{formatTime(startTime)}</span>
      {endTime && <span>{getDuration()}</span>}
    </div>
    </div>
  );
};

export default WorkLogBlock;