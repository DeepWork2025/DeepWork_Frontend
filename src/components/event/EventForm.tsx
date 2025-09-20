import React, { useState, useEffect } from 'react';
import { EventData } from '../../types/event.types';

interface EventFormProps {
  event: Partial<EventData>;
  onSave: (eventData: EventData) => void;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onClose }) => {
  const today = new Date().toISOString().substring(0, 10); // get current date in YYYY-MM-DD

  const [formData, setFormData] = useState<Partial<EventData>>({
    id: event.id,
    title: event.title || '',
    startTime: event.startTime || `${today}T09:00:00`,
    endTime: event.endTime || `${today}T10:00:00`,
    description: event.description || '',
    label: event.label || '',
    backgroundColor: event.backgroundColor || '#7CD4FD',
    allDay: event.allDay || false,
    tasks: event.tasks || []
  });

  // Ensure form updates when `event` changes
  useEffect(() => {
    setFormData({
      id: event.id,
      title: event.title || '',
      startTime: event.startTime || `${today}T09:00:00`,
      endTime: event.endTime || `${today}T10:00:00`,
      description: event.description || '',
      label: event.label || '',
      backgroundColor: event.backgroundColor || '#7CD4FD',
      allDay: event.allDay || false,
      tasks: event.tasks || []
    });
  }, [event, today]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      backgroundColor: color
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startTime || !formData.endTime) {
      return;
    }

    const eventToSave: EventData = {
      id: formData.id || Date.now().toString(), // Generate new ID if not provided
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      label: formData.label,
      backgroundColor: formData.backgroundColor,
      allDay: formData.allDay,
      tasks: formData.tasks
    };

    onSave(eventToSave);
  };


  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{formData.id ? 'Edit Event' : 'Create Event'}</h2>
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-control">
            <label className="label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Start Time */}
          <div className="form-control">
            <label className="label">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime?.slice(0, 16)}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* End Time */}
          <div className="form-control">
            <label className="label">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime?.slice(0, 16)}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Event Type */}
          {/* <div className="form-control">
            <label className="label">Event Type</label>
            <select
              name="label"
              value={formData.label || ''}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="">None</option>
              <option value="deep">Deep Work</option>
            </select>
          </div> */}

          {/* Description */}
          <div className="form-control">
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* All Day Event */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">All Day Event</span>
              <input
                type="checkbox"
                name="allDay"
                checked={formData.allDay}
                onChange={handleChange}
                className="checkbox"
              />
            </label>
          </div>

          {/* Color Picker */}
          <div className="form-control">
            <label className="label">Background Color</label>
            <div className="flex items-center space-x-2">
              {[
                { color: '#A9EFC5', name: 'Green' },
                { color: '#D6BBFB', name: 'Purple' },
                { color: '#7CD4FD', name: 'Blue' },
                { color: '#FEA3B4', name: 'Pink' },
                { color: '#FEB273', name: 'Orange' }
              ].map(({ color, name }) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-10 h-10 rounded border-2 transition-all duration-200 hover:scale-110 ${
                    formData.backgroundColor === color 
                      ? 'border-gray-800 ring-2 ring-gray-400' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  title={name}
                  aria-label={`Select ${name} color`}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="card-actions justify-end mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;