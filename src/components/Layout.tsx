import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top navigation */}
      <Navigation />

      <main className="flex-1 overflow-hidden relative pt-0 md:pt-6">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-48 -left-24 w-72 h-72 bg-purple-500/5 rounded-full blur-[80px]" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full overflow-y-auto px-6 py-6 md:px-12 max-w-7xl mx-auto w-full relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
