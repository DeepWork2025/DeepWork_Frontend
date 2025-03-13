import { WorkLogData } from "../types/workLog.type";

export const STORAGE_KEYS = {
    WORK_LOGS: 'workLogs',
    ACTIVE_LOG: 'activeWorkLog',
    CATEGORIES: 'workLogCategories',
    TOTAL_WORK_TIME: 'totalWorkTime'
  };

  // Get work log by id
  export const getWorkLogById = (id: string): WorkLogData | null => {
    const logs = localStorage.getItem(STORAGE_KEYS.WORK_LOGS);
    if (logs){
        const allLogs: WorkLogData[] = JSON.parse(logs);
        const foundLog = allLogs.find(log => log.id === id);
        return foundLog || null;
    }

  }

  // Get all work logs
  export const getAllWorkLogs = (): WorkLogData[] => {
    const logs = localStorage.getItem(STORAGE_KEYS.WORK_LOGS);
    return logs ? JSON.parse(logs) : [];
  };

  // Get logs for a specific date
  export const getWorkLogsForDate = (date: Date): WorkLogData[] => {
    const allLogs = getAllWorkLogs();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return allLogs.filter(log => {
      const logDate = new Date(log.start);
      return logDate >= startOfDay && logDate <= endOfDay;
    });
  };

  // Save a new work log
  export const saveWorkLog = (log: WorkLogData): void => {
    const allLogs = getAllWorkLogs();
    
    // Check if the log already exists
    const existingLogIndex = allLogs.findIndex(l => l.id === log.id);
    
    if (existingLogIndex >= 0) {
      // Update existing log
      allLogs[existingLogIndex] = log;
    } else {
      // Add new log
      allLogs.push(log);
    }

    localStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(allLogs));
  };

  // Delete a work log
  export const deleteWorkLog = (id: string): void => {
    const allLogs = getAllWorkLogs();
    const updatedLogs = allLogs.filter(log => log.id !== id);
    localStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(updatedLogs));
  };
  
  // Get active log (if timer is running)
  export const getActiveLog = (): WorkLogData | null => {
    const activeLog = localStorage.getItem(STORAGE_KEYS.ACTIVE_LOG);
    return activeLog ? JSON.parse(activeLog) : null;
  };
  
  // Save active log
  export const saveActiveLog = (log: WorkLogData): void => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_LOG, JSON.stringify(log));
  };
  
  // Clear active log
  export const clearActiveLog = (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_LOG);
  };
  
  // Get categories
  export const getCategories = (): string[] => {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : [];
  };
  
  // Save categories
  export const saveCategories = (categories: string[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  };
  
  // Get work summary for a date range
  export const getWorkSummary = (startDate: Date, endDate: Date) => {
    const allLogs = getAllWorkLogs();
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const logsInRange = allLogs.filter(log => {
      const logStart = new Date(log.start);
      return logStart >= start && logStart <= end;
    });
  
    // Calculate total duration in milliseconds
    const totalDuration = logsInRange.reduce((total, log) => {
      const logStart = new Date(log.start).getTime();
      const logEnd = new Date(log.end).getTime();
      return total + (logEnd - logStart);
    }, 0);
  
    // Calculate duration by category
    const categoryDurations: Record<string, number> = {};
    logsInRange.forEach(log => {
      const category = log.extendedProps.category || 'Uncategorized';
      const logStart = new Date(log.start).getTime();
      const logEnd = new Date(log.end).getTime();
      const duration = logEnd - logStart;
      
      categoryDurations[category] = (categoryDurations[category] || 0) + duration;
    });
  
    // Calculate duration by type (deep vs shallow)
    const typeDurations = {
      deep: 0,
      shallow: 0
    };
    
    logsInRange.forEach(log => {
      const logStart = new Date(log.start).getTime();
      const logEnd = new Date(log.end).getTime();
      const duration = logEnd - logStart;
      
      typeDurations[log.extendedProps.type] += duration;
    });
  
    return {
      totalLogs: logsInRange.length,
      totalDuration,
      categoryDurations,
      typeDurations,
      logs: logsInRange
    };
  };
  
  // Create a new work log entry
  export const createWorkLog = (title: string, type: 'deep' | 'shallow', category?: string, description?: string): WorkLogData => {
    const now = new Date();
    
    const newLog: WorkLogData = {
      id: Date.now().toString(), // Simple ID generation
      title,
      start: now.toISOString(),
      end: now.toISOString(), // Will be updated when the log is stopped
      extendedProps: {
        type,
        category,
        inProgress: true,
        description
      }
    };
    
    saveWorkLog(newLog);
    saveActiveLog(newLog);
    
    return newLog;
  };
  
  // Start a work log timer
  export const startWorkLog = (log: WorkLogData): WorkLogData => {
    const updatedLog = {
      ...log,
      start: new Date().toISOString(),
      extendedProps: {
        ...log.extendedProps,
        inProgress: true
      }
    };
    
    saveWorkLog(updatedLog);
    saveActiveLog(updatedLog);
    
    return updatedLog;
  };
  
  // Stop a work log timer
  export const stopWorkLog = (log: WorkLogData): WorkLogData => {
    const updatedLog = {
      ...log,
      end: new Date().toISOString(),
      extendedProps: {
        ...log.extendedProps,
        inProgress: false
      }
    };
    
    // Calculate duration and update total work time
    const startTime = new Date(log.start).getTime();
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    updateTotalWorkTime(duration);
    
    saveWorkLog(updatedLog);
    clearActiveLog();
    
    return updatedLog;
  };
  
  // Update work log details
  export const updateWorkLog = (id: string, updates: Partial<Omit<WorkLogData, 'id'>>): WorkLogData | null => {
    const allLogs = getAllWorkLogs();
    const logIndex = allLogs.findIndex(log => log.id === id);
    
    if (logIndex === -1) {
      return null;
    }
    
    const updatedLog = {
      ...allLogs[logIndex],
      ...updates,
      extendedProps: {
        ...allLogs[logIndex].extendedProps,
        ...(updates.extendedProps || {})
      }
    };
    
    allLogs[logIndex] = updatedLog;
    localStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(allLogs));
    
    // If this is the active log, update it as well
    const activeLog = getActiveLog();
    if (activeLog && activeLog.id === id) {
      saveActiveLog(updatedLog);
    }
    
    return updatedLog;
  };
  
  // Add a category if it doesn't exist
  export const addCategory = (category: string): string[] => {
    const categories = getCategories();
    
    if (!categories.includes(category)) {
      categories.push(category);
      saveCategories(categories);
    }
    
    return categories;
  };
  
  // Remove a category and update all logs that use it
  export const removeCategory = (category: string): void => {
    // Remove from categories list
    const categories = getCategories();
    const updatedCategories = categories.filter(c => c !== category);
    saveCategories(updatedCategories);
    
    // Update all logs that use this category
    const allLogs = getAllWorkLogs();
    const updatedLogs = allLogs.map(log => {
      if (log.extendedProps.category === category) {
        return {
          ...log,
          extendedProps: {
            ...log.extendedProps,
            category: undefined
          }
        };
      }
      return log;
    });
    
    localStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(updatedLogs));
  };
  
  // Get total working time for today
  export const getTodayWorkTime = (): number => {
    const today = new Date();
    return getDailyWorkTime(today);
  };
  
  // Get working time for a specific day
  export const getDailyWorkTime = (date: Date): number => {
    const logs = getWorkLogsForDate(date);
    
    return logs.reduce((total, log) => {
      const logStart = new Date(log.start).getTime();
      const logEnd = new Date(log.end).getTime();
      return total + (logEnd - logStart);
    }, 0);
  };
  
  // Format milliseconds to a readable duration
  export const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Export all data (for backup)
  export const exportData = (): string => {
    const data = {
      workLogs: getAllWorkLogs(),
      categories: getCategories()
    };
    
    return JSON.stringify(data);
  };
  
  // Import data (from backup)
  export const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.workLogs && Array.isArray(data.workLogs)) {
        localStorage.setItem(STORAGE_KEYS.WORK_LOGS, JSON.stringify(data.workLogs));
      }
      
      if (data.categories && Array.isArray(data.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };
  
  // Clear all work log data
  export const clearAllData = (): void => {
    localStorage.removeItem(STORAGE_KEYS.WORK_LOGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_LOG);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  };

  // Get total work time
  export const getTotalWorkTime = (): number => {
    const totalTime = localStorage.getItem(STORAGE_KEYS.TOTAL_WORK_TIME);
    return totalTime ? parseInt(totalTime, 10) : 0;
  };

  // Update total work time
  export const updateTotalWorkTime = (duration: number): void => {
    const currentTotal = getTotalWorkTime();
    const newTotal = currentTotal + duration;
    localStorage.setItem(STORAGE_KEYS.TOTAL_WORK_TIME, newTotal.toString());
    
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new CustomEvent('totalWorkTimeUpdate', { 
      detail: { totalTime: newTotal }
    }));
  };

  // Reset total work time
  export const resetTotalWorkTime = (): void => {
    localStorage.setItem(STORAGE_KEYS.TOTAL_WORK_TIME, '0');
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new CustomEvent('totalWorkTimeUpdate', { 
      detail: { totalTime: 0 }
    }));
  };