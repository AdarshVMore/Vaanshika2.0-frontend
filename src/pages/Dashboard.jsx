// File: src/pages/Dashboard.jsx
// Dashboard page component for the user dashboard

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFamily } from "../hooks/useFamily";
import { useEvents } from "../hooks/useEvents";
import Loader from "../components/common/Loader";
import { formatDateShort } from "../utils/formatters";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { familyTree, loading: familyLoading } = useFamily();
  const { events, loading: eventsLoading } = useEvents();
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Filter events to get upcoming events (next 30 days)
    if (events && events.length > 0) {
      const today = new Date();
      const thirtyDaysFromNow = new Date(today);
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const upcoming = events
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= today && eventDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5); // Get top 5 upcoming events

      setUpcomingEvents(upcoming);
    }
  }, [events]);

  if (familyLoading || eventsLoading) {
    return <Loader text="Loading dashboard..." />;
  }

  // Animation variants for staggered animations
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
        damping: 12,
      },
    },
  };

  return (
    <div className="py-6">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Welcome, {currentUser?.displayName || "User"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your family tree, events, and media from your dashboard.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Family Tree Summary */}
        <motion.div
          className="card-glass p-6 rounded-xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <span className="text-2xl mr-2">🌳</span>
              Family Tree
            </h2>
            <Link
              to="/family-tree"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {familyTree &&
            familyTree.members &&
            familyTree.members.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-4 text-center">
                  <span className="block text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {familyTree.members.length}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Family Members
                  </span>
                </div>
                <div className="bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-4 text-center">
                  <span className="block text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                    {
                      familyTree.members.filter((m) => m.generation === 0)
                        .length
                    }
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Generations
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't created a family tree yet.
                </p>
                <Link
                  to="/family-tree"
                  className="btn-primary-glass inline-block px-4 py-2 rounded-lg"
                >
                  Create Family Tree
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          className="card-glass p-6 rounded-xl"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <span className="text-2xl mr-2">📅</span>
              Upcoming Events
            </h2>
            <Link
              to="/events"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center p-3 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-xl">
                        {event.type === "birthday"
                          ? "🎂"
                          : event.type === "anniversary"
                          ? "💍"
                          : event.type === "memorial"
                          ? "🕯️"
                          : "🎉"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDateShort(event.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">📆</div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No upcoming events in the next 30 days.
                </p>
                <Link
                  to="/events/add"
                  className="btn-primary-glass inline-block px-4 py-2 rounded-lg"
                >
                  Add Event
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="card-glass p-6 rounded-xl"
          variants={itemVariants}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Quick Actions
            </h2>
          </div>

          <div className="space-y-3">
            <Link
              to="/family-tree/add-member"
              className="flex items-center p-3 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">👤</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Add Family Member
              </span>
            </Link>

            <Link
              to="/events/add"
              className="flex items-center p-3 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">🎉</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Create Event
              </span>
            </Link>

            <Link
              to="/media/upload"
              className="flex items-center p-3 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">📷</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Upload Media
              </span>
            </Link>

            <Link
              to="/chat"
              className="flex items-center p-3 bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg hover:bg-opacity-40 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg">💬</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Family Chat
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="card-glass p-6 rounded-xl md:col-span-2 lg:col-span-3"
          variants={itemVariants}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Recent Activity
            </h2>
          </div>

          <div className="text-center py-10">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-600 dark:text-gray-400">
              No recent activity to display.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Your recent actions and updates will appear here.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
