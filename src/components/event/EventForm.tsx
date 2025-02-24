import React, {useState, useEffect} from 'react';
import {EventInput} from '@fullcalendar/core';

interface EventFormProps {
    event: Partial<EventInput>;
    onSave: (eventData: any) => void;
    onDelete: (eventId: string) => void;
    onClose: () => void;
  }

  const EventForm: React.FC<EventFormProps> = ({
    event,
    onSave,
    onDelete,
    onClose
  }) => {
    const [formData, setFormData] = useState({
      id: '',
      title: '',
      start: '',
      end: '',
      description: '',
      backgroundColor: '#3788d8'
    });
  
  // Extracts only the time from a full datetime string
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // 12-hour format
  };

    useEffect(() => {
      if (event) {
        setFormData({
          id: event.id || '',
          title: event.title || '',
          start: formatTime(event.start?.toString()) || '',
          end: formatTime(event.end?.toString()) || '',
          description: event.extendedProps?.description || '',
          backgroundColor: event.backgroundColor || '#3788d8'
        });
      }
    }, [event]);

  // Form handles
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (formData.id && confirm('Are you sure you want to delete this event?')) {
      onDelete(formData.id);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
        {formData.id ? 'Edit Event' : 'Create Event'}
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
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

  <div className="form-control">
    <label className="label">Start Time</label>
    <input 
      type="time"
      name="start"
      value={formData.start ? formData.start.substring(0,5): ""}
      onChange={handleChange}
      className="input input-bordered w-full"
      required
    />
  </div>

  <div className="form-control">
    <label className="label">End Time</label>
    <input 
      type="time"
      name="end"
      value={formData.end ? formData.end.substring(0, 5) : ""}
      onChange={handleChange}
      className="input input-bordered w-full"
      required
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