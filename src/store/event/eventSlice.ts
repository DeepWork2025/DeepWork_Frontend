import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EventsState } from './types';
import { EventData } from '../../types/event.types';
import * as eventService from '../../api/eventService';
import { createAction } from '@reduxjs/toolkit';

// initial state
const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null
};

// Create slice
const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers:{
        setEvents: (state, action) => {
            state.events = action.payload;
        },
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});



const setEvents = createAction<EventData[]>('events/setEvents');
const setSelectedEvent = createAction<EventData | null>('events/setSelectedEvent');
const setLoading = createAction<boolean>('events/setLoading');
const setError = createAction<string | null>('events/setError');

const saveEvent = createAsyncThunk(
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

const deleteEvent = createAsyncThunk(
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

const loadEvents = createAsyncThunk(
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


export const actions = {
  setEvents,
  setSelectedEvent,
  setLoading,
  setError,
  saveEvent,
  deleteEvent,
  loadEvents
};

export const eventsReducer = eventSlice.reducer;