import { configureStore } from '@reduxjs/toolkit';
import { eventsReducer } from './events/reducer';

export const store = configureStore({
  reducer: {
    events: eventsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 