import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const DashboardPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const registrationsPerPage = 5;

  useEffect(() => {
    const storedRegistrations = JSON.parse(localStorage.getItem("registrations")) || [];
    setRegistrations(storedRegistrations);
  }, []);

  // Search functionality
  const filteredRegistrations = registrations.filter(
    (registration) =>
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = filteredRegistrations.slice(
    indexOfFirstRegistration,
    indexOfLastRegistration
  );
  const totalPages = Math.ceil(filteredRegistrations.length / registrationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <section className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-300">
          View all registered participants and their QR tickets.
        </p>
      </section>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto my-6">
        <input
          type="text"
          placeholder="Search by name, roll no, email, or event..."
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-pink-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Registrations Table */}
      <div className="max-w-6xl mx-auto my-6 overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Roll No</th>
              <th className="py-3 px-4 text-left">Phone No</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Branch</th>
              <th className="py-3 px-4 text-left">Studying Year</th>
              <th className="py-3 px-4 text-left">Department</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Event</th>
              <th className="py-3 px-4 text-left">Ticket ID</th>
              <th className="py-3 px-4 text-left">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {currentRegistrations.length > 0 ? (
              currentRegistrations.map((registration, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3 px-4">{registration.name}</td>
                  <td className="py-3 px-4">{registration.rollNo}</td>
                  <td className="py-3 px-4">{registration.phoneNo}</td>
                  <td className="py-3 px-4">{registration.email}</td>
                  <td className="py-3 px-4">{registration.branch}</td>
                  <td className="py-3 px-4">{registration.studyingYear}</td>
                  <td className="py-3 px-4">{registration.department}</td>
                  <td className="py-3 px-4">{registration.gender}</td>
                  <td className="py-3 px-4">{registration.event.title}</td>
                  <td className="py-3 px-4">{registration.ticketId}</td>
                  <td className="py-3 px-4">
                    <div className="bg-white p-2 rounded-lg w-20 h-20 flex items-center justify-center">
                      <QRCode
                        value={JSON.stringify({
                          name: registration.name,
                          rollNo: registration.rollNo,
                          event: registration.event.title,
                          ticketId: registration.ticketId,
                        })}
                        size={80}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-6 text-center text-gray-400">
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-6xl mx-auto flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === number
                  ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
