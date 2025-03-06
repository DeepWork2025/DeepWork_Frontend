import React, { useState, useEffect } from 'react';
import { EventInput } from '@fullcalendar/core';

interface EventFormProps {
  event: Partial<EventInput>;
  onSave: (eventData: EventInput) => void;
  onDelete: (eventId: string) => void;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onDelete, onClose }) => {
  const today = new Date().toISOString().substring(0,10); // get current date in YYYY-MM-DD

  const [formData, setFormData] = useState({
    id: event.id || '',
    title: event.title || '',
    startTime: event.start ? formatTimeForInput(event.start) : '09:00',
    endTime: event.end ? formatTimeForInput(event.end) : '10:00',
    description: event.extendedProps?.description || '',
    backgroundColor: event.backgroundColor || '#3788d8'
  });

  // Ensure form updates when `event` changes
  useEffect(() => {
    setFormData({
      id: event.id || '',
      title: event.title || '',
      startTime: event.start ? formatTimeForInput(event.start) : '09:00',
      endTime: event.end ? formatTimeForInput(event.end) : '10:00',
      description: event.extendedProps?.description || '',
      backgroundColor: event.backgroundColor || '#3788d8'
    });
  }, [event]);

  function formatTimeForInput(dateValue: string | Date | undefined) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    return date.toTimeString().slice(0, 5);
  }

  // combine date and time data to ISO format
  function combineDateTime(timeStr: string) {
    const todayDate = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), hours, minutes).toISOString();
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = combineDateTime(formData.startTime);
    const endDateTime = combineDateTime(formData.endTime);

    const eventToSave: EventInput = {
      id: formData.id,
      title: formData.title,
      start: startDateTime,
      end: endDateTime,
      extendedProps: { description: formData.description },
      backgroundColor: formData.backgroundColor
    };

    onSave(eventToSave);
  };

  // Handle event deletion
  const handleDelete = () => {
    if (formData.id) {
      onDelete(String(formData.id)); // Ensure ID is a string
    }
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
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* End Time */}
          <div className="form-control">
            <label className="label">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Color Picker */}
          <div className="form-control">
            <label className="label">Background Color</label>
            <input
              type="color"
              name="backgroundColor"
              value={formData.backgroundColor}
              onChange={handleChange}
              className="input input-bordered w-full h-10"
            />
          </div>

          {/* Buttons */}
          <div className="card-actions justify-end mt-6">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            {formData.id && (
              <button type="button" className="btn btn-error" onClick={handleDelete}>
                Delete
              </button>
            )}
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