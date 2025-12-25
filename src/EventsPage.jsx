/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { supabase } from "./supabaseClient";

/* ================= PAST EVENT CARD (ASPECT RATIO FIXED) ================= */
const EventCard = ({ title, date, description, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-gray-800 rounded-xl shadow-lg overflow-hidden
                 w-full max-w-md mx-auto flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-pink-400 text-sm mt-1">{date}</p>
        <p className="text-gray-300 text-sm mt-3 line-clamp-3">
          {description}
        </p>
      </div>
    </motion.div>
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
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const id = crypto.randomUUID();
    setTicketId(id);

    await onRegister({ ...formData, event, ticketId: id });
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
              <span className="text-pink-400 font-semibold">{ticketId}</span>
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

  /* FETCH UPCOMING EVENTS */
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("registration_open", true)
        .order("date", { ascending: true });

      if (!error) setUpcomingEvents(data || []);
    };

    fetchUpcomingEvents();
  }, []);

  /* REGISTER EVENT */
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login first");

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

    if (error) alert("Registration failed");
  };

  /* ORIGINAL 4 PAST EVENTS */
  const pastEvents = [
    {
      title: "AI Chatbot Competition",
      date: "19 Sept 2024",
      description:
        "A 24-hour hackathon where participants built AI chatbots to solve real-world problems.",
      images: [
        "/assets/events/chatbot1.png",
        "/assets/events/chatbot2.png",
        "/assets/events/chatbot3.png",
      ],
    },
    {
      title: "CodeVista 5.0",
      date: "25–28 Feb 2024",
      description:
        "National-level coding competition with quiz and offline coding rounds.",
      images: [
        "/assets/events/codevista1.png",
        "/assets/events/codevista2.png",
        "/assets/events/codevista3.png",
      ],
    },
    {
      title: "Gen AI Workshop",
      date: "01 Feb 2024",
      description:
        "Hands-on workshop focused on Generative AI tools and real-world use cases.",
      images: [
        "/assets/events/genAI1.png",
        "/assets/events/genAI2.png",
        "/assets/events/genAI3.png",
      ],
    },
    {
      title: "AI Tools & Prompt Engineering",
      date: "23 Aug 2024",
      description:
        "Interactive session on modern AI tools and prompt engineering techniques.",
      images: [
        "/assets/events/prompt1.png",
        "/assets/events/prompt2.png",
        "/assets/events/prompt3.png",
      ],
    },
  ];

  return (
    <div className="bg-gray-900 text-white pt-24 px-4 pb-24">
      {/* UPCOMING EVENTS */}
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

      {/* PAST EVENTS */}
      <section className="max-w-6xl mx-auto my-16 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12
            bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          Past Events
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {pastEvents.map((event, index) => (
            <EventCard key={index} {...event} />
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
