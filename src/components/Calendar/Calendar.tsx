import React, { useState } from "react";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startingDay = startDay(currentDate);

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition ${
            isToday(i)
              ? "bg-blue-500 text-white rounded-full font-bold"
              : "hover:bg-gray-200"
          }`}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="max-w-sm h-[350px] flex flex-col border rounded-lg shadow-md bg-white overflow-hidden">
      {/* header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
        <button
          className="text-xl font-bold hover:text-gray-600"
          onClick={prevMonth}
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          className="text-xl font-bold hover:text-gray-600"
          onClick={nextMonth}
        >
          &gt;
        </button>
      </div>

      {/* week */}
      <div className="grid grid-cols-7 text-center font-bold bg-gray-50 py-2 text-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* date */}
      <div className="grid grid-cols-7 gap-1 p-2">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
