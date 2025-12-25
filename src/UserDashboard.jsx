/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  FiDownload,
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiBook,
  FiAward,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import html2canvas from "html2canvas";
import { createClient } from "@supabase/supabase-js";

// ================= Supabase Setup =================
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const UserDashboard = ({ user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ================= FETCH USER REGISTRATIONS =================
  useEffect(() => {
    const fetchRegistrations = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!authUser || authError) {
        console.error("Auth error:", authError);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("registrations")
        .select(
          `
          *,
          event:events(*)
        `
        )
        .eq("user_id", authUser.id);

      if (error) {
        console.error("Error fetching registrations:", error);
      } else {
        setRegistrations(data || []);
      }

      setIsLoading(false);
    };

    fetchRegistrations();
  }, []);

  // ================= EVENT DATE CHECK (NEW) =================
  const isEventOver = (eventDate) => {
    const today = new Date();
    const eventDay = new Date(eventDate);

    today.setHours(0, 0, 0, 0);
    eventDay.setHours(0, 0, 0, 0);

    return eventDay < today;
  };

  // ================= DELETE TICKET (NEW) =================
  const deleteTicket = async (registrationId) => {
    const ok = window.confirm("Event is over. Delete this ticket?");
    if (!ok) return;

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", registrationId);

    if (error) {
      console.error(error);
      alert("Failed to delete ticket");
    } else {
      setRegistrations((prev) =>
        prev.filter((r) => r.id !== registrationId)
      );
    }
  };

  // ================= TICKET HANDLING =================
  const downloadTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeTicketPreview = () => {
    setSelectedTicket(null);
  };

  const handleDownload = async () => {
    const ticketElement = document.getElementById("ticket-to-download");
    if (!ticketElement) return;

    const canvas = await html2canvas(ticketElement, { scale: 2 });
    const link = document.createElement("a");
    link.download = `AICC-Ticket-${selectedTicket.ticket_id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    closeTicketPreview();
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      {/* ================= PROFILE ================= */}
      <div className="max-w-6xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
            Your Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Info icon={<FiUser />} label="Name" value={user.name} />
              <Info icon={<FiMail />} label="Email" value={user.email} />
              <Info icon={<FiPhone />} label="Phone" value={user.phoneNo} />
            </div>

            <div className="space-y-4">
              <Info icon={<FiBook />} label="Branch" value={user.branch} />
              <Info
                icon={<FiAward />}
                label="Studying Year"
                value={user.studyingYear}
              />
              <Info
                icon={<FiCalendar />}
                label="Department"
                value={user.department}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= REGISTERED EVENTS ================= */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Your Registered Events
        </h2>

        {isLoading ? (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
            Loading your registrations...
          </div>
        ) : registrations.length > 0 ? (
          <div className="space-y-6">
            {registrations.map((reg, index) => {
              const eventCompleted = isEventOver(reg.event.date);

              return (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {reg.event.event_name}
                      </h3>
                      <p className="text-gray-400">{reg.event.date}</p>
                      <p className="text-gray-300 mt-2">
                        {reg.event.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!eventCompleted && (
                        <button
                          onClick={() => downloadTicket(reg)}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg hover:scale-105 transition"
                        >
                          <FiDownload className="inline mr-2" />
                          Download Ticket
                        </button>
                      )}

                      {eventCompleted && (
                        <button
                          onClick={() => deleteTicket(reg.id)}
                          className="px-4 py-2 text-red-400 hover:text-red-500 flex items-center gap-2"
                        >
                          <FiTrash2 />
                          Delete Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
            You haven't registered for any events yet.
          </div>
        )}
      </div>

      {/* ================= TICKET MODAL ================= */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div
            id="ticket-to-download"
            className="bg-white text-black rounded-xl p-8 w-full max-w-md relative"
          >
            <button
              onClick={closeTicketPreview}
              className="absolute top-4 right-4"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-center text-2xl font-bold text-pink-600">
              AI Coding Club
            </h2>
            <p className="text-center text-gray-600 mb-4">Event Ticket</p>

            <TicketRow
              label="Event"
              value={selectedTicket.event.event_name}
            />
            <TicketRow label="Date" value={selectedTicket.event.date} />
            <TicketRow label="Name" value={selectedTicket.name} />
            <TicketRow
              label="Ticket ID"
              value={selectedTicket.ticket_id}
              bold
            />

            <div className="flex justify-center my-4">
              <QRCode
                size={128}
                value={JSON.stringify({
                  ticketId: selectedTicket.ticket_id,
                  name: selectedTicket.name,
                  event: selectedTicket.event.event_name,
                })}
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg"
            >
              <FiDownload className="inline mr-2" />
              Download Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= SMALL COMPONENTS =================
const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="text-pink-400 text-xl">{icon}</div>
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const TicketRow = ({ label, value, bold }) => (
  <div className="flex justify-between mb-2">
    <span className="text-gray-600">{label}:</span>
    <span className={bold ? "font-bold text-pink-600" : "font-medium"}>
      {value}
    </span>
  </div>
);

export default UserDashboard;
