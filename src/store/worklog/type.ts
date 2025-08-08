import { WorkLogData } from '../../types/workLog.type';

export interface WorkLogState {
    workLogs: WorkLogData[];
    selectedWorkLog: WorkLogData | null;
    activeWorkLog: WorkLogData | null;
    loading: boolean;
    error: string | null;
}