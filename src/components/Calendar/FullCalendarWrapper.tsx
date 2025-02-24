import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import EventBlock from '../event/EventBlock';
// import { EventClickArg, DateSelectArg } from '@fullcalendar/core';

const FullCalendarWrapper = () => {
  const { 
    events, 
    handleEventClick,
    handleDateSelect,
    handleEventDrop,
    handleEventResize
  } = useCalendarEvents();

  return (
    <div className="h-full">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridDay"
        headerToolbar={false} // We'll use a custom toolbar
        events={events}
        selectable={true}
        editable={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="100%"
        eventContent={(eventInfo)=> <EventBlock event={eventInfo.event} />}// Custom event renderer
      />
    </div>
  );
};

export default FullCalendarWrapper;