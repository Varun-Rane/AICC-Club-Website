/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [seats, setSeats] = useState(0);

  const [loading, setLoading] = useState(false);
  const [seatInputs, setSeatInputs] = useState({});
  const [updatingSeatId, setUpdatingSeatId] = useState(null); // 🔥

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setPageLoading(true);

    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    setEvents(data || []);

    const initialSeats = {};
    (data || []).forEach((e) => {
      initialSeats[e.id] = e.available_seats;
    });
    setSeatInputs(initialSeats);

    setPageLoading(false);
  };

  // ================= ADD EVENT =================
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !date || !description) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("events")
      .insert({
        event_name: eventName.trim(),
        date,
        description: description.trim(),
        location: location.trim(),
        poster_url: posterUrl.trim(),
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

    fetchEvents();

    setEventName("");
    setDate("");
    setDescription("");
    setLocation("");
    setPosterUrl("");
    setRegistrationOpen(false);
    setSeats(0);
  };

  // ================= TOGGLE REGISTRATION =================
  const toggleRegistration = async (e, id, current) => {
    e.preventDefault();

    await supabase
      .from("events")
      .update({ registration_open: !current })
      .eq("id", id);

    fetchEvents();
  };

  // ================= UPDATE SEATS (WITH LOADER) =================
  const handleUpdateSeats = async (id) => {
    const newSeats = Number(seatInputs[id]);
    if (isNaN(newSeats) || newSeats < 0) return;

    setUpdatingSeatId(id);

    await supabase
      .from("events")
      .update({ available_seats: newSeats })
      .eq("id", id);

    try {
      await supabase.rpc("allocate_seats", {
        event_id_input: id,
      });
    } catch {}

    await fetchEvents();
    setUpdatingSeatId(null);
  };

  // ================= DELETE EVENT =================
  const deleteEvent = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Delete this event?")) return;

    await supabase.from("registrations").delete().eq("event_id", id);
    await supabase.from("events").delete().eq("id", id);

    fetchEvents();
  };

  // ================= PAGE LOADER =================
  if (pageLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Admin: Manage Events
      </h1>

      {/* ADD EVENT */}
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl p-8 border border-gray-700">
        <form onSubmit={handleAddEvent} className="space-y-4">
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
            className="w-full p-3 bg-gray-700 rounded"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-3 bg-gray-700 rounded"
          />

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full p-3 bg-gray-700 rounded"
          />

          <input
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="Poster URL"
            className="w-full p-3 bg-gray-700 rounded"
          />

          <input
            type="number"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            placeholder="Seats"
            className="w-full p-3 bg-gray-700 rounded"
          />

          <label className="flex gap-2">
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
            className="px-6 py-2 bg-pink-600 rounded"
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>

      {/* EVENTS LIST */}
      <div className="max-w-5xl mx-auto mt-12 space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold">{event.event_name}</h3>
            <p className="text-gray-400">{event.date}</p>
            <p className="text-gray-300 mt-2">{event.description}</p>

            <div className="flex flex-wrap gap-4 items-center mt-4">
              <input
                type="number"
                value={seatInputs[event.id]}
                onChange={(e) =>
                  setSeatInputs({
                    ...seatInputs,
                    [event.id]: e.target.value,
                  })
                }
                className="w-24 p-2 bg-gray-700 rounded"
              />

              {/* UPDATE BUTTON WITH LOADER */}
              <button
                type="button"
                onClick={() => handleUpdateSeats(event.id)}
                disabled={updatingSeatId === event.id}
                className={`px-4 py-1 rounded flex items-center gap-2 ${
                  updatingSeatId === event.id
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600"
                }`}
              >
                {updatingSeatId === event.id && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {updatingSeatId === event.id
                  ? "Updating..."
                  : "Update Seats"}
              </button>

              <button
                type="button"
                onClick={(e) =>
                  toggleRegistration(
                    e,
                    event.id,
                    event.registration_open
                  )
                }
                className={`px-4 py-1 rounded ${
                  event.registration_open
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {event.registration_open ? "Opened" : "Closed"}
              </button>

              <button
                type="button"
                onClick={(e) => deleteEvent(e, event.id)}
                className="px-4 py-1 bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventsPage;
