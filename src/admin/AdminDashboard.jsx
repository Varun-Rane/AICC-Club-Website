/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import { supabase } from "../utils/supabaseClient";

/* ================= CONSTANTS ================= */
const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f97316", "#a855f7"];

/* ================= SVG → PNG ================= */
const downloadSvgAsPng = (svg, fileName) => {
  if (!svg) return;

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  const blob = new Blob([svgStr], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;
    ctx.scale(2, 2);
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((png) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(png);
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  img.src = url;
};

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

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("registrations")
      .select(`
        id,
        name,
        email,
        phone,
        branch,
        studying_year,
        department,
        gender,
        ticket_id,
        events (
          event_name,
          date
        )
      `);

    setRegistrations(data || []);
    setLoading(false);
  };

  /* ================= FILTER ================= */
  const eventList = useMemo(() => {
    const set = new Set();
    registrations.forEach(
      (r) => r.events?.event_name && set.add(r.events.event_name)
    );
    return ["ALL", ...Array.from(set)];
  }, [registrations]);

  const filtered = useMemo(() => {
    if (selectedEvent === "ALL") return registrations;
    return registrations.filter(
      (r) => r.events?.event_name === selectedEvent
    );
  }, [registrations, selectedEvent]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const byBranch = {};
    const byYear = {};
    const byDepartment = {};
    const byGender = {};

    filtered.forEach((r) => {
      if (r.branch) byBranch[r.branch] = (byBranch[r.branch] || 0) + 1;
      if (r.studying_year)
        byYear[r.studying_year] = (byYear[r.studying_year] || 0) + 1;
      if (r.department)
        byDepartment[r.department] =
          (byDepartment[r.department] || 0) + 1;
      if (r.gender) byGender[r.gender] = (byGender[r.gender] || 0) + 1;
    });

    return { byBranch, byYear, byDepartment, byGender };
  }, [filtered]);

  const makePieData = (obj) => {
    const entries = Object.entries(obj);
    if (entries.length === 0) return [];
    if (entries.length === 1)
      return [
        { name: entries[0][0], value: entries[0][1] },
        { name: "", value: 0.0001 },
      ];
    return entries.map(([name, value]) => ({ name, value }));
  };

  /* ================= EXPORT EXCEL ================= */
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
        Gender: r.gender,
        Event: r.events?.event_name,
        Ticket: r.ticket_id,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Registrations");
    XLSX.writeFile(wb, "AICC_Registrations.xlsx");
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <PieCard title="Branch Distribution" data={makePieData(stats.byBranch)} />
        <PieCard title="Year Distribution" data={makePieData(stats.byYear)} />
        <PieCard
          title="Department Distribution"
          data={makePieData(stats.byDepartment)}
        />
        <PieCard title="Gender Distribution" data={makePieData(stats.byGender)} />
      </div>

      {/* TABLE */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700">
            <tr>
              {[
                "#",
                "Name",
                "Email",
                "Phone",
                "Branch",
                "Year",
                "Department",
                "Gender",
                "Event",
                "Ticket",
              ].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={r.id}
                className="border-t border-gray-700 hover:bg-gray-700/40"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.phone}</td>
                <td className="px-4 py-2">{r.branch}</td>
                <td className="px-4 py-2">{r.studying_year}</td>
                <td className="px-4 py-2">{r.department}</td>
                <td className="px-4 py-2">{r.gender}</td>
                <td className="px-4 py-2">{r.events?.event_name}</td>
                <td className="px-4 py-2">{r.ticket_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= PIE CARD ================= */
const PieCard = ({ title, data }) => {
  const chartRef = useRef(null);

  const handleDownload = () => {
    const svg = chartRef.current?.querySelector("svg");
    downloadSvgAsPng(svg, `${title.replace(/\s/g, "_")}.png`);
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 h-[320px] flex flex-col">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h3 className="text-base font-semibold">{title}</h3>
        <button
          onClick={handleDownload}
          className="text-sm flex items-center gap-1 text-pink-400 hover:text-pink-300"
        >
          <FiDownload /> Download
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-gray-400 text-sm mt-6">No data</p>
      ) : (
        <div
          ref={chartRef}
          className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg p-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                label={({ percent }) =>
                  percent > 0 ? `${(percent * 100).toFixed(1)}%` : ""
                }
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
