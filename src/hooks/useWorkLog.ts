import { useState, useEffect } from 'react';
import { WorkLogData } from '../types/workLog.type';
import * as workLogService from "../api/workLogService"

export const useWorkLog = (id?: string) => {
  const [workLog, setWorkLog] = useState<WorkLogData | null>(
    id ? workLogService.getWorkLogById(id) : null
  );
  const [isLoading, setIsLoading] = useState(false);
  
  const saveLog = useCallback((log: WorkLogData) => {
    setIsLoading(true);
    workLogService.saveWorkLog(log);
    setWorkLog(log);
    setIsLoading(false);
  }, []);
  
  const deleteLog = useCallback(() => {
    if (id) {
      setIsLoading(true);
      workLogService.deleteWorkLog(id);
      setWorkLog(null);
      setIsLoading(false);
    }
  }, [id]);
  
  return { workLog, saveLog, deleteLog, isLoading };
};