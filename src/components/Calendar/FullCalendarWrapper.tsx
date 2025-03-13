import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import EventDetailModal from '../event/EventDetailModal';
import { CustomEventBlock } from '../event/CustomEventBlock';

interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks: Subtask[];
  isExpanded: boolean;
}

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

  useEffect(() => {
    // Initialize Draggable for all task elements
    const taskContainer = document.querySelector('.task-list');
    if (taskContainer) {
      new Draggable(taskContainer, {
        itemSelector: '[data-event]',
        eventData: function(eventEl) {
          const eventData = eventEl.getAttribute('data-event');
          return eventData ? JSON.parse(eventData) : null;
        }
      });
    }

    // Cleanup function
    return () => {
      // The Draggable instance will be automatically destroyed when the component unmounts
    };
  }, []);

  const handleDrop = (info: any) => {
    console.log('Drop event received:', info);
    console.log('Event data:', info.event);
    
    try {
      if (!info.event) {
        console.error('No event data found');
        return;
      }

      const eventData = info.event;
      console.log('Creating new event:', eventData);
      saveEvent(eventData);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

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
            droppable={true}
            drop={handleDrop}
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