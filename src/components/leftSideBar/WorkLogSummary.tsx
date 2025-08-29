import React, {useEffect, useState} from "react";
import { calculateTodayWorkLogTime } from "../../utils/calculateWorkTime";
import { useTimer } from "../../hooks/useTimer";
import * as workLogService from "../../api/workLogService";
import { WorkLogData } from "../../types/workLog.type";

interface WorkLogSummaryProps {
  selectedDate: Date;
}

const WorkLogSummary: React.FC<WorkLogSummaryProps> = ({selectedDate}) => {
  const [logs, setLogs] = useState<WorkLogData[]>([]);

  const { activeLog, elapsed } = useTimer()

  useEffect(() => {
    const allLogs = workLogService.getAllWorkLogs();
    setLogs(allLogs);
  }, []);

  const total = calculateTodayWorkLogTime(
    logs,
    selectedDate,
    activeLog||undefined,
    elapsed);

  return (
    <div className="px-4 py-3 border-t mt-4 text-sm text-gray-700 bg-white shadow-sm rounded">
      <div className="font-medium text-gray-900">Total Work Time</div>
       <div className="font-medium text-gray-900">
        {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}'s Work Time
      </div>
      <div className="text-blue-600 font-semibold text-lg mt-1">
        {total.formatted}
      </div>
    </div>
  );
};

export default WorkLogSummary;