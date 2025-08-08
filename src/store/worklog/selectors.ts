import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { WorkLogData } from '../../types/workLog.type';

// 基础选择器
export const selectWorkLogs = (state: RootState) => state.workLog.workLogs;
export const selectSelectedWorkLog = (state: RootState) => state.workLog.selectedWorkLog;
export const selectActiveWorkLog = (state: RootState) => state.workLog.activeWorkLog;
export const selectLoading = (state: RootState) => state.workLog.loading;
export const selectError = (state: RootState) => state.workLog.error;

// 复杂选择器
export const selectWorkLogsByDate = createSelector(
  [selectWorkLogs, (_, date: Date) => date],
  (workLogs, date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workLogs.filter(log => 
      log.startTime.startsWith(dateStr)
    );
  }
);

// 统计选择器
export const selectWorkLogStats = createSelector(
  [selectWorkLogs],
  (workLogs) => {
    const totalTime = workLogs.reduce((total, log) => {
      if (log.elapsed) {
        return total + log.elapsed;
      }
      return total;
    }, 0);

    return {
      totalCount: workLogs.length,
      totalTime,
      activeCount: workLogs.filter(log => log.status === 'running').length
    };
  }
);

// 根据状态筛选
export const selectWorkLogsByStatus = createSelector(
  [selectWorkLogs, (_, status: 'running' | 'paused' | 'stopped') => status],
  (workLogs, status) => workLogs.filter(log => log.status === status)
);

// 获取今日工作日志
export const selectTodayWorkLogs = createSelector(
  [selectWorkLogs],
  (workLogs) => {
    const today = new Date().toISOString().split('T')[0];
    return workLogs.filter(log => 
      log.startTime.startsWith(today)
    );
  }
);