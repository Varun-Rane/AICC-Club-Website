/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
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
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `TICKET-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
    setTicketId(id);
    setIsRegistered(true);
    onRegister?.({ ...formData, event, ticketId: id });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
        {!isRegistered ? (
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
                  className="bg-gradient-to-r from-pink-500 to-orange-500 px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Registration Successful!
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

/* ================= Past Event Card (FIXED SIZE) ================= */
const EventCard = ({ title, date, description, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(
        () => setCurrentIndex((i) => (i + 1) % images.length),
        3000
      );
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="
        bg-gray-800 rounded-xl shadow-lg overflow-hidden
        w-full max-w-md mx-auto
        h-[420px] flex flex-col
      "
    >
      {/* IMAGE SLIDESHOW */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* DOTS */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                idx === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-pink-400 text-sm mt-1">{date}</p>
        <p className="text-gray-300 text-sm mt-3 line-clamp-3">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

/* ================= Events Page ================= */
const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  /* 🔥 Upcoming Events from Supabase */
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("registration_open", true)
        .order("date", { ascending: true });

      if (data) setUpcomingEvents(data);
    };

    fetchUpcomingEvents();
  }, []);

  /* ✅ PAST EVENTS (4 cards with slideshow) */
  const pastEvents = [
    {
      title: "AI chatbot competition",
      date: "19 Sept 2025",
      description:
        "A 24-hour hackathon where participants built AI chatbots to solve real-world problems.",
      images: [
        "../assets/events/chatbot1.png",
        "../assets/events/chatbot2.png",
        "../assets/events/chatbot3.png",
      ],
    },
    {
      title: "CodeVista 5.0",
      date: "25-28 Feb 2025",
      description:
        "A national-level coding event with online quiz and offline coding rounds.",
      images: [
        "../assets/events/codevista1.png",
        "../assets/events/codevista2.png",
        "../assets/events/codevista3.png",
      ],
    },
    {
      title: "Gen AI workshop",
      date: "01 Feb 2025",
      description:
        "Hands-on bootcamp focused on data science, analytics and GenAI tools.",
      images: [
        "../assets/events/genAI1.png",
        "../assets/events/genAI2.png",
        "../assets/events/genAI3.png",
      ],
    },
    {
      title: "AI tools & prompt engineering",
      date: "23 Aug 2025",
      description:
        "Interactive session on AI tools, prompt engineering and best practices.",
      images: [
        "../assets/events/prompt1.png",
        "../assets/events/prompt2.png",
        "../assets/events/prompt3.png",
      ],
    },
  ];

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

      {/* Past Events */}
      <section className="max-w-6xl mx-auto my-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Past Events
        </h2>

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
        />
      )}
    </div>
  );
};

export default EventsPage;
