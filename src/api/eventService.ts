import { EventData } from "../types/event.types";

// Storage key for localStorage
const STORAGE_KEY = "calendarEvents";

interface EventDataWithStartEnd extends Partial<EventData> {
  start?: Date | string;
  end?: Date | string;
}

// Helper function to ensure dates are properly formatted
const processDates = (event: EventDataWithStartEnd) => {
  // Create a new object to avoid modifying the original
  const processedEvent = { ...event };
  
  // Helper function to safely convert to ISO string
  const toISOString = (date: unknown): string => {
    if (!date) return new Date().toISOString();
    if (typeof date === 'string') return new Date(date).toISOString();
    if (date instanceof Date) return date.toISOString();
    return new Date().toISOString();
  };
  
  // Always ensure startTime and endTime are set
  processedEvent.startTime = processedEvent.startTime || toISOString(processedEvent.start);
  processedEvent.endTime = processedEvent.endTime || toISOString(processedEvent.end);
  
  // Clean up start/end if they exist
  delete processedEvent.start;
  delete processedEvent.end;
  
  return processedEvent;
};

// Get event by id
export const getEventById = (id: string): EventData | null => {
  const eventsJson = localStorage.getItem(STORAGE_KEY);
  if (eventsJson) {
    const allEvents: EventData[] = JSON.parse(eventsJson);
    const foundEvent = allEvents.find(e => e.id === parseInt(id));
    // Return a new object to avoid mutation
    return foundEvent ? { ...foundEvent } : null;
  }
  return null;
};

export const getEvents = (): EventData[] => {
  try {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (!storedEvents) return [];
    
    const parsedEvents = JSON.parse(storedEvents);
    
    // Create new array and objects to avoid mutation
    return parsedEvents.map((event: Partial<EventData>) => ({
      id: event.id,
      title: event.title || '',
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description || '',
      label: event.label || 'default',
      backgroundColor: event.backgroundColor || '#3788d8'
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const saveEvents = (events: EventData[]) => {
  try {
    // Create new array and objects to avoid mutation
    const processedEvents = events.map(event => ({
      id: event.id,
      title: event.title || '',
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description || '',
      label: event.label || 'default',
      backgroundColor: event.backgroundColor || '#3788d8'
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processedEvents));
  } catch (error) {
    console.error("Error saving events:", error);
  }
};

export const deleteEvent = (eventId: number) => {
  const events = getEvents();
  // Create new array to avoid mutation
  const updatedEvents = events.filter(event => event.id !== eventId);
  saveEvents(updatedEvents);
  return updatedEvents;
};

export const addOrUpdateEvent = (eventData: EventDataWithStartEnd) => {
  const events = getEvents();
  
  // Process dates in the new/updated event
  const processedEventData = processDates(eventData);

  // Create new array to avoid mutation
  let updatedEvents: EventData[];

  if (processedEventData.id) {
    // Update existing event
    updatedEvents = events.map(event => 
      event.id === processedEventData.id ? {
        ...event,
        ...processedEventData,
        title: processedEventData.title || '',
        description: processedEventData.description || '',
        label: processedEventData.label || 'default',
        backgroundColor: processedEventData.backgroundColor || '#3788d8'
      } : { ...event }
    );
  } else {
    // Create new event with unique ID
    const newEvent: EventData = {
      id: Date.now(),
      title: processedEventData.title || 'New Event',
      startTime: processedEventData.startTime || new Date().toISOString(),
      endTime: processedEventData.endTime || new Date(Date.now() + 3600000).toISOString(),
      description: processedEventData.description || '',
      label: processedEventData.label || 'default',
      backgroundColor: processedEventData.backgroundColor || '#3788d8'
    };
    // Create new array with spread operator
    updatedEvents = [...events, newEvent];
  }

  saveEvents(updatedEvents);
  return updatedEvents;
};