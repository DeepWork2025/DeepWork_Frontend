import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import * as workLogService from '../../api/workLogService';
import { WorkLogData } from '../../types/workLog.type';
import WorkLogBlock from './WorkLogBlock';

interface GroupedLogs {
  [hour: string]: WorkLogData[];
}

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

  // Group logs by hour for the timeline view
  const groupedLogs = useMemo(() => {
    const grouped: GroupedLogs = {};
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      grouped[i.toString()] = [];
    }
    
    // Group logs by hour
    workLogs.forEach(log => {
      const startDate = new Date(log.start);
      const hour = startDate.getHours().toString();
      
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      
      grouped[hour].push(log);
    });
    
    return grouped;
  }, [workLogs]);

  const handleDateClick = (arg: any) => {
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

  const handleLogClick = (log: WorkLogData) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
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
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">
        Work Log: {date ? date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        }) : 'No date selected'}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Full Calendar Component */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            initialDate={date}
            events={calendarEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            select={handleSelectTimeSlot}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            expandRows={true}
            allDaySlot={false}
            nowIndicator={true}
            // slotLabelDidMount={(info) => {
            //   info.el.style.display = "none"; // Hides time labels (8:00, 9:00, etc.)
            // }}
          />
        </div>

        {/* Timeline View */}
        <div className="bg-white rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-300px)]">
          <div className="p-3 border-b font-medium sticky top-0 z-20 bg-white">
            Timeline for {date ? date.toLocaleDateString('en-US', { 
              month: 'short',
              day: 'numeric'
            }) : ''}
          </div>
          
          {Object.entries(groupedLogs).map(([hour, hourLogs]) => (
            hourLogs.length > 0 && (
              <div key={hour} className="border-b">
                <div className="px-3 py-1 bg-gray-50 sticky top-12 z-10">
                  {parseInt(hour) === 0 ? '12 AM' : 
                    parseInt(hour) < 12 ? `${hour} AM` : 
                    parseInt(hour) === 12 ? '12 PM' : 
                    `${parseInt(hour) - 12} PM`}
                </div>
                <div className="p-2">
                  {hourLogs.map(log => (
                    <WorkLogBlock 
                      key={log.id} 
                      event={log}
                      onClick={() => handleLogClick(log)}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
          
          {workLogs.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No work logs for this day. Use the timer to track your work or click and drag on the calendar to create a new log.
            </div>
          )}
        </div>
      </div>

      {/* You would need to implement a modal component for log details */}
      {isDetailModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedLog.title}</h3>
            <div className="mb-4">
              <p><span className="font-medium">Start:</span> {new Date(selectedLog.start).toLocaleString()}</p>
              <p><span className="font-medium">End:</span> {new Date(selectedLog.end).toLocaleString()}</p>
              <p><span className="font-medium">Type:</span> {selectedLog.extendedProps.type}</p>
              {selectedLog.extendedProps.category && (
                <p><span className="font-medium">Category:</span> {selectedLog.extendedProps.category}</p>
              )}
              {selectedLog.extendedProps.description && (
                <div>
                  <p className="font-medium">Description:</p>
                  <p className="mt-1">{selectedLog.extendedProps.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 rounded-md mr-2"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => {
                  workLogService.deleteWorkLog(selectedLog.id);
                  setWorkLogs(workLogService.getWorkLogsForDate(date));
                  setIsDetailModalOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkLogCalendar;