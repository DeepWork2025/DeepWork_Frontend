import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { EventContentArg } from '@fullcalendar/core';
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
}

const EventDetailModal: React.FC<EventModalProps> = ({ event, onClose, onDelete }) => {
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const duration = getDuration(startTime, endTime);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
        <div className="mb-4">
          <p><span className="font-medium">Start:</span> {startTime.toLocaleString()}</p>
          <p><span className="font-medium">End:</span> {endTime.toLocaleString()}</p>
          <p><span className="font-medium">Duration:</span> {duration}</p>
          <p><span className="font-medium">Type:</span> {event.label}</p>
          {event.description && (
            <div>
              <p className="font-medium">Description:</p>
              <p className="mt-1">{event.description}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const FullCalendarWrapper = () => {
  const {
    events,
    handleEventClick,
    handleDateSelect,
    saveEvent,
    deleteEvent,
    handleEventDrop,
    handleEventResize,
    isFormOpen,
    setIsFormOpen,
    selectedEvent,
    setSelectedEvent,
    isLoading 
  } = useCalendarEvents();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleFormChange = (field: keyof EventData, value: string) => {
    if (selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        [field]: value
      });
    }
  };

  return (
    <div>
      <div className="flex">
        {isLoading ? (
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
          />
        )}
      </div>
      {isDetailModalOpen && selectedEvent && (
        <EventDetailModal 
          event={selectedEvent}
          onClose={() => setIsDetailModalOpen(false)}
          onDelete={deleteEvent}
        />
      )}
      {isFormOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">
              {selectedEvent.id ? 'Edit Event' : 'New Event'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveEvent(selectedEvent);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={selectedEvent.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md mr-2"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullCalendarWrapper;