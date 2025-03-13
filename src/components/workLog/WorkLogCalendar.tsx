import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import * as workLogService from '../../api/workLogService';
import { WorkLogData } from '../../types/workLog.type';
import { WorkLogDetailModal } from './WorkLogDetailModal';

const WorkLogCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [workLogs, setWorkLogs] = useState<WorkLogData[]>([]);
  const [selectedLog, setSelectedLog] = useState<WorkLogData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (date) {
      const logs = workLogService.getWorkLogsForDate(date);
      setWorkLogs(logs);
    }
  }, [date]);

  useEffect(() => {
    // Set the initial scroll position to 6:00 AM after the component mounts
    const timeGrid = document.querySelector('.fc-timegrid-body');
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
    const log = workLogs.find(l => l.id === logId);
    
    if (log) {
      setSelectedLog(log);
      setIsDetailModalOpen(true);
    }
  };

  const handleSelectTimeSlot = (selectInfo: DateSelectArg) => {
    // This could open a modal to create a new work log
    const title = prompt('Enter a title for your work log');
    
    if (title) {
      const newLog = workLogService.createWorkLog(
        title,
        'shallow', // Default type
        undefined, 
        undefined
      );
      
      // Update the log with the selected time range
      const updatedLog = {
        ...newLog,
        start: selectInfo.start.toISOString(),
        end: selectInfo.end.toISOString()
      };
      
      workLogService.saveWorkLog(updatedLog);
      
      // Refresh logs
      setWorkLogs(workLogService.getWorkLogsForDate(date));
    }
  };

  // Convert work logs to FullCalendar events
  const calendarEvents = workLogs.map(log => ({
    id: log.id,
    title: log.title,
    start: new Date(log.start),
    end: new Date(log.end),
    allDay: false,
    backgroundColor: log.extendedProps.type === 'deep' ? '#4f46e5' : '#10b981',
    borderColor: log.extendedProps.type === 'deep' ? '#4338ca' : '#059669'
  }));

  return (
    <div className="h-full min-h-[600px]">
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
            const timeGrid = view.el.querySelector('.fc-timegrid-body') as HTMLElement;
            if (timeGrid) {
              timeGrid.style.minHeight = '600px';
            }
          }}
          slotLabelDidMount={(info) => {
            info.el.style.display = "none"; // Hides time labels (8:00, 9:00, etc.)
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