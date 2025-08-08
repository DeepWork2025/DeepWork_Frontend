import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkLogState } from './type';
import { WorkLogData } from '../../types/workLog.type';

// initial state
const initialState: WorkLogState = {
    workLogs: [],
    selectedWorkLog: null,
    loading: false,
    error: null,
    activeWorkLog: null // Add tracking for currently active worklog
}

// create slice
const workLogSlice = createSlice({
    name: 'worklog',
    initialState,
    reducers: {
        // set work logs
        setWorkLogs: (state, action: PayloadAction<WorkLogData[]>) => {
            state.workLogs = action.payload;
        },
        // set selected work log
        setSelectedWorkLog: (state, action: PayloadAction<WorkLogData | null>) => {
            state.selectedWorkLog = action.payload;
        },
        // add new work log
        addWorkLog: (state, action: PayloadAction<WorkLogData>) => {
            state.workLogs.push(action.payload);
        },
        // update existing work log
        updateWorkLog: (state, action: PayloadAction<WorkLogData>) => {
            const index = state.workLogs.findIndex(log => log.id === action.payload.id);
            if (index !== -1) {
                state.workLogs[index] = {
                    ...state.workLogs[index],
                    ...action.payload
                };
            }
        },
        // delete work log
        deleteWorkLog: (state, action: PayloadAction<string>) => {
            // Clear selected/active if deleting that log
            if (state.selectedWorkLog?.id === action.payload) {
                state.selectedWorkLog = null;
            }
            if (state.activeWorkLog?.id === action.payload) {
                state.activeWorkLog = null;
            }
            // Filter out the deleted log
            state.workLogs = state.workLogs.filter(log => log.id !== action.payload);
        },
        // set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        // set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        // set active work log
        setActiveWorkLog: (state, action: PayloadAction<WorkLogData | null>) => {
            state.activeWorkLog = action.payload;
        }
    }
});

export const {
    setWorkLogs,
    setSelectedWorkLog,
    addWorkLog,
    updateWorkLog,
    deleteWorkLog,
    setLoading,
    setError,
    setActiveWorkLog
} = workLogSlice.actions;

export default workLogSlice.reducer;