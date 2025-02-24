const API_URL = 'https://your-api.com/events'; // Replace with actual API endpoint

export const fetchEvents = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!response.ok) throw new Error('Failed to create event');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_URL}/${eventData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!response.ok) throw new Error('Failed to update event');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`${API_URL}/${eventId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};