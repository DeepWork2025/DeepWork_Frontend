import { createEvent } from '../../api/eventApi';
import EventForm from './EventForm'
import { EventData } from '../../types/event.types'

const EventCreator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const handleSubmit = async (formData: EventData) => {
      await createEvent(formData);
      onClose();  // close form after submission.
    };

    // Hardcoded test event data
    const testEvent:EventData = {
        title: 'Test Event',
        startTime: '14:00',
        endTime: '15:00',
        description: 'This is a test event',
        label: 'meeting'
    };

    return (
      <EventForm
        onSubmit={handleSubmit}
        onClose={onClose}
        submitLabel="Create Event"
        initialData={testEvent}
      />
    );
  };

  export default EventCreator;