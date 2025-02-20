import { useState } from 'react';
import { EventData } from '../types/event.types';
import { validateEventData } from '../utils/eventValidation';

export const useEventForm = (initialData?: Partial<EventData>) => {
  const [formData, setFormData] = useState<EventData>({
    title: initialData?.title || '',
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '10:00',
    description: initialData?.description || '',
    label: initialData?.label || ''
  });

  const [errors, setErrors] = useState<Record<string,string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    if(errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  console.log(`Field changed: ${name} = ${value}`); // Debugging

  const validateForm = () => {
    const newErrors = validateEventData(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validateForm,
    setErrors
  };
};