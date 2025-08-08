import { RootState } from '../index';
import { createSelector } from '@reduxjs/toolkit';

// base selectors
export const selectEvents = (state: RootState) => state.events.events;
export const selectSelectedEvent = (state: RootState) => state.events.selectedEvent;
export const selectLoading = (state: RootState) => state.events.loading;
export const selectError = (state: RootState) => state.events.error;

// 复杂选择器示例
export const selectEventsByDate = createSelector(
  [selectEvents, (_, date: Date) => date],
  (events, date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.startTime.startsWith(dateStr)
    );
  }
);

// // 计算属性的选择器示例
// export const selectEventStats = createSelector(
//   [selectEvents],
//   (events) => ({
//     total: events.length,
//     // 其他统计信息...
//   })
// );