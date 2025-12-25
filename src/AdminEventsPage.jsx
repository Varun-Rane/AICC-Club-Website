/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);

  // form states
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // ================= FETCH EVENTS (RUN ONCE) =================
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Fetch events error:", error);
    } else {
      setEvents(data || []);
    }
  };

  // ================= ADD EVENT =================
  const handleAddEvent = async (e) => {
    e.preventDefault(); // 🔥 STOP PAGE REFRESH

    if (!eventName || !date || !description) {
      alert("Please fill all required fields");
      return;
    }

    // 🔥 DATE FIX (IMPORTANT)
    const formattedDate = date.includes("T")
      ? date.split("T")[0]
      : date;

    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          event_name: eventName.trim(),
          date: formattedDate,
          description: description.trim(),
          location: location.trim(),
          poster_url: posterUrl.trim(),
          registration_open: registrationOpen,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      alert(error.message); // 👈 real error shown
      return;
    }

    // update UI instantly
    setEvents((prev) => [data, ...prev]);

    // reset form
    setEventName("");
    setDate("");
    setDescription("");
    setLocation("");
    setPosterUrl("");
    setRegistrationOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
        Admin: Manage Events
      </h1>

      {/* ================= ADMIN PANEL ================= */}
      <div className="max-w-5xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <form onSubmit={handleAddEvent} className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg"
          />

          <input
            type="text"
            placeholder="Poster URL"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.checked)}
            />
            Registration Open
          </label>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:scale-105 transition"
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>

      {/* ================= EVENTS LIST ================= */}
      <div className="max-w-5xl mx-auto mt-12 space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold">{event.event_name}</h3>
            <p className="text-gray-400 text-sm">{event.date}</p>
            <p className="text-gray-300 mt-2">{event.description}</p>
            <p className="text-gray-400 mt-1">📍 {event.location}</p>
            <p className="text-sm mt-2">
              Registration:{" "}
              <span
                className={
                  event.registration_open
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {event.registration_open ? "Open" : "Closed"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventsPage;
