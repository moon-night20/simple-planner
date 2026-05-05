import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { IslamicData, EducationData, PersonalityData } from '../types';
import { format } from 'date-fns';
import { Moon, BookOpen, Heart, ArrowRight, Sun, TrendingUp, Star, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Home() {
  const [islamicData] = useLocalStorage<IslamicData>('islamic-data', { prayers: {}, quranPages: {}, zikr: {} });
  const [studyData] = useLocalStorage<EducationData>('study-data', { subjects: [], chapters: [], sessions: [] });
  const [personalityData] = useLocalStorage<PersonalityData>('personality-data', { reflections: {} });

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayPrayers = Object.entries(islamicData.prayers).filter(([k, v]) => k.startsWith(today) && v).length;
  
  const todayStudyHours = studyData.sessions
    .filter(s => format(new Date(s.date), 'yyyy-MM-dd') === today)
    .reduce((acc, s) => acc + s.duration, 0) / 60;

  const currentReflection = personalityData.reflections[today];
  const waterGlasses = currentReflection?.health?.water || 0;

  const modules = [
    {
      id: 'spiritual',
      title: 'Islamic Routine',
      subtitle: 'Salah & Qur\'an',
      icon: '🌙',
      path: '/islamic',
      glass: 'bg-emerald-50/40 backdrop-blur-md border-emerald-100 shadow-emerald-900/5',
      text: 'text-emerald-800',
      tag: 'bg-emerald-100 text-emerald-600',
      accent: 'bg-emerald-400',
      stats: `${todayPrayers}/5 Done`,
      progress: (todayPrayers / 5) * 100,
    },
    {
      id: 'study',
      title: 'Study Hub',
      subtitle: 'Focus & Timer',
      icon: '📚',
      path: '/study',
      glass: 'bg-blue-50/40 backdrop-blur-md border-blue-100 shadow-blue-900/5',
      text: 'text-blue-800',
      tag: 'bg-blue-100 text-blue-600',
      accent: 'bg-blue-400',
      stats: `${todayStudyHours.toFixed(1)} Hrs`,
      progress: (Math.min(todayStudyHours / 6, 1) * 100),
    },
    {
      id: 'growth',
      title: 'Self Growth',
      subtitle: 'Nurture & Bloom',
      icon: '🌸',
      path: '/personality',
      glass: 'bg-pink-50/40 backdrop-blur-md border-pink-100 shadow-pink-900/5',
      text: 'text-pink-800',
      tag: 'bg-pink-100 text-pink-600',
      accent: 'bg-pink-400',
      stats: 'Improving!',
      progress: (waterGlasses / 8) * 100,
    },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Assalamu Alaikum, User</h2>
          <p className="text-slate-500 font-medium">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-700 tracking-tight">Active Streak 🔥</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-500 text-xl font-bold">
            U
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modules.map((module, idx) => (
          <Link key={module.id} to={module.path} className="group">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "h-full p-6 p-8 rounded-[2rem] border shadow-xl flex flex-col transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]",
                module.glass
              )}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={cn("font-bold flex items-center gap-2", module.text)}>
                  <span className={cn("p-1.5 rounded-lg text-lg", module.tag.split(' ')[0].replace('bg-', 'bg-opacity-50 bg-'))}>{module.icon}</span> 
                  {module.title}
                </h3>
                <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider", module.tag)}>
                  {module.stats}
                </span>
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-widest">{module.subtitle}</p>
                  <p className="text-lg font-bold text-slate-700">{Math.round(module.progress)}% Completion</p>
                </div>

                <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    className={cn("h-full rounded-full transition-all duration-1000", module.accent)} 
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                <span>Manage Module</span>
                <ArrowRight size={14} />
              </div>
            </motion.section>
          </Link>
        ))}
      </div>

      {/* Bottom Stats Bar */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-slate-900/5">
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl shadow-sm border border-indigo-100/50">🚀</div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Progress</p>
              <p className="text-sm font-bold text-slate-800">Weekly Goal On Track</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl shadow-sm border border-amber-100/50">💸</div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Budget Tracker</p>
              <p className="text-sm font-bold text-slate-800">Refined Spending</p>
            </div>
          </div>
        </div>
        <Link to="/study" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
          + New Entry
        </Link>
      </div>

      {/* Insights Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/30 backdrop-blur p-8 rounded-[2.5rem] border border-white/60 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4">Productivity Hack</h4>
            <p className="text-lg font-serif italic text-slate-700 leading-relaxed">
              "Deep work is the superpower of the 21st century. Schedule your most difficult task for the first 90 minutes of your day."
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 text-indigo-100 opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-slate-400 mb-6">
              <Star size={14} className="text-amber-400" fill="currentColor" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Motivation</span>
            </div>
            <p className="text-2xl font-serif italic leading-snug text-slate-200">
              "You are improving. Every small step today is a huge victory for your future self."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 backdrop-blur-sm">
                <Heart size={16} fill="currentColor" strokeWidth={0} />
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Self Mastery</span>
            </div>
          </div>
          {/* Subtle glow */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
        </div>
      </section>
    </div>
  );
}
