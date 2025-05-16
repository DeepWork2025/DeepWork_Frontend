import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { calculateTodayWorkLogTime } from "../../utils/calculateWorkTime";
import { useTimer } from "../../hooks/useTimer";

interface WorkLogSummaryProps {
  selectedDate: Date;
}

const WorkLogSummary: React.FC<WorkLogSummaryProps> = ({selectedDate}) => {
  const logs = useSelector((state: RootState) => state.events.events);

  const { activeLog, elapsed } = useTimer()

  const [tick, setTick] = useState(0)

  useEffect(()=>{
    const interval = setInterval(()=>{
      setTick((t)=>t+1) // update every second
    },1000)
    return () => clearInterval(interval)
  },[])

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