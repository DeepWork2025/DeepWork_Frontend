import { EventData } from '../../types/event.types';

export interface EventsState {
  events: EventData[];
  selectedEvent: EventData | null;
  loading: boolean;
  error: string | null;
}