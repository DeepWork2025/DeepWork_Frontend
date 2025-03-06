const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let events = [];

const isValidDate = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());  // Returns true if the date is valid
};

// Add a route for "/"
app.get('/', (req, res) => {
  res.send('Mock API is running');
})

// GET all events
app.get('/events', (req, res) => {
  const fullCalendarEvents = events.map(event => {

    return {
      id: event.id, // FullCalendar ID
      title: event.title, // Event title
      start: event.startTime, // Start time in ISO string format
      end: event.endTime, // End time in ISO string format
      startStr: new Date(event.startTime).toISOString(), // Start time as string in ISO format
      endStr: new Date(event.endTime).toISOString(),// End time as string in ISO format
      description: event.description || "", // Event description
      backgroundColor: event.backgroundColor, // Optional background color
      extendedProps: { label: event.label } // Custom properties
    };
  }).filter(event => event !== null); // remove any null values

  res.json(fullCalendarEvents);
});

// Handle creating new events
app.post('/events', (req, res) => {
  const { title, startTime, endTime, description, label } = req.body;

  // Validate time format (basic example)
  if (!Date.parse(startTime) || !Date.parse(endTime)) {
    return res.status(400).send('Invalid date format');
  }

  const newEvent = {
    id: Date.now(),  // Use timestamp for a unique ID
    title,
    startTime,       // Use ISO string for startTime
    endTime,         // Use ISO string for endTime
    description,
    label,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

// ✅Handle updating an event
app.put('/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = events.findIndex(event => event.id === eventId);
  if (eventIndex === -1) return res.status(404).send("Event not found");

  events[eventIndex] = { ...events[eventIndex], ...req.body };
  res.json(events[eventIndex]);
});

// ✅ Fix: Handle deleting an event
app.delete('/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  events = events.filter(event => event.id !== eventId);
  res.status(204).send();
});


// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
});
