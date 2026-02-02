'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatContainer } from '@/components/ChatContainer';
import { useAuth } from '@/context/AuthContext';
import { BrainLoader } from '@/components/BrainLoader';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { user, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Show loader for at least 2.5 seconds on mount
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <BrainLoader />;

  if (!user) return null;

  return (
    <main className="flex h-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-[100]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BrainLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-0">
        {/* Background Prism Effect */}
        <div className="absolute inset-0 z-[-1] opacity-30 bg-[url('/grid.svg')] pointer-events-none"></div>
        <ChatContainer />
      </div>
    </main>
  );
}
