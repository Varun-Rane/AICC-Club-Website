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

// Navigation bar height (must match the height in App.jsx)
const NAVBAR_HEIGHT = 80;

const TeamPage = () => {
  // Team data organized by department
  const teamData = {
    "Core Leads": {
      head: {
        name: "Parth Sakpal",
        role: "President",
        initials: "PS",
        bio: "Leading the AI Coding Club.",
        skills: [],
        image: "", // Add image path here
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
      coordinators: [],
    },

    Technical: {
      head: {
        name: "Varun Rane",
        role: "Head",
        initials: "VR",
        bio: "",
        skills: [],
        image: "../assets/aiccTeam/varun.jpg",
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
      coordinators: [
        {
          name: "Adeena Farooque",
          role: "Coordinator",
          initials: "AF",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Anjum Mahamadkhalf Inamdar",
          role: "Coordinator",
          initials: "AI",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Aman Singh",
          role: "Coordinator",
          initials: "AS",
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
      coordinators: [
        {
          name: "Mamta Omprakash Yadav",
          role: "Coordinator",
          initials: "MY",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Ashish Tiwari",
          role: "Coordinator",
          initials: "AT",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Alok Singh",
          role: "Coordinator",
          initials: "AS",
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
      coordinators: [
        {
          name: "Gurvansh Singh Juneja",
          role: "Coordinator",
          initials: "GJ",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Avdhut Gajanan Kapratwar",
          role: "Coordinator",
          initials: "AK",
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
      coordinators: [
        {
          name: "Vedant Gajanan Modak",
          role: "Coordinator",
          initials: "VM",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Manojit Khatua",
          role: "Coordinator",
          initials: "MK",
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
      coordinators: [
        {
          name: "Yash Ghode",
          role: "Coordinator",
          initials: "YG",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Vaibhavi Kele",
          role: "Coordinator",
          initials: "VK",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Gaurav Anantrao Chavan",
          role: "Coordinator",
          initials: "GC",
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
      coordinators: [
        {
          name: "Vaishnavi Patil",
          role: "Coordinator",
          initials: "VP",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Aryan Kajari",
          role: "Coordinator",
          initials: "AK",
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
      coordinators: [
        {
          name: "Anshul Khandelwal",
          role: "Coordinator",
          initials: "AK",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Aakansha Dhananjay Chaturvedi",
          role: "Coordinator",
          initials: "AC",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Tanishka Vilas Devgirkar",
          role: "Coordinator",
          initials: "TD",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Sujal Kumar",
          role: "Coordinator",
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
      coordinators: [
        {
          name: "Amey Jadhav",
          role: "Coordinator",
          initials: "AJ",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Arati Jadhav",
          role: "Coordinator",
          initials: "AJ",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Mohit Shivajirao Muchote",
          role: "Coordinator",
          initials: "MM",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Himanshi Nayak",
          role: "Coordinator",
          initials: "HN",
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
      coordinators: [
        {
          name: "Sanika Patil",
          role: "Coordinator",
          initials: "SP",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Ashutosh Rajendra Adhav",
          role: "Coordinator",
          initials: "AA",
          bio: "",
          skills: [],
          image: "",
        },
        {
          name: "Ayush Gupta",
          role: "Coordinator",
          initials: "AG",
          bio: "",
          skills: [],
          image: "",
        },
      ],
    },
  };

  // Department data with icons
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowBio(false);
    };
    if (showBio) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showBio]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  // Get the active team
  const activeTeam = teamData[activeDepartment] || {
    head: null,
    coHeads: [],
    coordinators: [],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 pb-16 px-4 md:px-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto mb-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          Meet Our Team
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-300">
          Get to know the talented individuals who make our AI Coding Club
          successful
        </p>
      </motion.div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Departments sidebar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-64 flex-shrink-0"
        >
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 sticky top-[96px]">
            <h3 className="text-lg font-semibold mb-4 text-gray-200 flex items-center gap-2">
              <FiUsers /> Departments
            </h3>
            <div className="space-y-3">
              {departments.map((dept) => (
                <motion.button
                  key={dept.name}
                  onClick={() => setActiveDepartment(dept.name)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 ${
                    dept.name === activeDepartment
                      ? "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {dept.icon} {dept.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-grow flex flex-col items-center space-y-12"
        >
          {/* Head */}
          {activeTeam.head && (
            <motion.div variants={itemVariants} className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">
                Head
              </h2>
              <div
                onClick={() => {
                  setSelectedMember(activeTeam.head);
                  setShowBio(true);
                }}
                className="cursor-pointer flex flex-col items-center"
              >
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  className="w-40 h-40 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-pink-500/30 shadow-lg mb-4 overflow-hidden"
                >
                  {activeTeam.head.image ? (
                    <img
                      src={activeTeam.head.image}
                      alt={activeTeam.head.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {activeTeam.head.initials}
                    </span>
                  )}
                </motion.div>
                <h3 className="font-bold text-xl">{activeTeam.head.name}</h3>
                <p className="text-pink-400">{activeTeam.head.role}</p>
              </div>
            </motion.div>
          )}

          {/* Co-Heads */}
          {activeTeam.coHeads.length > 0 && (
            <motion.div variants={itemVariants} className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">
                Co-Heads
              </h2>
              <div className="flex justify-center gap-8 flex-wrap">
                {activeTeam.coHeads.map((coHead) => (
                  <div
                    key={coHead.name}
                    onClick={() => {
                      setSelectedMember(coHead);
                      setShowBio(true);
                    }}
                    className="cursor-pointer flex flex-col items-center min-w-[120px]"
                  >
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="w-32 h-32 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-orange-500/30 shadow-lg mb-4 overflow-hidden"
                    >
                      {coHead.image ? (
                        <img
                          src={coHead.image}
                          alt={coHead.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          {coHead.initials}
                        </span>
                      )}
                    </motion.div>
                    <h3 className="font-bold text-lg">{coHead.name}</h3>
                    <p className="text-orange-400 text-sm">{coHead.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Coordinators */}
          {activeTeam.coordinators.length > 0 && (
            <motion.div variants={itemVariants} className="w-full">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">
                Coordinators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {activeTeam.coordinators.map((coordinator) => (
                  <div
                    key={coordinator.name}
                    onClick={() => {
                      setSelectedMember(coordinator);
                      setShowBio(true);
                    }}
                    className="cursor-pointer flex flex-col items-center p-2"
                  >
                    <motion.div
                      variants={cardVariants}
                      whileHover="hover"
                      className="w-28 h-28 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-purple-500/30 shadow-lg mb-4 overflow-hidden"
                    >
                      {coordinator.image ? (
                        <img
                          src={coordinator.image}
                          alt={coordinator.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {coordinator.initials}
                        </span>
                      )}
                    </motion.div>
                    <h3 className="font-bold text-base text-center">
                      {coordinator.name}
                    </h3>
                    <p className="text-purple-400 text-sm text-center">
                      {coordinator.role}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {showBio && selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBio(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800/95 rounded-xl border border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedMember.name}
                    </h2>
                    <p className="text-pink-400">{selectedMember.role}</p>
                  </div>
                  <button
                    onClick={() => setShowBio(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mb-6 mx-auto overflow-hidden">
                  {selectedMember.image ? (
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {selectedMember.initials}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 mb-6 text-center">
                  {selectedMember.bio}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedMember.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
