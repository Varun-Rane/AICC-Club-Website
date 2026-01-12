import React, { useState, useEffect } from "react";
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

const NAVBAR_HEIGHT = 80;

const TeamPage = () => {
  const teamData = {
    "Core Leads": {
      head: {
        name: "Parth Sakpal",
        role: "President",
        initials: "PS",
        bio: "Leading the AI Coding Club.",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Aditya Tandale",
          role: "Vice President",
          initials: "AT",
          bio: "Supporting leadership and strategy.",
          skills: [],
          image: "",
        },
        {
          name: "Manasi Dubey",
          role: "Vice President",
          initials: "MD",
          bio: "Co-leading initiatives.",
          skills: [],
          image: "",
        },
        {
          name: "Yamini Prasad",
          role: "Secretary",
          initials: "YP",
          bio: "Managing administrative tasks.",
          skills: [],
          image: "",
        },
      ],
    },

    Technical: {
      head: {
        name: "Varun Rane",
        role: "Head",
        initials: "VR",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Dinesh Bodhapalle",
          role: "Co-Head",
          initials: "DB",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Snehal Patil",
          role: "Co-Head",
          initials: "SP",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    Competition: {
      head: {
        name: "Ayush Yadav",
        role: "Head",
        initials: "AY",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Dnyanesh Mulay",
          role: "Co-Head",
          initials: "DM",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Digvijay Patil",
          role: "Co-Head",
          initials: "DP",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    Design: {
      head: {
        name: "Swapnil Thakur",
        role: "Head",
        initials: "ST",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Vansh Kalpesh Mapara",
          role: "Co-Head",
          initials: "VM",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    Content: {
      head: {
        name: "Soham Jawlekar",
        role: "Head",
        initials: "SJ",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Sajid Patel",
          role: "Co-Head",
          initials: "SP",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Raj Jaiswal",
          role: "Co-Head",
          initials: "RJ",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    "Event Management": {
      head: {
        name: "Prajyot Lambe",
        role: "Head",
        initials: "PL",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Maahi Borade",
          role: "Co-Head",
          initials: "MB",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Shreyash Myakalwar",
          role: "Co-Head",
          initials: "SM",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    Documentation: {
      head: {
        name: "Latika Shahapurkar",
        role: "Head",
        initials: "LS",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Khushi Nikam",
          role: "Co-Head",
          initials: "KN",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Atharva Tiwari",
          role: "Co-Head",
          initials: "AT",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    "Public Relations": {
      head: {
        name: "Vivek Behera",
        role: "Head",
        initials: "VB",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Siddharth Tripathi",
          role: "Co-Head",
          initials: "ST",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Akshay Wankhede",
          role: "Co-Head",
          initials: "AW",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Sakshi Kakadwar",
          role: "Co-Head",
          initials: "SK",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    Marketing: {
      head: {
        name: "Mansi Dubey",
        role: "Head",
        initials: "MD",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Shraddha Jagtap",
          role: "Co-Head",
          initials: "SJ",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Nandini Muley",
          role: "Co-Head",
          initials: "NM",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },

    Treasury: {
      head: {
        name: "Yamini Prasad",
        role: "Head",
        initials: "YP",
        bio: "",
        skills: [],
        image: "",
      },
      coHeads: [
        {
          name: "Tanmay Kadam",
          role: "Co-Head",
          initials: "TK",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },
  };

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
  const [showBio, setShowBio] = useState(false);

  const activeTeam = teamData[activeDepartment];

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
                  setShowBio(true);
                }}
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="w-40 h-40 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-pink-500/30 mb-4">
                  <span className="text-4xl font-bold">
                    {activeTeam.head.initials}
                  </span>
                </div>
                <h3 className="font-bold text-xl">{activeTeam.head.name}</h3>
                <p className="text-pink-400">{activeTeam.head.role}</p>
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
                      setShowBio(true);
                    }}
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <div className="w-32 h-32 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-orange-500/30 mb-4">
                      <span className="text-3xl font-bold">
                        {coHead.initials}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{coHead.name}</h3>
                    <p className="text-orange-400 text-sm">{coHead.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showBio && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={() => setShowBio(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedMember.name}
                  </h2>
                  <p className="text-pink-400">{selectedMember.role}</p>
                </div>
                <button onClick={() => setShowBio(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <p className="text-gray-300 text-center">
                {selectedMember.bio}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
