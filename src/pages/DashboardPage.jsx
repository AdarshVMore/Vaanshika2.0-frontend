// File: src/pages/DashboardPage.jsx
// Modern dashboard page with glassmorphic cards and widgets

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useFamily } from "../hooks/useFamily";

// Icons
import {
  FaUsers,
  FaCalendarAlt,
  FaImage,
  FaComments,
  FaBirthdayCake,
  FaBell,
  FaUserPlus,
  FaChevronRight,
} from "react-icons/fa";

const DashboardPage = () => {
  const { user } = useAuth();
  const { getFamilyStats, getUpcomingBirthdays, getRecentActivities } =
    useFamily();

  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalMedia: 0,
    totalChats: 0,
  });

  const [birthdays, setBirthdays] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);

        // Get family statistics
        const statsData = await getFamilyStats();
        setStats(statsData);

        // Get upcoming birthdays
        const birthdaysData = await getUpcomingBirthdays();
        setBirthdays(birthdaysData);

        // Get recent activities
        const activitiesData = await getRecentActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [getFamilyStats, getUpcomingBirthdays, getRecentActivities]);

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
        damping: 15,
      },
    },
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days until birthday
  const getDaysUntil = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);

    // Set birth date to current year
    birthDate.setFullYear(today.getFullYear());

    // If the birthday has already occurred this year, set to next year
    if (birthDate < today) {
      birthDate.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = Math.abs(birthDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // Get time ago string
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffTime = Math.abs(now - activityDate);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  // Animated blob backgrounds
  const AnimatedBlobs = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-primary-300 opacity-20 rounded-full filter blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-96 h-96 bg-secondary-300 opacity-20 rounded-full filter blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-80 h-80 bg-accent-300 opacity-20 rounded-full filter blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut",
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 relative">
      {/* Animated background blobs */}
      <AnimatedBlobs />

      {/* Welcome section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Welcome back,{" "}
              <span className="text-gradient">
                {user?.displayName?.split(" ")[0] || "User"}
              </span>
            </h1>
            <p className="mt-1 text-neutral-600">
              Here's what's happening with your family today
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/family/add"
              className="btn-primary inline-flex items-center"
            >
              <FaUserPlus className="mr-2" />
              Add Family Member
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stats cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              <div className="dashboard-stat-card">
                <div className="rounded-full bg-primary-100 p-3 mr-4">
                  <FaUsers className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Family Members
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats.totalMembers}
                  </p>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="rounded-full bg-secondary-100 p-3 mr-4">
                  <FaCalendarAlt className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">Events</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats.totalEvents}
                  </p>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="rounded-full bg-accent-100 p-3 mr-4">
                  <FaImage className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Media Files
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats.totalMedia}
                  </p>
                </div>
              </div>

              <div className="dashboard-stat-card">
                <div className="rounded-full bg-success-100 p-3 mr-4">
                  <FaComments className="h-6 w-6 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    Chat Messages
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {stats.totalChats}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming birthdays */}
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="card-glass">
                  <div className="px-6 py-5 border-b border-neutral-200/50 flex justify-between items-center">
                    <div className="flex items-center">
                      <FaBirthdayCake className="h-5 w-5 text-primary-600 mr-2" />
                      <h2 className="text-lg font-medium text-neutral-900">
                        Upcoming Birthdays
                      </h2>
                    </div>
                    <Link
                      to="/events"
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      View all <FaChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>

                  <div className="px-6 py-4">
                    {birthdays.length > 0 ? (
                      <ul className="divide-y divide-neutral-200/50">
                        {birthdays.map((birthday) => (
                          <li
                            key={birthday.id}
                            className="py-4 flex items-center"
                          >
                            <div className="relative">
                              {birthday.profileImage ? (
                                <img
                                  src={birthday.profileImage}
                                  alt={birthday.name}
                                  className="h-12 w-12 rounded-full object-cover shadow-md"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center shadow-md">
                                  <span className="text-primary-600 font-medium text-lg">
                                    {birthday.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 bg-primary-500 rounded-full p-1 shadow-sm">
                                <FaBirthdayCake className="h-3 w-3 text-white" />
                              </div>
                            </div>

                            <div className="ml-4 flex-1">
                              <p className="text-sm font-medium text-neutral-900">
                                {birthday.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {formatDate(birthday.birthDate)}
                                {birthday.age && ` (Turns ${birthday.age})`}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="badge-primary">
                                {getDaysUntil(birthday.birthDate) === 0
                                  ? "Today"
                                  : `${getDaysUntil(birthday.birthDate)} days`}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-neutral-500 text-sm">
                          No upcoming birthdays
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Recent activities */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <div className="card-glass">
                  <div className="px-6 py-5 border-b border-neutral-200/50 flex justify-between items-center">
                    <div className="flex items-center">
                      <FaBell className="h-5 w-5 text-primary-600 mr-2" />
                      <h2 className="text-lg font-medium text-neutral-900">
                        Recent Activities
                      </h2>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    {activities.length > 0 ? (
                      <ul className="divide-y divide-neutral-200/50">
                        {activities.map((activity) => (
                          <li key={activity.id} className="py-4">
                            <div className="flex items-start">
                              {activity.user.profileImage ? (
                                <img
                                  src={activity.user.profileImage}
                                  alt={activity.user.name}
                                  className="h-10 w-10 rounded-full object-cover shadow-md"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center shadow-md">
                                  <span className="text-primary-600 font-medium">
                                    {activity.user.name.charAt(0)}
                                  </span>
                                </div>
                              )}

                              <div className="ml-3 flex-1">
                                <div className="text-sm text-neutral-900">
                                  <span className="font-medium">
                                    {activity.user.name}
                                  </span>
                                  <span className="ml-1">
                                    {activity.action}
                                  </span>
                                  {activity.target && (
                                    <span className="ml-1 font-medium">
                                      {activity.target}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 flex items-center">
                                  <span className="text-xs text-neutral-500">
                                    {getTimeAgo(activity.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {activity.image && (
                              <div className="mt-2 ml-13">
                                <img
                                  src={activity.image}
                                  alt="Activity"
                                  className="h-24 w-auto rounded-lg object-cover shadow-md"
                                />
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-neutral-500 text-sm">
                          No recent activities
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick access links */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Link to="/family" className="quick-access-card">
                <div className="rounded-full bg-primary-100 p-3 mr-4">
                  <FaUsers className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-base font-medium text-neutral-900">
                    Family Tree
                  </p>
                  <p className="text-sm text-neutral-600">
                    View your family tree
                  </p>
                </div>
              </Link>

              <Link to="/events" className="quick-access-card">
                <div className="rounded-full bg-secondary-100 p-3 mr-4">
                  <FaCalendarAlt className="h-5 w-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-base font-medium text-neutral-900">
                    Events
                  </p>
                  <p className="text-sm text-neutral-600">
                    Manage family events
                  </p>
                </div>
              </Link>

              <Link to="/media" className="quick-access-card">
                <div className="rounded-full bg-accent-100 p-3 mr-4">
                  <FaImage className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-base font-medium text-neutral-900">
                    Media
                  </p>
                  <p className="text-sm text-neutral-600">Photos and videos</p>
                </div>
              </Link>

              <Link to="/chat" className="quick-access-card">
                <div className="rounded-full bg-success-100 p-3 mr-4">
                  <FaComments className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <p className="text-base font-medium text-neutral-900">Chat</p>
                  <p className="text-sm text-neutral-600">
                    Family conversations
                  </p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
