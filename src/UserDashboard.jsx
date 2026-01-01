/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiBook,
  FiAward,
  FiTrash2,
} from "react-icons/fi";
import QRCode from "qrcode";
import { createClient } from "@supabase/supabase-js";

/* ================= SUPABASE ================= */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return setIsLoading(false);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const { data: regs } = await supabase
        .from("registrations")
        .select(`*, event:events(*)`)
        .eq("user_id", user.id);

      setProfile(profileData);
      setRegistrations(regs || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  /* ================= DATE CHECK ================= */
  const isEventOver = (date) => {
    const today = new Date();
    const d = new Date(date);
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  /* ================= DELETE ================= */
  const deleteTicket = async (id) => {
    if (!window.confirm("Event is over. Delete this ticket?")) return;
    await supabase.from("registrations").delete().eq("id", id);
    setRegistrations((p) => p.filter((r) => r.id !== id));
  };

  /* ================= 🔥 FINAL DOWNLOAD (CANVAS) ================= */
  const downloadTicket = async (reg) => {
    if (!profile || !reg) return;

    // MAIN CANVAS
    const canvas = document.createElement("canvas");
    canvas.width = 420;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");

    /* BACKGROUND */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* TITLE */
    ctx.fillStyle = "#db2777";
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.fillText("AI Coding Club", canvas.width / 2, 40);

    /* DETAILS */
    ctx.textAlign = "left";
    ctx.fillStyle = "#111827";
    ctx.font = "16px Arial";

    ctx.fillText(`Event : ${reg.event.event_name}`, 30, 100);
    ctx.fillText(`Date  : ${reg.event.date}`, 30, 130);
    ctx.fillText(`Name  : ${profile.name}`, 30, 160);

    ctx.font = "bold 16px Arial";
    ctx.fillText(`Ticket ID : ${reg.ticket_id}`, 30, 200);

    /* QR CODE */
    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, reg.ticket_id, {
      width: 180,
      margin: 1,
    });

    ctx.drawImage(qrCanvas, 120, 240);

    /* FOOTER */
    ctx.textAlign = "center";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Show this QR at entry", canvas.width / 2, 520);

    /* DOWNLOAD */
    const link = document.createElement("a");
    link.download = `AICC-Ticket-${reg.ticket_id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  /* ================= UI ================= */
  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-28 p-8 text-center">
        Loading...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-28 p-8 text-center">
        Profile not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      {/* PROFILE */}
      <div className="max-w-6xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-pink-400">
            Your Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Info icon={<FiUser />} label="Name" value={profile.name} />
            <Info icon={<FiMail />} label="Email" value={profile.email} />
            <Info icon={<FiPhone />} label="Phone" value={profile.phone} />
            <Info icon={<FiBook />} label="Branch" value={profile.branch} />
            <Info
              icon={<FiAward />}
              label="Studying Year"
              value={profile.studying_year}
            />
            <Info
              icon={<FiCalendar />}
              label="Department"
              value={profile.department}
            />
          </div>
        </motion.div>
      </div>

      {/* EVENTS */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-pink-400">
          Your Registered Events
        </h2>

        <div className="space-y-6">
          {registrations.map((reg) => {
            const over = isEventOver(reg.event.date);
            const waitlisted = !reg.ticket_id;

            return (
              <div
                key={reg.id}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
              >
                <h3 className="text-2xl font-bold">
                  {reg.event.event_name}
                </h3>
                <p className="text-gray-400">{reg.event.date}</p>

                <div className="mt-4">
                  {waitlisted ? (
                    <p className="text-yellow-400">
                      ⏳ Waiting for seat confirmation
                    </p>
                  ) : over ? (
                    <button
                      onClick={() => deleteTicket(reg.id)}
                      className="text-red-400 flex items-center gap-2"
                    >
                      <FiTrash2 /> Delete Ticket
                    </button>
                  ) : (
                    <button
                      onClick={() => downloadTicket(reg)}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg"
                    >
                      <FiDownload className="inline mr-2" />
                      Download Ticket
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */
const Info = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="text-pink-400 text-xl">{icon}</div>
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-medium">{value ?? "-"}</p>
    </div>
  </div>
);

export default UserDashboard;
