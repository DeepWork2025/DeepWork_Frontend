import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import EventDetailModal from '../event/EventDetailModal';
import { CustomEventBlock } from '../event/CustomEventBlock';

const FullCalendarWrapper = () => {
  const {
    events,
    handleEventClick,
    handleDateSelect,
    deleteEvent,
    handleEventDrop,
    handleEventResize,
    selectedEvent,
    loading,
    saveEvent
  } = useCalendarEvents();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  return (
    <div className="h-full min-h-[600px]">
      <div className="h-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={false}
            dayHeaders={false}
            events={events}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:15:00"
            slotLabelInterval="01:00"
            height="auto"
            contentHeight="auto"
            selectable={true}
            selectMirror={true}
            editable={true}
            select={handleDateSelect}
            eventClick={(e) => {
              handleEventClick(e);
              setIsDetailModalOpen(true);
            }}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            expandRows={true}
            nowIndicator={true}
            allDaySlot={false}
            eventContent={(arg) => <CustomEventBlock event={arg.event} timeText={arg.timeText} />}
            viewDidMount={(view) => {
              // Ensure the time grid has a minimum height
              const timeGrid = view.el.querySelector('.fc-timegrid-body') as HTMLElement;
              if (timeGrid) {
                timeGrid.style.minHeight = '600px';
              }
            }}
          />
        )}
      </div>
      {isDetailModalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setIsDetailModalOpen(false)}
          onDelete={deleteEvent}
          onUpdate={saveEvent}
        />
      )}
    </div>
  );
};

export default FullCalendarWrapper;