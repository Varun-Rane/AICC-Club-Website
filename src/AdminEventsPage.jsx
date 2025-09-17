import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import axios from "axios";

// -------------------- Axios instance --------------------
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    description: "",
    location: "",
    posterImage: "",
    registrationOpen: false,
  });

  // -------------------- Fetch Events --------------------
  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err.response?.data || err);
      if (err.response?.status === 401) {
        alert("Unauthorized! Please login as admin.");
        localStorage.removeItem("token");
        window.location.reload();
      }
    }
  };

  // -------------------- Fetch User (Admin Check) --------------------
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.data.isAdmin) {
        alert("You are not an admin!");
        localStorage.removeItem("token");
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to fetch user:", err.response?.data || err);
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, []);

  // -------------------- Add / Update Event --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login as admin.");

    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, newEvent, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingEvent(null);
      } else {
        await api.post("/events", newEvent, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setNewEvent({ name: "", date: "", description: "", location: "", posterImage: "", registrationOpen: false });
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to save event");
    }
  };

  // -------------------- Delete Event --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to delete event");
    }
  };

  // -------------------- Toggle Registration --------------------
  const handleToggleRegistration = async (event) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(`/events/${event.id}/toggle`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error("Error toggling registration:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to toggle registration");
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-8 px-4">
      {/* Header */}
      <section className="max-w-6xl mx-auto text-center py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          Admin: Manage Events
        </motion.h1>
      </section>

      {/* Event Form */}
      <section className="max-w-6xl mx-auto my-8 p-6 bg-gray-800 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <textarea
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            placeholder="Poster URL"
            value={newEvent.posterImage}
            onChange={(e) => setNewEvent({ ...newEvent, posterImage: e.target.value })}
            className="w-full p-2 rounded-lg bg-gray-700 text-white"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newEvent.registrationOpen}
              onChange={(e) => setNewEvent({ ...newEvent, registrationOpen: e.target.checked })}
            />
            <label>Registration Open</label>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg"
          >
            {editingEvent ? "Update Event" : "Add Event"}
          </button>
          {editingEvent && (
            <button
              type="button"
              onClick={() => {
                setEditingEvent(null);
                setNewEvent({ name: "", date: "", description: "", location: "", posterImage: "", registrationOpen: false });
              }}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg ml-2"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Event List */}
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{event.name}</h3>
                <p className="text-sm text-gray-300">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-400">{event.location}</p>
                <p className="text-sm font-semibold">
                  Registration:{" "}
                  <span className={event.registrationOpen ? "text-green-400" : "text-red-400"}>
                    {event.registrationOpen ? "Open" : "Closed"}
                  </span>
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setNewEvent(event);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleToggleRegistration(event)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                  {event.registrationOpen ? "Close Reg" : "Open Reg"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-6xl mx-auto my-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          Events Timeline
        </motion.h2>

        <VerticalTimeline>
          {events.map((event) => (
            <VerticalTimelineElement
              key={event.id}
              date={new Date(event.date).toLocaleDateString()}
              contentStyle={{ background: "#1e293b", color: "#fff" }}
              contentArrowStyle={{ borderRight: "7px solid #1e293b" }}
              iconStyle={{ background: "#ec4899", color: "#fff" }}
              icon={
                event.posterImage ? (
                  <img src={event.posterImage} alt={event.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span>{event.name?.charAt(0)}</span>
                )
              }
            >
              {event.posterImage && (
                <img src={event.posterImage} alt={event.name} className="w-full h-40 object-cover rounded-lg mb-4" />
              )}
              <h3 className="vertical-timeline-element-title text-xl font-bold">{event.name}</h3>
              <p className="text-gray-300 my-2">{event.description}</p>
              <p className="text-sm text-gray-400">{event.location}</p>
              <p className={`text-sm font-semibold ${event.registrationOpen ? "text-green-400" : "text-red-400"}`}>
                {event.registrationOpen ? "Registration Open" : "Registration Closed"}
              </p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </section>
    </div>
  );
};

export default AdminEventsPage;
