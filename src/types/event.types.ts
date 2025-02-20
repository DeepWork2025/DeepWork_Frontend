// 假设仅有day view的事件，不包含日期
export interface EventData {
  id?: string;            // Unique identifier
  title: string;          // Event title
  startTime: string;      // Format: "HH:mm"
  endTime: string;        // Format: "HH:mm"
  description?: string;   // Optional description
  label: string;          // Category/type of event
  }

  export interface EventFormProps {
    onSubmit: (formData: EventData) => Promise<void>;
    onClose: () => void;
    initialData?: Partial<EventData>;
    submitLabel?: string;
  }

  export interface EventBlockProps {
    title: string;
    startTime: string;
    endTime: string;
    label: string;
    description?: string;
    isOverlapping?: boolean;
  }