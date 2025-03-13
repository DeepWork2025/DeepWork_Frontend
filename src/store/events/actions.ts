import { EventData } from '../../types/event.types';
import * as eventService from '../../api/eventService';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { EventsState } from './types';

export const setEvents = createAction<EventData[]>('events/setEvents');
export const setSelectedEvent = createAction<EventData | null>('events/setSelectedEvent');
export const setLoading = createAction<boolean>('events/setLoading');
export const setError = createAction<string | null>('events/setError');

export const saveEvent = createAsyncThunk(
  'events/saveEvent',
  async (event: EventData, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const updatedEvents = eventService.addOrUpdateEvent(event);
      dispatch(setEvents(updatedEvents));
      dispatch(setSelectedEvent(null));
      return updatedEvents;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to save event'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (eventId: number, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const updatedEvents = eventService.deleteEvent(eventId);
      dispatch(setEvents(updatedEvents));
      dispatch(setSelectedEvent(null));
      return updatedEvents;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to delete event'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const loadEvents = createAsyncThunk(
  'events/loadEvents',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const events = eventService.getEvents();
      dispatch(setEvents(events));
      return events;
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to load events'));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);