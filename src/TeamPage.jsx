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
import { Link } from "react-router-dom";

// Navigation bar height (must match the height in App.jsx)
const NAVBAR_HEIGHT = 80;

const TeamPage = () => {
  // Team data organized by department
  const teamData = {
    "Core Leads": {
      head: {
        name: "Parth Sapkal",
        role: "Club President",
        initials: "PS",
        bio: "Leading the AI Coding Club with a vision to foster innovation and collaboration among members.",
        skills: ["Leadership", "Strategic Planning", "Public Speaking", "Team Management"],
      },
      coHeads: [
        {
          name: "Aaditya Tandale",
          role: "Vice President",
          initials: "AT",
          bio: "Assisting the president in managing club activities and ensuring smooth operations.",
          skills: ["Project Management", "Communication", "Event Planning", "Mentoring"],
        },
        {
          name: "Yamini Prasad ",
          role: "Secretary",
          initials: "YP",
          bio: "Handling administrative tasks and maintaining club records and communications.",
          skills: ["Organization", "Documentation", "Scheduling", "Coordination"],
        },
      ],
      coordinators: [
        {
          name: "Emily Davis",
          role: "Coordinator",
          initials: "ED",
          bio: "Supporting club activities and coordinating between different departments.",
          skills: ["Teamwork", "Communication", "Logistics", "Problem Solving"],
        },
        {
          name: "Michael Brown",
          role: "Coordinator",
          initials: "MB",
          bio: "Assisting in organizing events and managing club resources.",
          skills: ["Event Management", "Resource Allocation", "Planning", "Execution"],
        },
        {
          name: "Sarah Wilson",
          role: "Coordinator",
          initials: "SW",
          bio: "Helping with club communications and member engagement activities.",
          skills: ["Public Relations", "Social Media", "Content Creation", "Community Engagement"],
        },
      ],
    },
    Technical: {
      head: {
        name: "Varun Rane",
        role: "Tech Head",
        initials: "VR",
        bio: "Leading the technical direction of AICC with 5+ years of experience in software development and AI technologies.",
        skills: ["JavaScript", "Python", "Machine Learning", "Project Management"],
      },
      coHeads: [
        {
          name: "Snehal Patil",
          role: "Co-Head",
          initials: "SP",
          bio: "Specializing in frontend development and UI/UX design with a passion for creating intuitive user experiences.",
          skills: ["React", "UI/UX Design", "TypeScript", "Accessibility"],
        },
        {
          name: "Dinesh Kumar",
          role: "Co-Head",
          initials: "DK",
          bio: "Backend development expert with extensive experience in database design and system architecture.",
          skills: ["Node.js", "Database Design", "System Architecture", "DevOps"],
        },
      ],
      coordinators: [
        {
          name: "Aman Singh",
          role: "Coordinator",
          initials: "AS",
          bio: "Coordinating technical workshops and mentoring club members in web development technologies.",
          skills: ["HTML/CSS", "JavaScript", "React", "Mentoring"],
        },
        {
          name: "Adeena Farooque",
          role: "Coordinator",
          initials: "AF",
          bio: "Focused on AI and machine learning projects, helping members explore cutting-edge technologies.",
          skills: ["Python", "Machine Learning", "Data Science", "Research"],
        },
        {
          name: "Anjum Inamdar",
          role: "Coordinator",
          initials: "AI",
          bio: "Specializing in competitive programming and algorithm design, preparing members for coding competitions.",
          skills: ["Algorithms", "Data Structures", "Competitive Programming", "Problem Solving"],
        },
      ],
    },
    Documentation: {
      head: {
        name: "Priya Sharma",
        role: "Documentation Head",
        initials: "PS",
        bio: "Ensuring all projects and processes are well-documented for clarity and future reference.",
        skills: ["Technical Writing", "Markdown", "Git", "Collaboration"],
      },
      coHeads: [
        {
          name: "Rahul Verma",
          role: "Co-Head",
          initials: "RV",
          bio: "Assisting in creating and maintaining comprehensive documentation for all club activities.",
          skills: ["LaTeX", "Confluence", "Version Control", "Editing"],
        },
        {
          name: "Anita Desai",
          role: "Co-Head",
          initials: "AD",
          bio: "Helping to ensure all club documentation is accurate, accessible, and up-to-date.",
          skills: ["Technical Writing", "Documentation Tools", "Version Control", "Editing"],
        },
      ],
      coordinators: [
        {
          name: "Kavita Nair",
          role: "Coordinator",
          initials: "KN",
          bio: "Helping document technical workshops and tutorials for club members.",
          skills: ["Technical Writing", "Diagramming", "Content Management", "Proofreading"],
        },
        {
          name: "Rajesh Menon",
          role: "Coordinator",
          initials: "RM",
          bio: "Assisting in maintaining and updating documentation for club projects and activities.",
          skills: ["Markdown", "Version Control", "Technical Writing", "Editing"],
        },
        {
          name: "Sonia Kapoor",
          role: "Coordinator",
          initials: "SK",
          bio: "Supporting the documentation team in creating and managing project documentation.",
          skills: ["Technical Writing", "Content Management", "Version Control", "Collaboration"],
        },
      ],
    },
    "Public Relations": {
      head: {
        name: "Arjun Mehta",
        role: "PR Head",
        initials: "AM",
        bio: "Managing the club's public image and communications with external organizations.",
        skills: ["Public Relations", "Social Media Management", "Networking", "Event Promotion"],
      },
      coHeads: [
        {
          name: "Isha Patel",
          role: "Co-Head",
          initials: "IP",
          bio: "Building and maintaining relationships with industry professionals and other clubs.",
          skills: ["Communication", "Branding", "Partnerships", "Content Creation"],
        },
        {
          name: "Rohan Kapoor",
          role: "Co-Head",
          initials: "RK",
          bio: "Assisting in managing public relations and outreach activities for the club.",
          skills: ["Social Media", "Public Relations", "Networking", "Event Promotion"],
        },
      ],
      coordinators: [
        {
          name: "Neha Gupta",
          role: "Coordinator",
          initials: "NG",
          bio: "Assisting in organizing outreach programs and managing social media presence.",
          skills: ["Social Media", "Graphic Design", "Copywriting", "Community Engagement"],
        },
        {
          name: "Vikram Aditya",
          role: "Coordinator",
          initials: "VA",
          bio: "Supporting public relations activities and managing club communications.",
          skills: ["Communication", "Social Media", "Content Creation", "Networking"],
        },
        {
          name: "Mihir Desai",
          role: "Coordinator",
          initials: "MD",
          bio: "Helping with public relations and outreach activities for the club.",
          skills: ["Public Relations", "Social Media", "Event Promotion", "Community Engagement"],
        },
      ],
    },
    Marketing: {
      head: {
        name: "Sania Khan",
        role: "Marketing Head",
        initials: "SK",
        bio: "Driving the club's marketing strategies to increase visibility and engagement.",
        skills: ["Digital Marketing", "SEO", "Analytics", "Campaign Management"],
      },
      coHeads: [
        {
          name: "Vikram Aditya",
          role: "Co-Head",
          initials: "VA",
          bio: "Creating marketing campaigns and managing the club's online presence.",
          skills: ["Content Marketing", "Advertising", "Brand Strategy", "Creative Design"],
        },
        {
          name: "Neha Sharma",
          role: "Co-Head",
          initials: "NS",
          bio: "Assisting in developing and executing marketing strategies for the club.",
          skills: ["Social Media", "Content Creation", "Branding", "Analytics"],
        },
      ],
      coordinators: [
        {
          name: "Pooja Menon",
          role: "Coordinator",
          initials: "PM",
          bio: "Supporting the marketing team in promotional activities and managing marketing materials.",
          skills: ["Graphic Design", "Social Media", "Event Promotion", "Copywriting"],
        },
        {
          name: "Rohan Kapoor",
          role: "Coordinator",
          initials: "RK",
          bio: "Assisting in managing marketing campaigns and social media presence.",
          skills: ["Digital Marketing", "Social Media", "Content Creation", "Analytics"],
        },
        {
          name: "Isha Patel",
          role: "Coordinator",
          initials: "IP",
          bio: "Helping with marketing activities and managing promotional materials.",
          skills: ["Graphic Design", "Social Media", "Content Creation", "Event Promotion"],
        },
      ],
    },
    Treasury: {
      head: {
        name: "Rajesh Kumar",
        role: "Treasurer",
        initials: "RK",
        bio: "Overseeing the financial aspects of the club, including budgeting and sponsorships.",
        skills: ["Financial Planning", "Budget Management", "Fundraising", "Sponsorship"],
      },
      coHeads: [
        {
          name: "Sonia Luthra",
          role: "Co-Head",
          initials: "SL",
          bio: "Assisting in managing funds and organizing sponsorship drives.",
          skills: ["Accounting", "Financial Analysis", "Negotiation", "Event Budgeting"],
        },
        {
          name: "Ankit Verma",
          role: "Co-Head",
          initials: "AV",
          bio: "Supporting the treasurer in managing club finances and sponsorships.",
          skills: ["Budgeting", "Financial Planning", "Fundraising", "Sponsorship Management"],
        },
      ],
      coordinators: [
        {
          name: "Priya Sharma",
          role: "Coordinator",
          initials: "PS",
          bio: "Assisting in financial planning and managing club funds.",
          skills: ["Accounting", "Budgeting", "Financial Analysis", "Fundraising"],
        },
        {
          name: "Amit Singh",
          role: "Coordinator",
          initials: "AS",
          bio: "Supporting the treasury team in managing club finances and sponsorships.",
          skills: ["Financial Planning", "Budget Management", "Fundraising", "Sponsorship"],
        },
        {
          name: "Kavita Nair",
          role: "Coordinator",
          initials: "KN",
          bio: "Helping with financial management and sponsorship activities.",
          skills: ["Accounting", "Financial Analysis", "Budgeting", "Fundraising"],
        },
      ],
    },
    Competition: {
      head: {
        name: "Aditya Rao",
        role: "Competition Head",
        initials: "AR",
        bio: "Organizing coding competitions and hackathons to challenge and inspire club members.",
        skills: ["Event Planning", "Problem Setting", "Judging", "Logistics"],
      },
      coHeads: [
        {
          name: "Mihir Desai",
          role: "Co-Head",
          initials: "MD",
          bio: "Assisting in planning and executing competitive programming events.",
          skills: ["Competitive Programming", "Contest Management", "Mentoring", "Outreach"],
        },
        {
          name: "Nandini Iyer",
          role: "Co-Head",
          initials: "NI",
          bio: "Supporting the organization of coding competitions and hackathons.",
          skills: ["Event Planning", "Problem Curation", "Judging", "Logistics"],
        },
      ],
      coordinators: [
        {
          name: "Aman Singh",
          role: "Coordinator",
          initials: "AS",
          bio: "Helping organize and promote coding competitions and workshops.",
          skills: ["Event Coordination", "Problem Curation", "Volunteer Management", "Publicity"],
        },
        {
          name: "Adeena Farooque",
          role: "Coordinator",
          initials: "AF",
          bio: "Assisting in organizing coding competitions and hackathons.",
          skills: ["Competitive Programming", "Event Coordination", "Problem Curation", "Publicity"],
        },
        {
          name: "Anjum Inamdar",
          role: "Coordinator",
          initials: "AI",
          bio: "Supporting the competition team in organizing events and activities.",
          skills: ["Event Planning", "Problem Curation", "Volunteer Management", "Publicity"],
        },
      ],
    },
    "Event Management": {
      head: {
        name: "Tanvi Shetty",
        role: "Event Manager",
        initials: "TS",
        bio: "Planning and executing all club events, from workshops to hackathons.",
        skills: ["Event Planning", "Logistics", "Vendor Management", "Team Coordination"],
      },
      coHeads: [
        {
          name: "Karan Joshi",
          role: "Co-Head",
          initials: "KJ",
          bio: "Assisting in organizing and managing events to ensure smooth execution.",
          skills: ["Project Management", "Scheduling", "Communication", "Problem Solving"],
        },
        {
          name: "Pooja Menon",
          role: "Co-Head",
          initials: "PM",
          bio: "Supporting the planning and execution of club events and activities.",
          skills: ["Event Coordination", "Logistics", "Communication", "Team Management"],
        },
      ],
      coordinators: [
        {
          name: "Rohan Kapoor",
          role: "Coordinator",
          initials: "RK",
          bio: "Assisting in the planning and execution of club events and activities.",
          skills: ["Event Coordination", "Volunteer Management", "Creative Planning", "Logistics"],
        },
        {
          name: "Neha Gupta",
          role: "Coordinator",
          initials: "NG",
          bio: "Supporting the event management team in organizing club events.",
          skills: ["Event Planning", "Logistics", "Communication", "Team Coordination"],
        },
        {
          name: "Isha Patel",
          role: "Coordinator",
          initials: "IP",
          bio: "Helping with event planning and coordination for the club.",
          skills: ["Event Coordination", "Logistics", "Communication", "Team Management"],
        },
      ],
    },
  };

  // Department data with icons
  const departments = [
    { name: "Core Leads", icon: <FiUser /> },
    { name: "Technical", icon: <FiCode /> },
    { name: "Documentation", icon: <FiFileText /> },
    { name: "Public Relations", icon: <FiMic /> },
    { name: "Marketing", icon: <FiUsers /> },
    { name: "Treasury", icon: <FiDollarSign /> },
    { name: "Competition", icon: <FiAward /> },
    { name: "Event Management", icon: <FiCalendar /> },
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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
  };

  // Get the active team based on the selected department
  const activeTeam = teamData[activeDepartment] || { head: null, coHeads: [], coordinators: [] };

  return (
    <>
      {/* Main content container */}
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
            Get to know the talented individuals who make our AI Coding Club successful
          </p>
        </motion.div>

        {/* Main content with flex layout */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Departments sidebar with animations */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-64 flex-shrink-0"
          >
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-gray-700 sticky top-[96px]">
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
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
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

          {/* Team structure with animations */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-grow flex flex-col items-center space-y-12"
          >
            {/* Head Section */}
            {activeTeam.head && (
              <motion.div variants={itemVariants} className="w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Head</h2>
                <div
                  onClick={() => {
                    setSelectedMember(activeTeam.head);
                    setShowBio(true);
                  }}
                  className="relative cursor-pointer flex flex-col items-center"
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    className="w-40 h-40 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-pink-500/30 shadow-lg mb-4"
                  >
                    <span className="text-4xl font-bold text-white">{activeTeam.head.initials}</span>
                  </motion.div>
                  <h3 className="font-bold text-white text-xl">{activeTeam.head.name}</h3>
                  <p className="text-pink-400">{activeTeam.head.role}</p>
                </div>
              </motion.div>
            )}

            {/* Co-Heads Section */}
            {activeTeam.coHeads.length > 0 && (
              <motion.div variants={itemVariants} className="w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Co-Heads</h2>
                <div className="flex justify-center gap-8 mb-8 flex-wrap">
                  {activeTeam.coHeads.slice(0, 2).map((coHead) => (
                    <div
                      key={coHead.name}
                      onClick={() => {
                        setSelectedMember(coHead);
                        setShowBio(true);
                      }}
                      className="relative cursor-pointer flex flex-col items-center min-w-[120px]"
                    >
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="w-32 h-32 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-orange-500/30 shadow-lg mb-4"
                      >
                        <span className="text-3xl font-bold text-white">{coHead.initials}</span>
                      </motion.div>
                      <h3 className="font-bold text-white text-lg">{coHead.name}</h3>
                      <p className="text-orange-400 text-sm">{coHead.role}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Coordinators Section */}
            {activeTeam.coordinators.length > 0 && (
              <motion.div variants={itemVariants} className="w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Coordinators</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {activeTeam.coordinators.slice(0, 3).map((coordinator) => (
                    <div
                      key={coordinator.name}
                      onClick={() => {
                        setSelectedMember(coordinator);
                        setShowBio(true);
                      }}
                      className="relative cursor-pointer flex flex-col items-center p-2"
                    >
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="w-28 h-28 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-purple-500/30 shadow-lg mb-4"
                      >
                        <span className="text-2xl font-bold text-white">{coordinator.initials}</span>
                      </motion.div>
                      <h3 className="font-bold text-white text-base text-center">{coordinator.name}</h3>
                      <p className="text-purple-400 text-sm text-center">{coordinator.role}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Member Bio Modal */}
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
                className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700 max-w-2xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedMember.name}</h2>
                      <p className="text-pink-400">{selectedMember.role}</p>
                    </div>
                    <button
                      onClick={() => setShowBio(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mb-6 mx-auto">
                    <span className="text-3xl font-bold text-white">{selectedMember.initials}</span>
                  </div>
                  <p className="text-gray-300 mb-6 text-center">{selectedMember.bio}</p>
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
    </>
  );
};

export default TeamPage;
