import FullCalendarWrapper from './FullCalendarWrapper';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import EventForm from '../event/EventForm';
import EventBlock from '../event/EventBlock';

const DayCalendar = () => {
  const {
    events,
    selectedEvent,
    isFormOpen,
    setIsFormOpen,
    handleEventClick,
    handleSaveEvent,
    handleDeleteEvent
  } = useCalendarEvents();

  // Function to open the form for a new event
  const handleAddEvent = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 bg-white shadow">
        <h1 className="text-2xl font-bold">Calendar</h1>
      </header>

      <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
        >
          + Add Event
        </button>

      <main className="flex-grow">
        <FullCalendarWrapper
        events={events}
        onEventClick={handleEventClick} />
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EventForm
            event={selectedEvent || {}}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setIsFormOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DayCalendar;