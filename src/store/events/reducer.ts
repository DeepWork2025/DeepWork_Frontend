import { createReducer } from '@reduxjs/toolkit';
import { EventsState } from './types';
import * as actions from './actions';

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null
};

export const eventsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actions.setEvents, (state, action) => {
      state.events = action.payload;
    })
    .addCase(actions.setSelectedEvent, (state, action) => {
      state.selectedEvent = action.payload;
    })
    .addCase(actions.setLoading, (state, action) => {
      state.loading = action.payload;
    })
    .addCase(actions.setError, (state, action) => {
      state.error = action.payload;
    });
});