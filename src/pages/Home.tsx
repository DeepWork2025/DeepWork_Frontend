import React from "react";
import Navbar from "../components/navbar/Navbar";
import DayViewCalendar from "../components/calendar/containers/DayViewCalendar";
import MonthViewCalendar from "../components/calendar/containers/MonthViewCalendar";
import Timer from "../components/timer/Timer";
// import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="content-container">
        <div className="calendar-panel">
          <MonthViewCalendar />
          <Timer />
        </div>
        <div className="time-axis-panel">
          <DayViewCalendar />
        </div>
      </div>
    </div>
  );
};

export default Home;
