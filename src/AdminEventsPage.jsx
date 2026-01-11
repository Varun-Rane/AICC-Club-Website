/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // ADD EVENT FORM
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [seats, setSeats] = useState(0);
  const [loading, setLoading] = useState(false);

  // ADD SEATS
  const [seatInputs, setSeatInputs] = useState({});
  const [updatingSeatId, setUpdatingSeatId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================= FETCH EVENTS + REGISTRATIONS =================
  const fetchEvents = async () => {
    setPageLoading(true);

    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (eventsError) {
      console.error(eventsError);
      setPageLoading(false);
      return;
    }

    const { data: regData } = await supabase
      .from("registrations")
      .select("id, event_id, ticket_id");

    setEvents(eventsData || []);
    setRegistrations(regData || []);

    const seatMap = {};
    (eventsData || []).forEach((e) => {
      seatMap[e.id] = 0;
    });
    setSeatInputs(seatMap);

    setPageLoading(false);
  };

  // ================= ADD EVENT =================
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !date || !description) return;

    setLoading(true);

    const { error } = await supabase.from("events").insert({
      event_name: eventName.trim(),
      date,
      description: description.trim(),
      location: location.trim(),
      poster_url: posterUrl.trim(),
      registration_open: registrationOpen,
      available_seats: Number(seats),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchEvents();

    setEventName("");
    setDate("");
    setDescription("");
    setLocation("");
    setPosterUrl("");
    setRegistrationOpen(false);
    setSeats(0);
  };

  // ================= ADD SEATS (LOGIC UNCHANGED) =================
  const handleUpdateSeats = async (eventId) => {
    const addSeats = Number(seatInputs[eventId]);

    if (Number.isNaN(addSeats) || addSeats <= 0) {
      alert("Enter seats to ADD (must be > 0)");
      return;
    }

    setUpdatingSeatId(eventId);

    const { data: eventRow } = await supabase
      .from("events")
      .select("available_seats")
      .eq("id", eventId)
      .single();

    const newSeats = eventRow.available_seats + addSeats;

    await supabase
      .from("events")
      .update({ available_seats: newSeats })
      .eq("id", eventId);

    // 🔥 sync seats with waiting users
    await supabase.rpc("allocate_available_seats", {
      p_event_id: eventId,
    });

    await fetchEvents();
    setUpdatingSeatId(null);
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

  // ================= DELETE EVENT =================
  const deleteEvent = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Delete this event?")) return;

    await supabase.from("registrations").delete().eq("event_id", id);
    await supabase.from("events").delete().eq("id", id);

    fetchEvents();
  };

  // ================= HELPERS (DISPLAY ONLY) =================
  const assignedCount = (eventId) =>
    registrations.filter(
      (r) => r.event_id === eventId && r.ticket_id !== null
    ).length;

  const waitingCount = (eventId) =>
    registrations.filter(
      (r) => r.event_id === eventId && r.ticket_id === null
    ).length;

  const totalSeats = (event) =>
    event.available_seats + assignedCount(event.id);

  // ================= LOADER =================
  if (pageLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Admin: Manage Events
      </h1>

      {/* ADD EVENT (UNCHANGED UI) */}
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
            placeholder="Initial Seats"
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

          <button disabled={loading} className="px-6 py-2 bg-pink-600 rounded">
            {loading ? "Adding..." : "Add Event"}
          </button>
        </form>
      </div>

      {/* EVENTS LIST (SAME UI, ONLY TEXT ADDED) */}
      <div className="max-w-5xl mx-auto mt-12 space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold">{event.event_name}</h3>
            <p className="text-gray-400">{event.date}</p>
            <p className="text-gray-300 mt-2">{event.description}</p>

            {/* SAME POSITION – JUST BETTER MEANING */}
            <p className="text-yellow-400 mt-1 font-medium">
              Seats Left: {event.available_seats}
            </p>
            <p className="text-blue-400 text-sm">
              Total Seats: {totalSeats(event)}
            </p>
            <p className="text-orange-400 text-sm">
              Waiting Users: {waitingCount(event.id)}
            </p>

            <div className="flex gap-4 mt-4 items-center">
              <input
                type="number"
                value={seatInputs[event.id]}
                onChange={(e) =>
                  setSeatInputs({
                    ...seatInputs,
                    [event.id]: Number(e.target.value),
                  })
                }
                placeholder="+ Seats"
                className="w-24 p-2 bg-gray-700 rounded"
              />

              <button
                onClick={() => handleUpdateSeats(event.id)}
                disabled={updatingSeatId === event.id}
                className="px-4 py-1 bg-blue-600 rounded"
              >
                {updatingSeatId === event.id ? "Updating..." : "Add Seats"}
              </button>

              <button
                onClick={(e) =>
                  toggleRegistration(e, event.id, event.registration_open)
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
