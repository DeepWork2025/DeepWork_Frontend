import React from "react";
import Navbar from "../components/navbar/Navbar";
import Calendar from "../components/Calendar/Calendar";
import TimeAxis from "../components/timeAxis/TimeAxis";
import Timer from "../components/timer/Timer";
import "../styles/Home.css";
import DayCalendar from "../components/Calendar/DayCalendar";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="content-container">
        <div className="calendar-panel">
          <Calendar />
          <Timer />
        </div>
        <div className="time-axis-panel">
          <TimeAxis />
          <DayCalendar />
        </div>
      </div>
    </div>
  );
};

export default Home;
