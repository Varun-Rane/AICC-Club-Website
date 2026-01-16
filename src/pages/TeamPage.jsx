import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiUsers,
  FiCode,
  FiFileText,
  FiMic,
  FiDollarSign,
  FiAward,
  FiCalendar,
  FiX,
} from "react-icons/fi";
import teamData from "../data/teamData";

/* 🔥 LOAD TEAM IMAGES (VITE SAFE) */
const teamImages = import.meta.glob(
  "../assets/aiccTeam/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  }
);

const TeamPage = () => {
  const departments = [
    { name: "Core Leads", icon: <FiUser /> },
    { name: "Technical", icon: <FiCode /> },
    { name: "Competition", icon: <FiAward /> },
    { name: "Design", icon: <FiUsers /> },
    { name: "Content", icon: <FiFileText /> },
    { name: "Event Management", icon: <FiCalendar /> },
    { name: "Documentation", icon: <FiFileText /> },
    { name: "Public Relations", icon: <FiMic /> },
    { name: "Marketing", icon: <FiUsers /> },
    { name: "Treasury", icon: <FiDollarSign /> },
  ];

  const [activeDepartment, setActiveDepartment] = useState("Technical");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const activeTeam = teamData[activeDepartment];

  const getImage = (member) =>
    member?.image ? teamImages[`../assets/${member.image}`] : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full lg:w-64">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-[96px]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiUsers /> Departments
            </h3>
            <div className="space-y-3">
              {departments.map((dept) => (
                <button
                  key={dept.name}
                  onClick={() => setActiveDepartment(dept.name)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
                    dept.name === activeDepartment
                      ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {dept.icon} {dept.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team Content */}
        <div className="flex-grow flex flex-col items-center space-y-12">
          {/* Head */}
          {activeTeam?.head && (
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold mb-6">Head</h2>
              <div
                onClick={() => {
                  setSelectedMember(activeTeam.head);
                  setShowProfile(true);
                }}
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-40 h-40 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-pink-500/30 mb-4 overflow-hidden">
                  {getImage(activeTeam.head) ? (
                    <img
                      src={getImage(activeTeam.head)}
                      alt={activeTeam.head.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-4xl font-bold">
                      {activeTeam.head.initials}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xl">
                  {activeTeam.head.name}
                </h3>
                <p className="text-pink-400">
                  {activeTeam.head.role}
                </p>
              </div>
            </div>
          )}

          {/* Co-Heads */}
          {activeTeam?.coHeads?.length > 0 && (
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold mb-6">Co-Heads</h2>
              <div className="flex justify-center gap-8 flex-wrap">
                {activeTeam.coHeads.map((coHead) => (
                  <div
                    key={coHead.name}
                    onClick={() => {
                      setSelectedMember(coHead);
                      setShowProfile(true);
                    }}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-32 h-32 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-orange-500/30 mb-4 overflow-hidden">
                      {getImage(coHead) ? (
                        <img
                          src={getImage(coHead)}
                          alt={coHead.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-3xl font-bold">
                          {coHead.initials}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg">
                      {coHead.name}
                    </h3>
                    <p className="text-orange-400 text-sm">
                      {coHead.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PROFILE MODAL (IMAGE + BIO) */}
      <AnimatePresence>
        {showProfile && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-xl p-8 max-w-md w-full relative"
            >
              {/* IMAGE — FULL FACE SAFE */}
              <div className="w-40 h-40 mx-auto mb-6 bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                {getImage(selectedMember) ? (
                  <img
                    src={getImage(selectedMember)}
                    alt={selectedMember.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-4xl font-bold">
                    {selectedMember.initials}
                  </span>
                )}
              </div>

              {/* NAME + ROLE */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedMember.name}
                </h2>
                <p className="text-pink-400">
                  {selectedMember.role}
                </p>
              </div>

              {/* BIO */}
              <p className="text-gray-300 text-center">
                {selectedMember.bio || "No bio available."}
              </p>

              {/* CLOSE */}
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-5 right-5 text-white"
              >
                <FiX size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
