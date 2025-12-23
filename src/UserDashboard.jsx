/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { FiDownload, FiUser, FiCalendar, FiMail, FiPhone, FiBook, FiAward, FiX } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { createClient } from '@supabase/supabase-js';

// ================= Supabase Setup =================
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const UserDashboard = ({ user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch registrations for the logged-in user
  useEffect(() => {
    const fetchRegistrations = async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*, event:events(*)") // join with events table
        .eq("email", user.email);

      if (error) {
        console.error("Error fetching registrations:", error);
      } else {
        setRegistrations(data);
      }
      setIsLoading(false);
    };

    if (user?.email) {
      fetchRegistrations();
    }
  }, [user]);

  // Ticket handling
  const downloadTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeTicketPreview = () => {
    setSelectedTicket(null);
  };

  const handleDownload = () => {
    const ticketElement = document.getElementById('ticket-to-download');
    if (ticketElement) {
      html2canvas(ticketElement, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `AICC-Ticket-${selectedTicket.ticket_id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        closeTicketPreview();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      {/* User Information Section */}
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
              <div className="flex items-center gap-4">
                <FiUser className="text-pink-400 text-xl" />
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiMail className="text-pink-400 text-xl" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiPhone className="text-pink-400 text-xl" />
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-medium">{user.phoneNo}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FiBook className="text-pink-400 text-xl" />
                <div>
                  <p className="text-gray-400">Branch</p>
                  <p className="font-medium">{user.branch}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiAward className="text-pink-400 text-xl" />
                <div>
                  <p className="text-gray-400">Studying Year</p>
                  <p className="font-medium">{user.studyingYear}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiCalendar className="text-pink-400 text-xl" />
                <div>
                  <p className="text-gray-400">Department</p>
                  <p className="font-medium">{user.department}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Registered Events Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Your Registered Events
        </h2>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700 text-center"
          >
            <p className="text-gray-400">Loading your registrations...</p>
          </motion.div>
        ) : registrations.length > 0 ? (
          <div className="space-y-6">
            {registrations.map((registration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{registration.event.event_name}</h3>
                    <p className="text-gray-400 mt-1">{registration.event.date}</p>
                    <p className="text-gray-300 mt-2">{registration.event.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => downloadTicket(registration)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform"
                    >
                      <FiDownload /> Download Ticket
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700 text-center"
          >
            <p className="text-gray-400">You haven't registered for any events yet.</p>
          </motion.div>
        )}
      </div>

      {/* Ticket Preview Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div
            id="ticket-to-download"
            className="bg-white text-black rounded-xl p-8 max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={closeTicketPreview}
              className="absolute top-4 right-4 text-gray-600 hover:text-black transition-colors"
            >
              <FiX size={20} />
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-pink-600">AI Coding Club</h2>
              <p className="text-gray-600">Event Ticket</p>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Event:</span>
                <span className="font-medium">{selectedTicket.event.event_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedTicket.event.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{selectedTicket.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket ID:</span>
                <span className="font-bold text-pink-600">{selectedTicket.ticket_id}</span>
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <QRCode
                value={JSON.stringify({
                  name: selectedTicket.name,
                  ticketId: selectedTicket.ticket_id,
                  event: selectedTicket.event.event_name,
                  date: selectedTicket.event.date
                })}
                size={128}
              />
            </div>
            <div className="text-center text-xs text-gray-500">
              <p>Present this ticket at the event entrance</p>
              <p className="mt-1">© AI Coding Club 2025</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform"
              >
                <FiDownload /> Download Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
