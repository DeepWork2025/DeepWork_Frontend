import DayEventGrid from "../daily/DayEventGrid";
import TimeAxis from "../daily/TimeAxis";
import { EventData } from "../../../types/event.types";

interface DayViewCalendarProps {
    events?: EventData[]; // Make it optional, but handle cases when undefined
  }

  const DayViewCalendar: React.FC<DayViewCalendarProps> = ({ events = [] }) => {
    // Debugging: Log events to check if they are correctly formatted
    console.log("Rendering DayViewCalendar with events:", events);
  
    return (
      <div className="relative w-full h-screen overflow-y-auto">
        <DayEventGrid events={events} />
        <TimeAxis />
      </div>
    );
  };

export default DayViewCalendar