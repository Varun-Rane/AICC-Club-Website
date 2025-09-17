/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

// --- Registration Modal ---
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
    onRegister({ ...formData, event, ticketId: id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
        {!isRegistered ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Register for {event.name}
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
                  type="text"
                  placeholder={field}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full p-2 rounded-lg bg-gray-800 text-white"
                  required
                />
              ))}
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-gray-800 text-white"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg"
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
            <p className="text-gray-300 mb-4">
              Your ticket ID:{" "}
              <span className="font-bold text-pink-400">{ticketId}</span>
            </p>
            <div className="bg-white p-4 rounded-lg mb-4">
              <QRCode value={JSON.stringify({ ...formData, event, ticketId })} />
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// --- Event Card with Automatic Slideshow + Dots ---
const EventCard = ({ title, date, description, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  // Auto slideshow effect
  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000); // 3 seconds per slide
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800 rounded-xl p-6 shadow-lg overflow-hidden"
    >
      {images && images.length > 0 && (
        <div className="relative mb-4">
          <img
            src={images[currentIndex]}
            alt={`${title} - ${currentIndex}`}
            className="w-full h-64 md:h-80 object-cover rounded-xl transition-all duration-500"
          />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === idx ? "bg-white" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-pink-400 mb-4">{date}</p>
      <p className="text-gray-300 mb-4">{description}</p>
    </motion.div>
  );
};

// --- Events Page ---
const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);

  // Past events with 3 images each
  const pastEvents = [
    {
      title: "AI Workshop 2023",
      date: "Sun Oct 15 2023",
      description: "A hands-on workshop covering the basics of AI and ML.",
      images: [
        "https://via.placeholder.com/600x400/FFB74D/000000?text=AI+Workshop+2023+Slide1",
        "https://via.placeholder.com/600x400/FF9800/FFFFFF?text=AI+Workshop+2023+Slide2",
        "https://via.placeholder.com/600x400/F57C00/FFFFFF?text=AI+Workshop+2023+Slide3",
      ],
    },
    {
      title: "Hackathon 2023",
      date: "Sun Dec 10 2023",
      description:
        "A 24-hour hackathon focused on solving real-world problems with AI.",
      images: [
        "https://via.placeholder.com/600x400/3F51B5/FFFFFF?text=Hackathon+2023+Slide1",
        "https://via.placeholder.com/600x400/283593/FFFFFF?text=Hackathon+2023+Slide2",
        "https://via.placeholder.com/600x400/1A237E/FFFFFF?text=Hackathon+2023+Slide3",
      ],
    },
    {
      title: "Data Science Bootcamp",
      date: "Tue Mar 05 2024",
      description: "An intensive bootcamp on data science and analytics.",
      images: [
        "https://via.placeholder.com/600x400/009688/FFFFFF?text=Data+Science+Bootcamp+Slide1",
        "https://via.placeholder.com/600x400/00796B/FFFFFF?text=Data+Science+Bootcamp+Slide2",
        "https://via.placeholder.com/600x400/004D40/FFFFFF?text=Data+Science+Bootcamp+Slide3",
      ],
    },
    {
      title: "Machine Learning Symposium",
      date: "Sat May 18 2024",
      description: "Talks and discussions on the latest in machine learning.",
      images: [
        "https://via.placeholder.com/600x400/4CAF50/FFFFFF?text=ML+Symposium+Slide1",
        "https://via.placeholder.com/600x400/2E7D32/FFFFFF?text=ML+Symposium+Slide2",
        "https://via.placeholder.com/600x400/1B5E20/FFFFFF?text=ML+Symposium+Slide3",
      ],
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        const now = new Date();
        const upcoming = data.filter((event) => new Date(event.date) >= now);
        setFutureEvents(upcoming);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = (event) => setSelectedEvent(event);
  const handleCloseModal = () => setSelectedEvent(null);
  const handleRegistrationSubmit = (registrationData) => {
    const updated = [...registrations, registrationData];
    setRegistrations(updated);
    localStorage.setItem("registrations", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-8 px-4">
      <section className="max-w-6xl mx-auto text-center py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          Events
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-lg text-gray-300"
        >
          Explore our past and upcoming events created by admins.
        </motion.p>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto my-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          Upcoming Events
        </motion.h2>
        <VerticalTimeline>
          {futureEvents.map((event, index) => (
            <VerticalTimelineElement
              key={index}
              contentStyle={{ background: "#1e293b", color: "#fff" }}
              contentArrowStyle={{ borderRight: "7px solid #1e293b" }}
              date={new Date(event.date).toDateString()}
              iconStyle={{ background: "#ec4899", color: "#fff" }}
              icon={
                event.posterImage ? (
                  <img
                    src={event.posterImage}
                    alt={event.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : null
              }
            >
              {event.posterImage && (
                <img
                  src={event.posterImage}
                  alt={event.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold">{event.name}</h3>
              <p className="text-gray-300 my-2">{event.description}</p>

              {event.registrationOpen && (
                <button
                  onClick={() => handleRegister(event)}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Register
                </button>
              )}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </section>

      {/* Past Events */}
      <section className="max-w-6xl mx-auto my-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          Past Events
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastEvents.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              date={event.date}
              description={event.description}
              images={event.images}
            />
          ))}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onRegister={handleRegistrationSubmit}
        />
      )}
    </div>
  );
};

export default EventsPage;
