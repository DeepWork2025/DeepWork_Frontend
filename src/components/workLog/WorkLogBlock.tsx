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
   // 手动计算worklog显示的大小
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

  

  // Get background color from event, default to blue if not set
  const getBackgroundColor = () => {
    const baseColor = event.backgroundColor || '#7CD4FD';
    return baseColor;
  };

  return (
    <div 
      className="p-2 text-white rounded-md shadow-md mb-1 cursor-pointer hover:brightness-95 transition-all"
      style={{
        backgroundColor: getBackgroundColor()
      }}
      onClick={() => onClick?.(event)}
    >
      <div className="font-bold truncate">{event.title}</div>
      <div className="text-xs flex justify-between">
        <span>{formatTime(startTime)}</span>
        {endTime && <span>{getDuration()}</span>}
      </div>
    </div>
  );
};

export default WorkLogBlock;