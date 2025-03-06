import React from 'react';
import { EventImpl } from '@fullcalendar/core/internal';

interface EventBlockProps {
  event: EventImpl;
}

const EventBlock: React.FC<EventBlockProps> = ({ event }) => {
  return (
    <div className="p-1 bg-blue-500 text-white rounded-md shadow-md">
      <strong>{event.title}</strong>
      <p className="text-xs">{event.startStr} - {event.endStr}</p>
    </div>
  );
};

export default EventBlock;
