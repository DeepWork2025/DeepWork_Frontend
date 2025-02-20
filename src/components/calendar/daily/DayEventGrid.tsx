import React from 'react';
import EventBlock from '../../event/EventBlock';
import { EventData } from '../../../types/event.types';

interface DayEventGridProps {
  events: EventData[];
}

const DayEventGrid: React.FC<DayEventGridProps> = ({ events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // Generate 24-hour grid

  return (
    <div className="relative w-full h-[1152px] border-l border-gray-300">
      {/* Hourly Grid */}
      {hours.map(hour => (
        <div 
          key={hour} 
          className="relative border-t border-gray-200 h-[48px] flex items-center text-xs text-gray-500 pl-2"
        >
          {hour}:00
        </div>
      ))}

      {/* Render Events */}
      {events.map((event, index) => {
        if (!event.startTime || !event.endTime) {
          console.warn("Skipping event due to missing time:", event);
          return null;
        }

        return <EventBlock key={index} {...event} />;
      })}
    </div>
  );
};

export default DayEventGrid;