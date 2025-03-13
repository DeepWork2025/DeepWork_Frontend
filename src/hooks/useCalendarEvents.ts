import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { EventData } from '../types/event.types';
import { RootState, AppDispatch } from '../store';
import * as actions from '../store/events/actions';

export const useCalendarEvents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { events, selectedEvent, loading, error } = useSelector((state: RootState) => state.events);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(actions.loadEvents());
  }, [dispatch]);

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end || new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour if no end time

    const eventData: EventData = {
      id: Date.now(),
      title: 'New Event',
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      description: '',
      label: '',
      backgroundColor: '#3788d8'
    };

    dispatch(actions.setSelectedEvent(eventData));
    setIsFormOpen(true);
    selectInfo.view.calendar.unselect(); // Clear the selection after creating the event
  }, [dispatch]);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const eventData: EventData = {
      id: Number(clickInfo.event.id),
      title: clickInfo.event.title,
      startTime: clickInfo.event.start!.toISOString(),
      endTime: clickInfo.event.end!.toISOString(),
      description: clickInfo.event.extendedProps.description || '',
      label: clickInfo.event.extendedProps.label || '',
      backgroundColor: clickInfo.event.backgroundColor || '#3788d8'
    };
    dispatch(actions.setSelectedEvent(eventData));
    setIsFormOpen(true);
  }, [dispatch]);

  const handleEventDrop = useCallback((dropInfo: EventDropArg) => {
    const eventData: EventData = {
      id: Number(dropInfo.event.id),
      title: dropInfo.event.title,
      startTime: dropInfo.event.start!.toISOString(),
      endTime: dropInfo.event.end!.toISOString(),
      description: dropInfo.event.extendedProps.description || '',
      label: dropInfo.event.extendedProps.label || '',
      backgroundColor: dropInfo.event.backgroundColor || '#3788d8'
    };
    dispatch(actions.saveEvent(eventData));
  }, [dispatch]);

  const handleEventResize = useCallback((resizeInfo: EventDropArg) => {
    const eventData: EventData = {
      id: Number(resizeInfo.event.id),
      title: resizeInfo.event.title,
      startTime: resizeInfo.event.start!.toISOString(),
      endTime: resizeInfo.event.end!.toISOString(),
      description: resizeInfo.event.extendedProps.description || '',
      label: resizeInfo.event.extendedProps.label || '',
      backgroundColor: resizeInfo.event.backgroundColor || '#3788d8'
    };
    dispatch(actions.saveEvent(eventData));
  }, [dispatch]);

  const saveEvent = useCallback((eventData: EventData) => {
    dispatch(actions.saveEvent(eventData));
    setIsFormOpen(false);
  }, [dispatch]);

  const deleteEvent = useCallback((eventId: number) => {
    dispatch(actions.deleteEvent(eventId));
    setIsFormOpen(false);
  }, [dispatch]);

  const transformEventsForFullCalendar = useCallback(() => {
    return events.map(event => ({
      id: event.id.toString(),
      title: event.title,
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      backgroundColor: event.backgroundColor,
      extendedProps: {
        description: event.description,
        label: event.label
      }
    }));
  }, [events]);

  return {
    events: transformEventsForFullCalendar(),
    selectedEvent,
    loading,
    error,
    isFormOpen,
    setIsFormOpen,
    handleDateSelect,
    handleEventClick,
    handleEventDrop,
    handleEventResize,
    saveEvent,
    deleteEvent
  };
};