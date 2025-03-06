import { useState, useCallback, useEffect } from 'react';
import { EventInput, EventClickArg, DateSelectArg } from '@fullcalendar/core';

// Storage key for localStorage
const STORAGE_KEY = 'calendar_events';

// Helper functions to replace API calls
const getEventsFromStorage = (): EventInput[] => {
  const storedEvents = localStorage.getItem(STORAGE_KEY);
  return storedEvents ? JSON.parse(storedEvents) : [];
};

const saveEventsToStorage = (events: EventInput[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

   // Load events from localStorage on initial mount
   useEffect(() => {
    const loadedEvents = getEventsFromStorage();
    setEvents(loadedEvents);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    // Extract the event data we need
    const { id, title, start, end, extendedProps, allDay } = clickInfo.event;

    // Format the event for the form
    const eventForForm = {
      id,
      title,
      start,
      end,
      allDay,
      description: extendedProps?.description || '',
      backgroundColor: extendedProps?.backgroundColor || '#3788d8'
    };

    setSelectedEvent(eventForForm);
    setIsFormOpen(true);
  }, []);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    // For new events, use the selected date and time
    const startDate = new Date(selectInfo.start);

    // Calculate end date (default to 1 hour after start)
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
    selectInfo.view.calendar.unselect(); // clear date selection
  }, []);

  const handleEventDrop = useCallback((dropInfo: any) => {
    const { id, start, end, allDay, title, extendedProps } = dropInfo.event;

    const updatedEvent = {
      id,
      title,
      start,
      end,
      allDay,
      ...extendedProps
    };

    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  }, []);

  const handleEventResize = useCallback((resizeInfo: any) => {
    const { id, start, end, allDay, title, extendedProps } = resizeInfo.event;
    
    const updatedEvent = {
      id,
      title,
      start,
      end,
      allDay,
      ...extendedProps
    };
    
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  }, []);

  const handleSaveEvent = useCallback((eventData: EventInput) => {
    if (eventData.id) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === eventData.id ? eventData : event
      ));
    } else {
      // Create new event with unique ID
      const newEvent = {
        ...eventData,
        id: Date.now().toString(), // Simple unique ID generation
      };
      setEvents(prev => [...prev, newEvent]);
    }

    setIsFormOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setIsFormOpen(false);
    setSelectedEvent(null);
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