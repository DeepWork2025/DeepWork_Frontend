import { useState, useCallback } from 'react';
import { EventInput, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { createEvent, updateEvent, deleteEvent } from '../api/eventService';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Debugging - Check if events are updating correctly

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event);
    setIsFormOpen(true);
  }, []);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    setSelectedEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    });
    setIsFormOpen(true);
    selectInfo.view.calendar.unselect(); // clear date selection
  }, []);

  const handleEventDrop = useCallback(async (dropInfo: any) => {
    try {
      const updatedEvent = await updateEvent({
        id: dropInfo.event.id,
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr
      });
      
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Failed to update event', error);
      dropInfo.revert();
    }
  }, []);

  const handleEventResize = useCallback(async (resizeInfo: any) => {
    try {
      const updatedEvent = await updateEvent({
        id: resizeInfo.event.id,
        start: resizeInfo.event.startStr,
        end: resizeInfo.event.endStr
      });
      
      setEvents(prev => prev.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Failed to update event', error);
      resizeInfo.revert();
    }
  }, []);

  const handleSaveEvent = useCallback(async (eventData: any) => {
    try {
      if (eventData.id) {
        // Update existing event
        const updatedEvent = await updateEvent(eventData);
        setEvents(prev => prev.map(event => 
          event.id === updatedEvent.id ? updatedEvent : event
        ));
      } else {
        // Create new event
        const newEvent = await createEvent(eventData);
        setEvents(prev => [...prev, newEvent]);
      }
      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to save event', error);
    }
  }, []);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to delete event', error);
    }
  }, []);

  return {
    events,
    selectedEvent,
    isFormOpen,
    setIsFormOpen,
    handleEventClick,
    handleDateSelect,
    handleEventDrop,
    handleEventResize,
    handleSaveEvent,
    handleDeleteEvent
  };
};