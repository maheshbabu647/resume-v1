import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAnalyticsOverview } from '../api/adminServiceApi.js';
import LoadingSpinner from '../components/Common/LoadingSpinner/LoadingSpinner.jsx';
import {
  Target,
  Users,
  HeartPulse,
  MessageSquareQuote,
  Coins,
  ShieldQuestion,
  Sprout,
  BookUser,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';

// --- Main Component ---
const AegisHubPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const overviewData = await getAnalyticsOverview();
        
        // Map API data to our dashboard's stat keys
        const hubStats = {
          activeUsers: { value: overviewData.totalUsers || 0, goal: 1000, label: "Active Users" },
          engagementRate: { value: overviewData.engagementRate || 0, goal: 50, label: "Engagement %" },
          feedbackPoints: { value: overviewData.feedbackCount || 0, goal: 500, label: "Feedback" },
          revenue: { value: overviewData.totalRevenue || 0, goal: 100, label: "Revenue (Gold)" },
        };
        
        setStats(hubStats);
      } catch (err) {
        setError(err.message || 'Failed to sync with the Kingdom\'s Core.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- Data for Navigation Links ---
  const domainModules = [
    { title: "The Architect's Forge", description: "Manage product, engineering, and system integrity.", icon: ShieldQuestion, path: "/admin/architect", color: "cyan" },
    { title: "The Herald's Beacon", description: "Oversee marketing, growth, and content creation.", icon: Sprout, path: "/admin/herald", color: "green" },
    { title: "The Emissary's Spire", description: "Engage with the community and manage user support.", icon: BookUser, path: "/admin/emissary", color: "amber" },
    { title: "The Monarch's Chambers", description: "Define high-level strategy and operational tempo.", icon: BrainCircuit, path: "/admin/monarch", color: "violet" },
  ];

  return (
    <>
      <Helmet>
        <title>Aegis Hub | Monarch OS</title>
        <meta name="description" content="The central command center for the Monarch Operating System." />
      </Helmet>
      
      {/* The entire page has a custom dark theme */}
      <div className="min-h-[calc(100vh-100px)] bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* Section 1: Weekly Main Quest */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-6 bg-gray-800/50 border border-cyan-400/30 rounded-lg shadow-[0_0_15px_rgba(72,187,255,0.1)]"
          >
            <div className="flex items-center gap-4">
              <Target className="w-8 h-8 text-cyan-300" />
              <div>
                <h2 className="text-sm uppercase tracking-widest text-cyan-300">Weekly Main Quest</h2>
                <p className="text-xl md:text-2xl font-bold text-white mt-1">
                  Launch the new AI-Powered Summary Feature
                </p>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Core Stats Panel */}
          <div className="mb-8">
            {isLoading && <div className="flex justify-center p-8"><LoadingSpinner label="Calibrating Core Vitals..." /></div>}
            {error && <div className="text-center p-4 bg-red-900/50 border border-red-500/50 rounded-lg"><p>{error}</p></div>}
            {stats && (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {Object.entries(stats).map(([key, stat]) => {
                  const Icon = { activeUsers: Users, engagementRate: HeartPulse, feedbackPoints: MessageSquareQuote, revenue: Coins }[key];
                  return (
                    <motion.div key={key} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                      <div className="bg-gray-800/40 p-5 rounded-lg border border-gray-700 h-full">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-400">{stat.label}</p>
                          <Icon className="w-5 h-5 text-gray-500" />
                        </div>
                        <p className="text-3xl font-semibold text-white">{stat.value}{key === 'engagementRate' && '%'}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Section 3: Navigation to Mini-Centers */}
          <div>
             <h3 className="text-lg font-semibold tracking-wider text-gray-300 mb-4 border-b border-gray-700 pb-2">Domain Modules</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {domainModules.map((mod) => (
                  <motion.div 
                    key={mod.title}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="group"
                  >
                    <Link to={mod.path} className={`block p-6 bg-gray-800/40 rounded-lg border border-gray-700 hover:border-${mod.color}-400/60 hover:shadow-[0_0_20px_rgba(var(--${mod.color}-rgb),0.15)] transition-all duration-300`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <mod.icon className={`w-6 h-6 text-gray-500 group-hover:text-${mod.color}-400 transition-colors`} />
                             <h4 className="text-lg font-bold text-white">{mod.title}</h4>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">{mod.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
             </div>
             {/* A helper style div to make dynamic colors work with Tailwind JIT compiler */}
             <div className="hidden border-cyan-400/60 border-green-400/60 border-amber-400/60 border-violet-400/60 text-cyan-400 text-green-400 text-amber-400 text-violet-400"></div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AegisHubPage;

