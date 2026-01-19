/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { supabase } from "../utils/supabaseClient";
import pastEvents from "../data/pastEvents";
import { useNavigate } from "react-router-dom";

/* ================= IMAGE MAP (VITE SAFE) ================= */
const eventImages = import.meta.glob(
  "../assets/events/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" }
);

/* ================= LOADER ================= */
const EventsLoader = () => (
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

/* ================= IMAGE MODAL ================= */
const ImageModal = ({ src, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
    onClick={onClose}
  >
    <motion.img
      src={src}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
    <button
      onClick={onClose}
      className="absolute top-6 right-6 text-white text-3xl"
    >
      ✕
    </button>
  </motion.div>
);

/* ================= PAST EVENT CARD ================= */
const EventCard = ({ title, date, description, images }) => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [images]);

  const resolvedImage =
    eventImages[`../assets/${images[index]}`];

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
      >
        <div
          className="relative h-48 overflow-hidden"
          onClick={() => setOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={resolvedImage}
              alt={title}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-pink-400 text-sm">{date}</p>
          <p className="text-gray-300 text-sm mt-2">{description}</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <ImageModal
            src={resolvedImage}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
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

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const success = await onRegister({ ...formData, event });
    if (success) setDone(true);

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
        {!done ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Register for {event.event_name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "rollNo", "phoneNo", "email", "branch"].map((f) => (
                <input
                  key={f}
                  required
                  placeholder={f}
                  value={formData[f]}
                  onChange={(e) =>
                    setFormData({ ...formData, [f]: e.target.value })
                  }
                  className="w-full p-2 rounded bg-gray-800"
                />
              ))}

              <select
                required
                value={formData.studyingYear}
                onChange={(e) =>
                  setFormData({ ...formData, studyingYear: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800"
              >
                <option value="">Select Studying Year</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
              </select>

              <input
                required
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800"
              />

              <select
                required
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">Registration Successful 🎉</h2>
            <button
              onClick={onClose}
              className="mt-4 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-2 rounded"
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
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const today = new Date().toISOString();

      const { data: events } = await supabase
        .from("events")
        .select("*")
        .gte("date", today)
        .order("date", { ascending: true });

      setUpcomingEvents(events || []);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("registrations")
          .select("event_id")
          .eq("user_id", user.id);

        setRegisteredIds(data?.map((r) => r.event_id) || []);
      }

      setLoading(false);
    };

    loadData();
  }, []);

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

    if (!user) return false;

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
      return false;
    }

    setRegisteredIds((prev) => [...prev, event.id]);
    return true;
  };

  return (
    <div className="bg-gray-900 text-white pt-24 pb-24 px-4">
      <section className="max-w-6xl mx-auto my-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Upcoming Events
        </h2>

        {loading ? (
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
                <h3 className="text-xl font-bold">{event.event_name}</h3>
                <p className="text-gray-300">{event.description}</p>

                {registeredIds.includes(event.id) ? (
                  <button
                    disabled
                    className="mt-4 px-4 py-2 bg-gray-700 text-gray-400 rounded cursor-not-allowed"
                  >
                    Already Registered
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      const {
                        data: { user },
                      } = await supabase.auth.getUser();

                      if (!user) {
                        navigate("/auth");
                        return;
                      }

                      setSelectedEvent(event);
                    }}
                    className="mt-4 bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded"
                  >
                    Register
                  </button>
                )}
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        )}
      </section>

      <section className="max-w-6xl mx-auto my-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Past Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastEvents.map((e, i) => (
            <EventCard key={i} {...e} />
          ))}
        </div>
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
