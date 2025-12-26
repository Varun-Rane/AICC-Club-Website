/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FiDownload, FiTrash2, FiUser } from "react-icons/fi";
import * as XLSX from "xlsx";
import { supabase } from "./supabaseClient";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("registrations")
      .select(`
        id,
        name,
        email,
        phone,
        branch,
        studying_year,
        ticket_id,
        events!registrations_event_id_fkey (
          id,
          event_name,
          date
        )
      `);

    if (error) {
      console.error("Supabase error:", error);
      setLoading(false);
      return;
    }

    setRegistrations(data || []);
    setLoading(false);
  };

  // ================= UNIQUE EVENTS =================
  const eventList = useMemo(() => {
    const set = new Set();
    registrations.forEach((r) => {
      if (r.events?.event_name) {
        set.add(r.events.event_name);
      }
    });
    return ["ALL", ...Array.from(set)];
  }, [registrations]);

  // ================= FILTER BY EVENT =================
  const filteredRegistrations = useMemo(() => {
    if (selectedEvent === "ALL") return registrations;
    return registrations.filter(
      (r) => r.events?.event_name === selectedEvent
    );
  }, [registrations, selectedEvent]);

  // ================= STATS =================
  const stats = useMemo(() => {
    const byBranch = {};

    filteredRegistrations.forEach((r) => {
      byBranch[r.branch] = (byBranch[r.branch] || 0) + 1;
    });

    return {
      total: filteredRegistrations.length,
      byBranch,
    };
  }, [filteredRegistrations]);

  const branchChartData = Object.entries(stats.byBranch).map(
    ([name, value]) => ({ name, value })
  );

  // ================= EXCEL =================
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(
      filteredRegistrations.map((r, i) => ({
        "S.No": i + 1,
        Name: r.name,
        Email: r.email,
        Phone: r.phone,
        Branch: r.branch,
        Year: r.studying_year,
        Event: r.events?.event_name,
        Date: r.events?.date,
        Ticket: r.ticket_id,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Registrations");
    XLSX.writeFile(
      wb,
      selectedEvent === "ALL"
        ? "AICC_All_Registrations.xlsx"
        : `${selectedEvent}_Registrations.xlsx`
    );
  };

  // ================= DELETE =================
  const deleteRegistration = async (id) => {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);

    if (!error) {
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 pt-28">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <button
          onClick={exportExcel}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center gap-2"
        >
          <FiDownload /> Export Excel
        </button>
      </div>

      {/* EVENT DROPDOWN */}
      <div className="mb-8 max-w-sm">
        <label className="block mb-2 text-gray-400">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg"
        >
          {eventList.map((event) => (
            <option key={event} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Registrations" value={stats.total} />
        <StatCard label="Selected Event" value={selectedEvent} />
        <StatCard
          label="Branches"
          value={Object.keys(stats.byBranch).length}
        />
      </div>

      {/* BRANCH-WISE CHART */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-12 h-96">
        <h2 className="text-xl font-bold mb-4">
          Branch-wise Registrations
        </h2>

        {branchChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400">No data for this event</p>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Ticket</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((r) => (
              <tr key={r.id} className="border-t border-gray-700/50">
                <td className="px-6 py-3 flex items-center gap-2">
                  <FiUser className="text-pink-400" />
                  {r.name}
                </td>
                <td className="px-6 py-3 text-blue-300">{r.email}</td>
                <td className="px-6 py-3">{r.events?.event_name}</td>
                <td className="px-6 py-3 text-pink-400">{r.ticket_id}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => deleteRegistration(r.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}

            {filteredRegistrations.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No registrations for this event
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ================= CARD =================
const StatCard = ({ label, value }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
    <p className="text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-pink-400 truncate">{value}</p>
  </div>
);

export default AdminDashboard;
