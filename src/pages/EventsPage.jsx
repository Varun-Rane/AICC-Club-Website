/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import pastEvents from "../data/pastEvents";

/* 🔥 LOAD EVENT IMAGES */
const eventImages = import.meta.glob(
  "../assets/events/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  }
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
const ImageModal = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.img
        key={index}
        src={images[index]}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl"
      >
        ✕
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-6 text-white text-4xl"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-6 text-white text-4xl"
          >
            ›
          </button>
        </>
      )}
    </motion.div>
  );
};

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

  const resolvedImage = eventImages[`../assets/${images[index]}`];

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
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
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
            images={images.map(
              (img) => eventImages[`../assets/${img}`]
            )}
            startIndex={index}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
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

  const handleRegisterClick = async (event) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    setSelectedEvent(event);
  };

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
      {/* UPCOMING EVENTS */}
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
                    onClick={() => handleRegisterClick(event)}
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

      {/* PAST EVENTS */}
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
