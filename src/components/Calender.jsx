// src/components/UserCalendar.jsx
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../Styles/Calender.css";

function UserCalendar() {
  const [events, setEvents] = useState([
    { title: "حلقة تحفيظ", date: "2025-11-10" },
    { title: "اختبار تجويد", date: "2025-11-15" },
  ]);

  const handleDateClick = (info) => {
    const title = prompt("أدخل عنوان الحدث:");
    if (title) {
      setEvents([...events, { title, date: info.dateStr }]);
    }
  };

  return (
    <div className="calendar-section">
      <h3 className="calendar-title">📅 جدولك الشخصي</h3>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="auto"
      />
    </div>
  );
}

export default UserCalendar;
