import { useState, useCallback, useEffect } from 'react';
import { EventInput, EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import * as eventService from '../api/eventService.ts';
import {Event} from '@fullcalendar/core';

export const useCalendarEvents = () => {

  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // load events on mount
  useEffect(() => {
    const storedEvents = eventService.getEvents();
    setEvents(storedEvents);
  }, []);

  // save events whenever there's a change
  useEffect(() => {
    eventService.saveEvents(events);
  }, [events]);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const {id, title, start, end, extendedProps, allDay} = clickInfo.event;

    setSelectedEvent({
      id,
      title,
      start: start || new Date(),
      end: end || new Date(),
      allDay,
      description: extendedProps?.description || '',
      backgroundColor: extendedProps?.backgroundColor || '#3788d8'
    });
    setIsFormOpen(true);
  }, []);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    const startDate = new Date(selectInfo.start);
    const endDate = new Date(selectInfo.start);
    endDate.setHours(endDate.getHours() + 1);

    setSelectedEvent({
      title: '',
      start: startDate,
      end: endDate,
      allDay: selectInfo.allDay,
      backgroundColor: '#3788d8'
    });

    setIsFormOpen(true);
    selectInfo.view.calendar.unselect();
  }, []);

  // Save the event and close the form
  const handleSaveEvent = useCallback((eventData: EventInput) => {
    const updatedEvents = eventService.addOrUpdateEvent(eventData);
    setEvents(updatedEvents);  // Update the events state

    // Close the form after saving the event
    setIsFormOpen(false);
    setSelectedEvent(null);
  }, []);

  // Delete an event and close the form
  const handleDeleteEvent = useCallback((eventId: string) => {
    const updatedEvents = eventService.deleteEvent(eventId);
    setEvents(updatedEvents);  // Update the events state

    // Close the form after deleting the event
    setIsFormOpen(false);
    setSelectedEvent(null);
  }, []);

// Handle event drop (dragging an event)
const handleEventDrop = useCallback((eventDropInfo: EventDropArg) => {
  const { event } = eventDropInfo;
  const updatedEvent = {
    ...event,
    start: event.start,
    end: event.end,
  };

    // Update the events in state
    const updatedEvents = eventService.addOrUpdateEvent(updatedEvent);
    setEvents(updatedEvents);

  // Optionally, save updated events to the backend
  eventService.saveEvents(events);  // Save the updated event to the server
}, [events]);

// Handle event resize (resize an event)
const handleEventResize = useCallback((info: { event: Event; el: HTMLElement; view: any }) => {
  const { event } = info;
  const updatedEvent = {
    ...event,
    start: event.start,
    end: event.end,
  };

  // Update the events in state
  const updatedEvents = eventService.addOrUpdateEvent(updatedEvent);
  setEvents(updatedEvents);

  // Optionally, save updated events to the backend
  eventService.saveEvents(events);  // Save the updated event to the server
}, [events]);

  return {
    events,
    selectedEvent,
    isFormOpen,
    setIsFormOpen,
    handleEventClick,
    handleDateSelect,
    handleSaveEvent,
    handleDeleteEvent,
    handleEventDrop,
    handleEventResize
  };
};