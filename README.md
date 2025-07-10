# 🗓️ Deeeep: A Calendar-View Producticity Tracker

A modern web application designed to help you visualize and optimize your **deep work** sessions.  
Track your focused work time with real-time timers, and manage your sessions using two powerful productivity views:

- **🧠 Work Log Calendar** – displays detailed logs grouped by hour with a daily timeline for reflection and analysis
- **⏰ Time Calendar** – an interactive scheduling interface to plan and edit events in your day

Stay focused. Stay intentional. Build better habits for productive work.

## 🔧 Tech Stack

- **React + TypeScript**
- **FullCalendar.js** for scheduling and day view UI
- **Tailwind CSS** for styling
- **LocalStorage**
- **Custom React Hooks**

---

## ✨ Features

### 🕒 Work Log Timer
- Start/stop a timer to track your current work session
- Real-time elapsed time display
- Automatic log saving with `start` and `end` timestamps
- Summary of total work time for each day

### 📅 Interactive Calendar
- View, create, edit, and delete work events
- Drag-and-drop and resize events in the calendar
- Timeline grouping by hour
- Form modal to edit event details

### 📂 LocalStorage Persistence
- Events and logs are saved locally
- Mocked API services abstract localStorage access (`eventService.ts`, `workLogService.ts`)

---

## 🚀 Getting Started

### 1. Clone the Repository

```
git clone https://github.com/your-username/work-log-tracker.git
cd work-log-tracker
```

### 2. Install Dependencies
```
npm install
```

### 3. Run the App
```
npm run dev
```
The app will be available at http://localhost:5173/ (Vite default).

## 📁 Project Structure
```
src/
├── components/
│   ├── calendar/
│   ├── event/
│   └── timer/
├── hooks/
│   ├── useCalendarEvents.ts
│   ├── useTimer.ts
│   └── useWorkLog.ts
├── api/
│   ├── eventService.ts
│   └── workLogService.ts
├── types/
│   └── workLog.type.ts
🧠 Future Improvements
Backend integration (Node.js + DB)

User authentication

Export logs as CSV/PDF

Tagging or categorization for work sessions

Analytics dashboard
```

## 🙌 Contributing
Contributions are welcome!
Please open an issue or submit a pull request.
