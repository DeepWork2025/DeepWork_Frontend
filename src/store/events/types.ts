import { EventData } from '../../types/event.types';

export interface EventsState {
  events: EventData[];
  selectedEvent: EventData | null;
  loading: boolean;
  error: string | null;
}

export type EventsActionTypes = ReturnType<typeof import('./actions').setEvents> |
  ReturnType<typeof import('./actions').setSelectedEvent> |
  ReturnType<typeof import('./actions').setLoading> |
  ReturnType<typeof import('./actions').setError>; 