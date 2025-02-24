export interface EventData {
    id?: string;            // Unique identifier
    title: string;          // Event title
    startTime: string;      // Format: "HH:mm"
    endTime: string;        // Format: "HH:mm"
    description?: string;   // Optional description
    label: string;          // Category/type of event
    }