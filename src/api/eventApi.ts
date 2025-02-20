import { EventData } from '../types/event.types';

export const createEvent = async (eventData: EventData) => {
    console.log("Sending event to API:", eventData); // Debugging
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(eventData)
        });
        return await response.json();
    } catch (error) {
        throw new Error('Failed to create event');
    }
}