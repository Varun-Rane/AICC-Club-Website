/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);

  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [seats, setSeats] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    setEvents(data || []);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!eventName || !date || !description) {
      alert("Fill required fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .insert({
        event_name: eventName,
        date,
        description,
        location,
        poster_url: posterUrl,
        registration_open: registrationOpen,
        available_seats: seats,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setEvents((prev) => [data, ...prev]);

    setEventName("");
    setDate("");
    setDescription("");
    setLocation("");
    setPosterUrl("");
    setSeats(0);
    setRegistrationOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin – Manage Events</h1>

      <form
        onSubmit={handleAddEvent}
        className="bg-gray-800 p-6 rounded-xl space-y-4"
      >
        <input placeholder="Event Name" value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded" />

        <input type="date" value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded" />

        <textarea placeholder="Description" value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded" />

        <input placeholder="Location" value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded" />

        <input placeholder="Poster URL" value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          className="w-full p-3 bg-gray-700 rounded" />

        <input type="number" placeholder="Total Seats"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full p-3 bg-gray-700 rounded" />

        <label className="flex gap-2">
          <input type="checkbox"
            checked={registrationOpen}
            onChange={(e) => setRegistrationOpen(e.target.checked)} />
          Registration Open
        </label>

        <button
          disabled={loading}
          className="bg-pink-600 px-6 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default AdminEventsPage;
