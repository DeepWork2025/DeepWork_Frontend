export interface EventData {
    id: number;            // Unique identifier
    title: string;          // Event title
    startTime: string;      // ISO 8601 format: "2025-02-25T10:00:00"
    endTime: string;        // ISO 8601 format: "2025-02-25T10:00:00"
    description?: string;   // Optional description
    label?: string;         // Category/type of event
    backgroundColor?: string;
    allDay?: boolean;
}