export interface WorkLogData {
    id: string;
    title: string;
    start: string;
    end: string;
    extendedProps: {
      type: 'deep' | 'shallow';
      category?: string;
      inProgress?: boolean;
      isPaused?: boolean;
      description?: string;
      autoStopped?: boolean; // 新增：标记是否自动停止
      stoppedReason?: string; // 新增：停止原因
    };
  }