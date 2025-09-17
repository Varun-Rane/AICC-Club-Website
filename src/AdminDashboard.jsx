/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { FiDownload, FiUser, FiMail, FiPhone, FiCalendar, FiChevronDown, FiChevronUp, FiTrash2, FiPlus } from 'react-icons/fi';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newRegistration, setNewRegistration] = useState({
    name: '',
    rollNo: '',
    email: '',
    phoneNo: '',
    branch: '',
    studyingYear: '',
    department: '',
    event: { title: '', date: '', description: '' },
    ticketId: ''
  });

  useEffect(() => {
    const storedRegistrations = JSON.parse(localStorage.getItem("registrations")) || [];
    setRegistrations(storedRegistrations);
    setIsLoading(false);
  }, []);

  const filteredRegistrations = useMemo(() =>
    registrations.filter(registration =>
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [registrations, searchTerm]
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRegistrations = useMemo(() => {
    const sortableItems = [...filteredRegistrations];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredRegistrations, sortConfig]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      registrations.map(reg => ({
        'Name': reg.name,
        'Roll No': reg.rollNo,
        'Email': reg.email,
        'Phone': reg.phoneNo,
        'Event': reg.event.title,
        'Ticket ID': reg.ticketId
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "AICC_Registrations.xlsx");
  };

  const toggleQRCode = (index) => {
    setExpandedTicket(expandedTicket === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRegistration(prev => ({ ...prev, [name]: value }));
  };

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setNewRegistration(prev => ({
      ...prev,
      event: { ...prev.event, [name]: value }
    }));
  };

  const addRegistration = () => {
    if (!newRegistration.name || !newRegistration.email || !newRegistration.event.title) {
      alert('Please fill in all required fields.');
      return;
    }

    const updatedRegistrations = [...registrations, { ...newRegistration, ticketId: `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}` }];
    setRegistrations(updatedRegistrations);
    localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));
    setNewRegistration({
      name: '',
      rollNo: '',
      email: '',
      phoneNo: '',
      branch: '',
      studyingYear: '',
      department: '',
      event: { title: '', date: '', description: '' },
      ticketId: ''
    });
  };

  const deleteRegistration = (index) => {
    const updatedRegistrations = [...registrations];
    updatedRegistrations.splice(index, 1);
    setRegistrations(updatedRegistrations);
    localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      {/* Header Section */}
      <div className="max-w-full mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform"
        >
          <FiDownload /> Export to Excel
        </button>
      </div>

      {/* Add New Registration Form */}
      <div className="max-w-6xl mx-auto mb-8 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Add New Registration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={newRegistration.name}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Roll No</label>
            <input
              type="text"
              name="rollNo"
              value={newRegistration.rollNo}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={newRegistration.email}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Phone</label>
            <input
              type="text"
              name="phoneNo"
              value={newRegistration.phoneNo}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={newRegistration.branch}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Studying Year</label>
            <input
              type="text"
              name="studyingYear"
              value={newRegistration.studyingYear}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={newRegistration.department}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              value={newRegistration.event.title}
              onChange={handleEventInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Event Date</label>
            <input
              type="datetime-local"
              name="date"
              value={newRegistration.event.date}
              onChange={handleEventInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-1">Event Description</label>
            <textarea
              name="description"
              value={newRegistration.event.description}
              onChange={handleEventInputChange}
              className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>
        <button
          onClick={addRegistration}
          className="mt-4 flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform"
        >
          <FiPlus /> Add Registration
        </button>
      </div>

      {/* Registrations Table */}
      <div className="max-w-full mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiUser /> NAME
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ROLL NO
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    PHONE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <FiCalendar /> EVENT
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    TICKET ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ACTIONS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    QR CODE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {sortedRegistrations.length > 0 ? (
                  sortedRegistrations.map((registration, index) => (
                    <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-pink-400" />
                          <span>{registration.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{registration.rollNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">{registration.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">{registration.phoneNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-pink-400 text-xs" />
                          <span>{registration.event.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-pink-400 font-medium">{registration.ticketId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteRegistration(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleQRCode(index)}
                          className="text-pink-400 hover:text-pink-300 transition-colors"
                        >
                          {expandedTicket === index ? 'Hide QR' : 'Show QR'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                      No registrations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expanded QR Code View */}
        {expandedTicket !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold mb-4">QR Code for {sortedRegistrations[expandedTicket].name}</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  value={JSON.stringify({
                    name: sortedRegistrations[expandedTicket].name,
                    ticketId: sortedRegistrations[expandedTicket].ticketId,
                    event: sortedRegistrations[expandedTicket].event.title,
                    date: sortedRegistrations[expandedTicket].event.date
                  })}
                  size={128}
                />
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-sm">Event</p>
                  <p className="font-medium">{sortedRegistrations[expandedTicket].event.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Date</p>
                  <p className="font-medium">{sortedRegistrations[expandedTicket].event.date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ticket ID</p>
                  <p className="font-medium text-pink-400">{sortedRegistrations[expandedTicket].ticketId}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
