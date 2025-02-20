// components/EventForm.tsx
import { EventFormProps } from '../../types/event.types';
import { useEventForm } from '../../hooks/useEventForm';

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onClose,
  initialData,
  submitLabel = 'Create Event'
}) => {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    validateForm,
    setIsSubmitting,
    setErrors
  } = useEventForm(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        onClose();
      } catch(error) {
        setErrors({submit: 'Failed to submit event'});
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{submitLabel}</h2>
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
      name="startTime"
      value={formData.startTime}
      onChange={handleChange}
      className="input input-bordered w-full"
      required
    />
  </div>

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

  <div className="card-actions justify-end mt-6">
    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>
      Cancel
    </button>
    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : submitLabel}
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default EventForm;