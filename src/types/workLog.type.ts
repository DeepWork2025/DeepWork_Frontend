export interface WorkLogData {
    id: string;
    title: string;
    start: Date | string;
    end: Date | string;
    extendedProps: {
      type: 'deep' | 'shallow';
      category?: string;
      inProgress?: boolean;
      description?: string;
    };
  }