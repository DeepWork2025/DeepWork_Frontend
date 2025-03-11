import React, {useState, useEffect} from 'react'
import { useWorkLog } from '../../hooks/useWorkLog';
import { useTimer } from '../../hooks/useTimer';
import { WorkLogData } from '../../types/workLog.type';

const WorkLogTimer: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { workLogs } = useWorkLog(date);
  const { activeLog, elapsed, startTimer, stopTimer, isRunning } = useTimer();
  const [totalWorkTime, setTotalWorkTime] = useState<number>(0);

   // Make sure workLogs is an array
  const safeWorkLogs = Array.isArray(workLogs) ? workLogs : [];

  // calculet total work time
  useEffect(()=> {
    const totalMinutes = safeWorkLogs.reduce((sum, log) => {
      const start = new Date(log.start).getTime();
      const end = new Date(log.end).getTime();
      return sum + (end -start) / (1000*60);
    }, 0);
    setTotalWorkTime(totalMinutes);
  }, [safeWorkLogs]);

  // Group logs by hour
  const groupedLogs: { [hour: string]: typeof workLogs } = {};

  safeWorkLogs.forEach(log => {
    const startHour = new Date(log.start).getHours().toString();
    if (!groupedLogs[startHour]) groupedLogs[startHour] = [];
    groupedLogs[startHour].push(log);
  });

  // Handle Start/Stop Button Click
  const handleStartStopClick = () => {
    if (isRunning) {
      stopTimer(); // Stop active timer
    } else {
      // Create a new work log entry
      const newLog: WorkLogData = {
        id: Date.now().toString(),
        title: "Work Session",
        start: new Date().toISOString(),
        end: "", // Will be set when stopping
        extendedProps: { inProgress: true },
      };
      startTimer(newLog); // Start timer with new log
    }
  };

  // Format elapsed time (HH:MM:SS)
  const formatElapsedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
  <div className="p-4">
        {/* Total Work Time Tracker */}
        <div className="bg-gray-100 p-3 rounded-md mb-4 text-center">
          <h2 className="text-lg font-semibold">Total Work Time</h2>
          <p className="text-xl font-bold">{Math.floor(totalWorkTime / 60)}h {Math.floor(totalWorkTime % 60)}m</p>
        </div>

           {/* Active Timer Display */}
      {isRunning && (
        <div className="bg-blue-100 p-3 rounded-md text-center">
          <h2 className="text-lg font-semibold">Active Timer</h2>
          <p className="text-xl font-bold">{formatElapsedTime(elapsed)}</p>
        </div>
      )}

       {/* Timer Controls */}
       <div className="mt-4 text-center">
        <button
          onClick={handleStartStopClick}
          className={`p-2 rounded ${isRunning ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        >
          {isRunning ? 'Stop Timer' : 'Start Timer'}
        </button>
      </div>

  </div>
  );
}

export default WorkLogTimer