import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import { EventClickArg, EventDropArg, EventInput } from "@fullcalendar/core";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import EventDetailModal from "../event/EventDetailModal";
import { CustomEventBlock } from "../event/CustomEventBlock";

interface FullCalendarWrapperProps {
  customEvents?: EventInput[];
  onEventDrop?: (info: EventDropArg) => void;
  onEventClick?: (info: EventClickArg) => void;
}

const FullCalendarWrapper: React.FC<FullCalendarWrapperProps> = ({
  customEvents,
  onEventDrop,
  onEventClick,
}) => {
  const {
    events: defaultEvents,
    handleEventClick: defaultHandleEventClick,
    handleDateSelect,
    deleteEvent,
    handleEventDrop: defaultHandleEventDrop,
    handleEventResize,
    selectedEvent,
    loading,
    saveEvent,
  } = useCalendarEvents();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Use custom events if provided, otherwise use default events
  const events = customEvents || defaultEvents;
  const handleEventDrop = onEventDrop || defaultHandleEventDrop;
  const handleEventClick = onEventClick || defaultHandleEventClick;

  useEffect(() => {
    // Initialize Draggable for all task elements
    const taskContainer = document.querySelector(".task-list") as HTMLElement;
    if (taskContainer) {
      new Draggable(taskContainer, {
        itemSelector: "[data-event]",
        eventData: function (eventEl) {
          const eventData = eventEl.getAttribute("data-event");
          return eventData ? JSON.parse(eventData) : null;
        },
      });
    }
  }, []);

  const handleDrop = (info: DropArg) => {
    console.log("Drop event received:", info);

    try {
      const eventData = info.draggedEl.getAttribute("data-event");
      if (!eventData) return;

      const parsedData = JSON.parse(eventData);

      // Create a new event from the task data
      const newEvent = {
        id: parsedData.id,
        title: parsedData.title,
        start: info.date,
        end: new Date(info.date.getTime() + 60 * 60 * 1000), // 1 hour duration
        backgroundColor: "#3788d8",
        borderColor: "#3788d8",
        textColor: "#ffffff",
        extendedProps: {
          ...parsedData.extendedProps,
          isStopped: false,
        },
      };

      console.log("Creating new event from task:", newEvent);
      saveEvent({
        id: Number(newEvent.id),
        title: newEvent.title,
        startTime: newEvent.start.toISOString(),
        endTime: newEvent.end.toISOString(),
        description: newEvent.extendedProps.description || "",
        label: newEvent.extendedProps.label || "",
        backgroundColor: newEvent.backgroundColor,
      });
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  useEffect(() => {
    console.log("Current events in FullCalendar:", events);
    events.forEach((event) => {
      console.log("Event details:", {
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor,
        extendedProps: event.extendedProps,
      });
    });
  }, [events]);

  return (
    <div className="h-full min-h-[600px]">
      <div className="h-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={false}
            dayHeaders={false}
            events={events}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            slotDuration="00:15:00"
            slotLabelInterval="01:00"
            height="auto"
            contentHeight="auto"
            selectable={true}
            selectMirror={true}
            editable={true}
            droppable={true}
            drop={handleDrop}
            select={handleDateSelect}
            eventClick={(e) => {
              console.log("Event clicked:", e.event);
              handleEventClick(e);
              setIsDetailModalOpen(true);
            }}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            expandRows={true}
            nowIndicator={true}
            allDaySlot={false}
            eventContent={(arg) => {
              console.log("Rendering event:", arg.event);
              return (
                <CustomEventBlock event={arg.event} timeText={arg.timeText} />
              );
            }}
            viewDidMount={(view) => {
              // Ensure the time grid has a minimum height
              const timeGrid = view.el.querySelector(
                ".fc-timegrid-body"
              ) as HTMLElement;
              if (timeGrid) {
                timeGrid.style.minHeight = "600px";
              }
            }}
          />
        )}
      </div>
      {isDetailModalOpen && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setIsDetailModalOpen(false)}
          onDelete={deleteEvent}
          onUpdate={saveEvent}
        />
      )}
    </div>
  );
};

export default FullCalendarWrapper;
