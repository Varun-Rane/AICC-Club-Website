/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiDownload, FiTrash2, FiUser } from "react-icons/fi";
import * as XLSX from "xlsx";
import { supabase } from "./supabaseClient";

/* ================= CONSTANTS ================= */
const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f97316", "#a855f7"];

/* ================= LOADER ================= */
const DashboardLoader = () => (
  <div className="min-h-screen bg-gray-900 p-10 pt-28 animate-pulse">
    <div className="h-10 w-64 bg-gray-700 rounded mb-10" />

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 bg-gray-800 rounded-xl" />
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-80 bg-gray-800 rounded-xl" />
      ))}
    </div>
  </div>
);

/* ================= MAIN ================= */
const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("ALL");
  const [loading, setLoading] = useState(true);

  /* ========== FETCH ========== */
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
        department,
        ticket_id,
        event_id,
        events!registrations_event_id_fkey (
          event_name,
          date
        )
      `);

    if (!error) setRegistrations(data || []);
    setLoading(false);
  };

  /* ========== EVENTS LIST ========== */
  const eventList = useMemo(() => {
    const set = new Set();
    registrations.forEach((r) => r.events?.event_name && set.add(r.events.event_name));
    return ["ALL", ...Array.from(set)];
  }, [registrations]);

  /* ========== FILTER ========== */
  const filtered = useMemo(() => {
    if (selectedEvent === "ALL") return registrations;
    return registrations.filter(
      (r) => r.events?.event_name === selectedEvent
    );
  }, [registrations, selectedEvent]);

  /* ========== STATS ========== */
  const stats = useMemo(() => {
    const byBranch = {};
    const byYear = {};
    const byDepartment = {};
    const byGender = {}; // future ready

    filtered.forEach((r) => {
      if (r.branch) byBranch[r.branch] = (byBranch[r.branch] || 0) + 1;
      if (r.studying_year) byYear[r.studying_year] = (byYear[r.studying_year] || 0) + 1;
      if (r.department) byDepartment[r.department] = (byDepartment[r.department] || 0) + 1;
    });

    return { byBranch, byYear, byDepartment, byGender };
  }, [filtered]);

  /* ========== PIE SAFE DATA (IMPORTANT FIX) ========== */
  const makePieData = (obj) => {
    const total = Object.values(obj).reduce((a, b) => a + b, 0);
    const entries = Object.entries(obj);

    if (entries.length === 1) {
      return [
        { name: entries[0][0], value: entries[0][1] },
        { name: "", value: 0.0001 }, // invisible slice
      ];
    }

    return entries.map(([name, value]) => ({ name, value }));
  };

  const branchData = makePieData(stats.byBranch);
  const yearData = makePieData(stats.byYear);
  const departmentData = makePieData(stats.byDepartment);
  const genderData = makePieData(stats.byGender);

  /* ========== EXPORT ========== */
  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(
      filtered.map((r, i) => ({
        "S.No": i + 1,
        Name: r.name,
        Email: r.email,
        Phone: r.phone,
        Branch: r.branch,
        Year: r.studying_year,
        Department: r.department,
        Event: r.events?.event_name,
        Ticket: r.ticket_id,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Registrations");
    XLSX.writeFile(wb, "AICC_Registrations.xlsx");
  };

  /* ========== DELETE ========== */
  const deleteRegistration = async (id) => {
    await supabase.from("registrations").delete().eq("id", id);
    setRegistrations((p) => p.filter((r) => r.id !== id));
  };

  if (loading) return <DashboardLoader />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 pt-28">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-pink-400">Admin Dashboard</h1>
        <button
          onClick={exportExcel}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center gap-2"
        >
          <FiDownload /> Export Excel
        </button>
      </div>

      {/* EVENT SELECT */}
      <div className="mb-8 max-w-sm">
        <label className="block mb-2 text-gray-400">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded-lg"
        >
          {eventList.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total" value={filtered.length} />
        <StatCard label="Branches" value={Object.keys(stats.byBranch).length} />
        <StatCard label="Departments" value={Object.keys(stats.byDepartment).length} />
        <StatCard label="Gender Types" value={Object.keys(stats.byGender).length} />
      </div>

      {/* PIE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <PieCard title="Branch Distribution" data={branchData} />
        <PieCard title="Year Distribution" data={yearData} />
        <PieCard title="Department Distribution" data={departmentData} />
        <PieCard title="Gender Distribution" data={genderData} />
      </div>

      {/* TABLE */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Branch</th>
              <th>Year</th>
              <th>Department</th>
              <th>Event</th>
              <th>Ticket</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="px-4 py-2 flex gap-2">
                  <FiUser /> {r.name}
                </td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>{r.branch}</td>
                <td>{r.studying_year}</td>
                <td>{r.department}</td>
                <td>{r.events?.event_name}</td>
                <td className="text-pink-400">{r.ticket_id}</td>
                <td>
                  <button onClick={() => deleteRegistration(r.id)}>
                    <FiTrash2 className="text-red-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ label, value }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
    <p className="text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-pink-400">{value}</p>
  </div>
);

const PieCard = ({ title, data }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-80">
    <h3 className="text-lg font-bold mb-2">{title}</h3>

    {data.length === 0 ? (
      <p className="text-gray-400">No data</p>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="45%"
            cy="50%"
            outerRadius={90}
            label={({ percent }) =>
              percent > 0 ? `${(percent * 100).toFixed(1)}%` : ""
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default AdminDashboard;
