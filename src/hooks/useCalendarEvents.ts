import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
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

    dispatch(actions.saveEvent(eventData));
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

  const handleEventResize = useCallback((resizeInfo: EventResizeDoneArg) => {
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
    console.log('Saving event:', eventData);
    dispatch(actions.saveEvent(eventData));
    setIsFormOpen(false);
  }, [dispatch]);

  const deleteEvent = useCallback((eventId: number) => {
    dispatch(actions.deleteEvent(eventId));
    setIsFormOpen(false);
  }, [dispatch]);

  const transformEventsForFullCalendar = useCallback(() => {
    // console.log('Raw events before transformation:', events);
    const transformedEvents = events.map(event => ({
      id: event.id.toString(),
      title: event.title || 'Untitled Event',
      start: new Date(event.startTime),
      end: new Date(event.endTime),
      backgroundColor: event.backgroundColor || '#3788d8',
      borderColor: event.backgroundColor || '#3788d8',
      textColor: '#ffffff',
      extendedProps: {
        description: event.description || '',
        label: event.label || 'default',
        type: event.label || 'default',
        category: event.label || 'default',
        duration: '1:30 h',
        isStopped: false
      }
    }));
    // console.log('Transformed events:', transformedEvents);
    return transformedEvents;
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