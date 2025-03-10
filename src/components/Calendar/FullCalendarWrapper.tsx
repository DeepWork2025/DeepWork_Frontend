import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import EventBlock from '../event/EventBlock';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';

const FullCalendarWrapper = () => {
  const { 
    events, 
    handleEventClick,
    handleDateSelect,
    handleEventDrop,
    handleEventResize,
  } = useCalendarEvents();

  return (
    <div className="h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        headerToolbar={false}
        events={events}
        selectable={true}
        editable={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        expandRows={true}
        nowIndicator={true}
        allDaySlot={false}
        eventContent={(eventInfo)=> <EventBlock event={eventInfo.event} />}// Custom event renderer
      />
    </div>
  );
};

export default FullCalendarWrapper;