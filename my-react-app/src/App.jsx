import { useState, useEffect } from "react";
import Eventlist from "./components/Eventlist.jsx";
import StudentForm from "./StudentRegistration/StudentForm.jsx";
import "./App.css";

const defaultSampleEvents = [
  {
    _id: "sample_1",
    title: "Cultural Day",
    category: "CULTURE",
    description: "Celebrate music, dance, art, and cultures from across campus.",
    date: "November 12, 2026",
    venue: "Open Air Stage",
    registrationsCount: 0
  },
  {
    _id: "sample_2",
    title: "Sports Meet",
    category: "SPORTS",
    description: "Join exciting games and sports competitions with your friends.",
    date: "November 18, 2026",
    venue: "College Sports Ground",
    registrationsCount: 0
  },
  {
    _id: "sample_3",
    title: "Tech Symposium",
    category: "TECHNOLOGY",
    description: "Explore technology, coding competitions, and innovative projects.",
    date: "November 22, 2026",
    venue: "Main Auditorium",
    registrationsCount: 0
  }
];

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
      }
    } catch (err) {
      console.warn("Backend not reached, keeping existing state:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSeedEvents = async () => {
  // Generate a new unique event dynamically
  const newSample = {
    _id: "event_" + Date.now(),
    title: `Campus Hackathon ${events.length + 1}`,
    category: "TECHNOLOGY",
    description: "Build innovative projects and solve real-world coding challenges.",
    date: "December 05, 2026",
    venue: "Lab Block C",
    registrationsCount: 0
  };

  // Try saving to backend first
  try {
    const res = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSample)
    });
    if (res.ok) {
      const savedEvent = await res.json();
      setEvents((prev) => [...prev, savedEvent]);
      return;
    }
  } catch (err) {
    console.warn("Backend offline, updating UI directly:", err);
  }

  // Fallback if backend is offline: add directly to state
  setEvents((prev) => [...prev, newSample]);
};

  const handleDeleteEvent = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/events/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Backend delete request skipped:", err);
    }
    setEvents((prev) => prev.filter((item) => item._id !== id));
  };

  const handleNavClick = (section, e) => {
    e.preventDefault();
    setActiveNav(section);
    let targetId = "home-section";
    if (section === "events") targetId = "events-section";
    if (section === "register") targetId = "student-form-section";

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegisterClick = (title) => {
    setSelectedEventTitle(title);
    setActiveNav("register");
    const element = document.getElementById("student-form-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="home-section">
      <nav className="navbar">
        <div className="brand">CampusConnect</div>
        <div className="nav-links">
          <a
            href="#home"
            className={activeNav === "home" ? "active" : ""}
            onClick={(e) => handleNavClick("home", e)}
          >
            Home
          </a>
          <a
            href="#events"
            className={activeNav === "events" ? "active" : ""}
            onClick={(e) => handleNavClick("events", e)}
          >
            Events
          </a>
          <a
            href="#register"
            className={activeNav === "register" ? "active" : ""}
            onClick={(e) => handleNavClick("register", e)}
          >
            Register
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="subtitle-badge">Connect • Participate • Grow</div>
        <h1 className="hero-title">
          Make Your Campus <br />
          <span>Experience Count</span>
        </h1>
        <p className="hero-desc">
          Discover exciting campus events, connect with fellow students, and make every moment memorable.
        </p>
        <button className="btn-primary" onClick={() => handleRegisterClick("")}>
          Explore Events
        </button>
      </section>

      <div id="events-section">
        <Eventlist
          events={events}
          onRegisterClick={handleRegisterClick}
          onSeedEvents={handleSeedEvents}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>

      <StudentForm
        selectedEventTitle={selectedEventTitle}
        events={events}
        onRegistrationSuccess={fetchEvents}
      />
    </div>
  );
}