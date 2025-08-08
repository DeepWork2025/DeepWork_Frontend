import { configureStore } from '@reduxjs/toolkit';
import { eventsReducer } from './event/eventSlice';
import workLogReducer from './worklog/worklogSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    workLog: workLogReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;