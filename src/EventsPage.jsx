/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { supabase } from "./supabaseClient";

/* ================= LOADER ================= */
const EventsLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-pink-500/30 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-400 text-sm tracking-wide">
        Loading upcoming events...
      </p>
    </div>
  );
};

/* ================= REGISTRATION MODAL ================= */
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
  const [done, setDone] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await onRegister({ ...formData, event });

    setWaitlisted(result === "WAITLISTED");
    setDone(true);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
        {!done ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Register for {event.event_name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "rollNo", "phoneNo", "email", "branch"].map((field) => (
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
                value={formData.studyingYear}
                onChange={(e) =>
                  setFormData({ ...formData, studyingYear: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-800 text-white"
              >
                <option value="">Select Studying Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>

              <input
                required
                placeholder="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-800 text-white"
              />

              <select
                required
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formformData, gender: e.target.value })
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
              {waitlisted
                ? "You are on the waiting list. Ticket will be generated when seats are available."
                : "Your ticket has been generated successfully."}
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

/* ================= EVENTS PAGE ================= */
const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setLoadingEvents(true);
      const today = new Date().toISOString();

      // ✅ FETCH ALL UPCOMING EVENTS (OPEN + CLOSED)
      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("date", today)
        .order("date", { ascending: true });

      setUpcomingEvents(data || []);
      setLoadingEvents(false);
    };

    fetchUpcomingEvents();
  }, []);

  /* ===== REGISTER LOGIC ===== */
  const handleRegister = async ({
    event,
    name,
    email,
    phoneNo,
    branch,
    studyingYear,
    department,
    gender,
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const { error } = await supabase.rpc("register_for_event", {
      event_id_input: event.id,
      user_id_input: user.id,
      name_input: name,
      email_input: email,
      phone_input: phoneNo,
      branch_input: branch,
      year_input: studyingYear,
      dept_input: department,
      gender_input: gender,
    });

    if (error) {
      alert(error.message);
      return;
    }

    return "SUCCESS";
  };

  return (
    <div className="bg-gray-900 text-white pt-24 px-4 pb-24">
      <section className="max-w-6xl mx-auto my-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Upcoming Events
        </h2>

        {loadingEvents ? (
          <EventsLoader />
        ) : (
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

                {event.registration_open ? (
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="mt-4 bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded-lg"
                  >
                    Register
                  </button>
                ) : (
                  <p className="mt-4 text-red-400 font-medium">
                    Registration Closed
                  </p>
                )}
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        )}
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
