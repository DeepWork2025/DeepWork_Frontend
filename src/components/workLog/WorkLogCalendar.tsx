import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import * as workLogService from "../../api/workLogService";
import { WorkLogData } from "../../types/workLog.type";
import { WorkLogDetailModal } from "./WorkLogDetailModal";

// Add styles for the active work log
const styles = `
  .fc-event {
    transition: height 0.5s ease-in-out;
  }
  
  .fc-event.active-work-log {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
`;

const WorkLogCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [workLogs, setWorkLogs] = useState<WorkLogData[]>([]);
  const [selectedLog, setSelectedLog] = useState<WorkLogData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeLog, setActiveLog] = useState<WorkLogData | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to refresh work logs
  const refreshWorkLogs = () => {
    if (date) {
      const logs = workLogService.getWorkLogsForDate(date);
      setWorkLogs(logs);
      setActiveLog(workLogService.getActiveLog());
    }
  };

  // Initial load and date change effect
  useEffect(() => {
    refreshWorkLogs();
  }, [date]);

  // Listen for timer state changes
  useEffect(() => {
    const handleTimerStateChange = () => {
      refreshWorkLogs();
    };

    window.addEventListener("storage", handleTimerStateChange);
    window.addEventListener("workLogUpdate", handleTimerStateChange);

    return () => {
      window.removeEventListener("storage", handleTimerStateChange);
      window.removeEventListener("workLogUpdate", handleTimerStateChange);
    };
  }, []);

  // Listen for date change events
  useEffect(() => {
    const handleDateChange = (event: CustomEvent) => {
      const newDate = event.detail.date;
      if (newDate instanceof Date) {
        setDate(newDate);
      }
    };

    window.addEventListener(
      "workLogDateChange",
      handleDateChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "workLogDateChange",
        handleDateChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    // Set the initial scroll position to 6:00 AM after the component mounts
    const timeGrid = document.querySelector(".fc-timegrid-body");
    if (timeGrid) {
      timeGrid.scrollTop = 720; // 6 hours * 120px (approximate height per hour)
    }
  }, []);

  const handleDateClick = (arg: { date: Date }) => {
    setDate(arg.date);
  };

  const handleEventClick = (arg: EventClickArg) => {
    // Find the corresponding work log
    const logId = arg.event.id;
    const log = workLogs.find((l) => l.id === logId);

    if (log) {
      setSelectedLog(log);
      setIsDetailModalOpen(true);
    }
  };

  const handleSelectTimeSlot = (selectInfo: DateSelectArg) => {
    // This could open a modal to create a new work log
    const title = prompt("Enter a title for your work log");

    if (title) {
      const newLog = workLogService.createWorkLog(
        title,
        "shallow", // Default type
        undefined,
        undefined
      );

      // Update the log with the selected time range
      const updatedLog = {
        ...newLog,
        start: selectInfo.start.toISOString(),
        end: selectInfo.end.toISOString(),
      };

      workLogService.saveWorkLog(updatedLog);

      // Refresh logs
      setWorkLogs(workLogService.getWorkLogsForDate(date));
    }
  };

  // Convert work logs to FullCalendar events
  const calendarEvents = workLogs.map((log) => ({
    id: log.id,
    title: log.title,
    start: new Date(log.start),
    end: new Date(log.end),
    allDay: false,
    backgroundColor: log.extendedProps.type === "deep" ? "#4f46e5" : "#10b981",
    borderColor: log.extendedProps.type === "deep" ? "#4338ca" : "#059669",
  }));

  // Add the active log as a real-time event if it exists
  if (activeLog) {
    calendarEvents.push({
      id: activeLog.id,
      title: activeLog.title,
      start: new Date(activeLog.start),
      end: currentTime,
      allDay: false,
      backgroundColor:
        activeLog.extendedProps.type === "deep" ? "#4f46e5" : "#10b981",
      borderColor:
        activeLog.extendedProps.type === "deep" ? "#4338ca" : "#059669",
    });
  }

  return (
    <div className="h-full min-h-[600px]">
      <style>{styles}</style>
      <div className="h-full">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          headerToolbar={false}
          dayHeaders={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          initialDate={date}
          events={calendarEvents}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          slotDuration="00:15:00"
          slotLabelInterval="01:00"
          height="auto"
          contentHeight="auto"
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          select={handleSelectTimeSlot}
          expandRows={true}
          allDaySlot={false}
          nowIndicator={true}
          viewDidMount={(view) => {
            // Ensure the time grid has a minimum height
            const timeGrid = view.el.querySelector(
              ".fc-timegrid-body"
            ) as HTMLElement;
            if (timeGrid) {
              timeGrid.style.minHeight = "600px";
            }
          }}
          slotLabelDidMount={(info) => {
            info.el.style.display = "none"; // Hides time labels (8:00, 9:00, etc.)
          }}
          eventDidMount={(info) => {
            if (info.event.id === activeLog?.id) {
              info.el.classList.add("active-work-log");
            }
          }}
        />
      </div>

      {isDetailModalOpen && selectedLog && (
        <WorkLogDetailModal
          workLog={selectedLog}
          onClose={() => setIsDetailModalOpen(false)}
          onDelete={() => {
            workLogService.deleteWorkLog(selectedLog.id);
            setWorkLogs(workLogService.getWorkLogsForDate(date));
            setIsDetailModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default WorkLogCalendar;
