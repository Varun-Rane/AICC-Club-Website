/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiSave } from 'react-icons/fi';

const EventRegistrationTime = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      alert('Please fill in all fields.');
      return;
    }

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setNewEvent({
      title: '',
      startTime: '',
      endTime: ''
    });
  };

  const deleteEvent = (index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Manage Event Registration Times
        </h1>

        {/* Add New Event Form */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
            Add New Event Time
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Event Title</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={newEvent.startTime}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={newEvent.endTime}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
          <button
            onClick={addEvent}
            className="mt-4 flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform"
          >
            <FiSave /> Save Event Time
          </button>
        </div>

        {/* Events Table */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FiClock /> EVENT TITLE
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    START TIME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    END TIME
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FiClock className="text-pink-400" />
                          <span>{event.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(event.startTime).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(event.endTime).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => deleteEvent(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationTime;
