/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { supabase } from "./supabaseClient";

/* ================= Registration Modal ================= */
const RegistrationModal = ({ event, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    phoneNo: "",
    email: "",
    branch: "",
    studyingYear: "",
    department: "",
    gender: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const id = crypto.randomUUID();
    setTicketId(id);

    await onRegister({
      ...formData,
      event,
      ticketId: id,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
        {!ticketId ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Register for {event.event_name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                "name",
                "rollNo",
                "phoneNo",
                "email",
                "branch",
                "studyingYear",
                "department",
              ].map((field) => (
                <input
                  key={field}
                  required
                  placeholder={field}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 text-white"
                />
              ))}

              <select
                required
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-800 text-white"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Registration Successful 🎉
            </h2>
            <p className="text-gray-300">
              Ticket ID:{" "}
              <span className="text-pink-400 font-semibold">
                {ticketId}
              </span>
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ================= Events Page ================= */
const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  /* 🔥 Fetch Upcoming Events */
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("registration_open", true)
        .order("date", { ascending: true });

      if (!error) setUpcomingEvents(data || []);
      else console.error(error);
    };

    fetchUpcomingEvents();
  }, []);

  /* ✅ REGISTER EVENT (THIS WAS MISSING BEFORE) */
  const handleRegister = async ({
    event,
    ticketId,
    name,
    email,
    phoneNo,
    branch,
    studyingYear,
    department,
  }) => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase.from("registrations").insert({
      user_id: user.id,
      event_id: event.id,
      name,
      email,
      phone: phoneNo,
      branch,
      studying_year: studyingYear,
      department,
      ticket_id: ticketId,
    });

    if (error) {
      console.error("Insert error:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="bg-gray-900 text-white pt-24 px-4 pb-24">
      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto my-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Upcoming Events
        </h2>

        <VerticalTimeline>
          {upcomingEvents.map((event) => (
            <VerticalTimelineElement
              key={event.id}
              date={new Date(event.date).toDateString()}
              contentStyle={{ background: "#1e293b", color: "#fff" }}
              iconStyle={{ background: "#ec4899" }}
            >
              {event.poster_url && (
                <img
                  src={event.poster_url}
                  alt={event.event_name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <h3 className="text-xl font-bold">{event.event_name}</h3>
              <p className="text-gray-300">{event.description}</p>

              <button
                onClick={() => setSelectedEvent(event)}
                className="mt-4 bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded-lg"
              >
                Register
              </button>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </section>

      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};

export default EventsPage;
