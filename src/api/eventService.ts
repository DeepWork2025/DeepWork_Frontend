// Storage key for localStorage
const STORAGE_KEY = "calendarEvents";

export const getEvents = () => {
  const storedEvents = localStorage.getItem(STORAGE_KEY);
  return storedEvents ? JSON.parse(storedEvents) : [];
};

export const saveEvents = (events) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const deleteEvent = (eventId) => {
  const events = getEvents().filter(event => event.id !== eventId);
  saveEvents(events);
  return events;
};

export const addOrUpdateEvent = (eventData) => {
  let events = getEvents();

  if (eventData.id) {
    // Update existing event
    events = events.map(event => (event.id === eventData.id ? eventData : event));
  } else {
    // Create new event with unique ID
    eventData.id = Date.now().toString();
    events.push(eventData);
  }

  saveEvents(events);
  return events;
};