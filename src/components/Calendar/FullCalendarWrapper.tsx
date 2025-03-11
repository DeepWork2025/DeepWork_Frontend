import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { EventClickArg, DateSelectArg, EventDropArg, EventResizeArg, EventContentArg  } from '@fullcalendar/core';

// Format time for better readability
const formatTime = (date: Date | null) => {
  if (!date || isNaN(date.getTime())) return 'Invalid Time';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

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

// Determine background color based on event type
const getBgColor = (event: any) => {
  if (event.extendedProps?.type === 'deep') return 'bg-blue-500';
  if (event.extendedProps?.type === 'shallow') return 'bg-green-500';
  return 'bg-indigo-500'; // Default color
};

// Custom event rendering function
const renderEventContent = (eventInfo: EventContentArg) => {
  const { event, timeText } = eventInfo;
  const startTime = event.start ? new Date(event.start) : null;
  const endTime = event.end ? new Date(event.end) : null;

  return (
    <div className={`p-2 text-white rounded-md mb-1 cursor-pointer hover:brightness-95 transition-all ${getBgColor(event)}`}>
      <div className="font-bold truncate">{event.title}</div>
      <div className="text-xs flex justify-between">
        <span>{timeText}</span>
        {endTime && <span>{getDuration(startTime, endTime)}</span>}
      </div>
    </div>
  );
};

// Dynamic class names for event styling
const getEventClassNames = ({ event }: { event: any }) => {
  return ['rounded-md', 'hover:brightness-95', getBgColor(event)];
};

const FullCalendarWrapper = () => {
  const {
    events,
    handleEventClick,
    handleDateSelect,
    handleDeleteEvent,
    handleEventDrop,
    handleEventResize,
    handleSaveEvent
  } = useCalendarEvents();

  return (
    <div className="h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        headerToolbar={false}
        dayHeaders={false}
        events={events}
        selectable={true}
        selectMirror={true}
        editable={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        expandRows={true}
        nowIndicator={true}
        allDaySlot={false}
        eventContent={renderEventContent}// Using FullCalendar eventContent Hook.
        eventClassNames={getEventClassNames} // custom Tailwind css
      />
    </div>
  );
};

export default FullCalendarWrapper;