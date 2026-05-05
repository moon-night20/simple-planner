import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EducationData, StudySubject, StudyChapter } from '../types';
import { format, startOfWeek, addDays } from 'date-fns';
import { BookOpen, Clock, Plus, Trash2, CheckCircle2, Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function StudyPlanner() {
  const [data, setData] = useLocalStorage<EducationData>('study-data', {
    subjects: [],
    chapters: [],
    sessions: [],
  });

  const [activeTab, setActiveTab] = useState<'planner' | 'timer' | 'subjects'>('planner');
  const [newSubject, setNewSubject] = useState('');
  const [newChapter, setNewChapter] = useState({ subjectId: '', title: '' });

  // Timer State
  const [timerTime, setTimerTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerSubjectId, setTimerSubjectId] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timerTime > 0) {
      timerRef.current = setInterval(() => {
        setTimerTime((time) => time - 1);
      }, 1000);
    } else if (timerTime === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timerTime]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const subject = data.subjects.find(s => s.id === timerSubjectId);
    const sessionSubject = subject ? subject.name : 'General Focus';
    const durationMinutes = 25;
    
    setData(prev => ({
      ...prev,
      sessions: [...prev.sessions, {
        id: Date.now().toString(),
        subject: sessionSubject,
        duration: durationMinutes,
        date: new Date().toISOString(),
      }]
    }));

    alert('Pomodoro session completed! Take a break.');
    setTimerTime(25 * 60);
  };

  const manualLog = (mins: number) => {
    const subject = data.subjects.find(s => s.id === timerSubjectId);
    setData(prev => ({
      ...prev,
      sessions: [...prev.sessions, {
        id: Date.now().toString(),
        subject: subject ? subject.name : 'General Focus',
        duration: mins,
        date: new Date().toISOString(),
      }]
    }));
  };

  const addSubject = () => {
    if (!newSubject.trim()) return;
    const colors = ['bg-blue-100', 'bg-indigo-100', 'bg-cyan-100', 'bg-sky-100', 'bg-slate-100'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const subject: StudySubject = {
      id: Date.now().toString(),
      name: newSubject.trim(),
      color: randomColor,
    };
    setData((prev) => ({ ...prev, subjects: [...prev.subjects, subject] }));
    setNewSubject('');
  };

  const addChapter = () => {
    if (!newChapter.title.trim() || !newChapter.subjectId) return;
    const chapter: StudyChapter = {
      id: Date.now().toString(),
      subjectId: newChapter.subjectId,
      title: newChapter.title.trim(),
      completed: false,
    };
    setData((prev) => ({ ...prev, chapters: [...prev.chapters, chapter] }));
    setNewChapter({ ...newChapter, title: '' });
  };

  const toggleChapter = (id: string) => {
    setData((prev) => ({
      ...prev,
      chapters: prev.chapters.map(c => c.id === id ? { ...c, completed: !c.completed } : c)
    }));
  };

  const deleteSubject = (id: string) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
      chapters: prev.chapters.filter(c => c.subjectId !== id),
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper for stats
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = data.sessions.filter(s => format(new Date(s.date), 'yyyy-MM-dd') === today);
  const todayHours = todaySessions.reduce((acc, s) => acc + s.duration, 0) / 60;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Study Hub</h2>
          <p className="text-slate-500 font-medium">Powering your mind, one session at a time.</p>
        </div>
        <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-sm w-fit self-start md:self-auto">
          {['planner', 'timer', 'subjects'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", 
                activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:text-slate-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'planner' && (
          <motion.div 
            key="planner"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50/40 backdrop-blur-md p-8 rounded-[2rem] border border-blue-100/50 shadow-xl shadow-blue-900/5">
                <div className="bg-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <Clock size={20} />
                </div>
                <p className="text-[10px] font-bold text-blue-800/40 uppercase tracking-widest">Focus Duration</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-blue-900 tabular-nums">{todayHours.toFixed(1)}</span>
                  <span className="text-blue-700/50 font-bold uppercase text-[10px]">hrs today</span>
                </div>
              </div>
              <div className="bg-indigo-50/40 backdrop-blur-md p-8 rounded-[2rem] border border-indigo-100/50 shadow-xl shadow-indigo-900/5">
                <div className="bg-indigo-100 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-[10px] font-bold text-indigo-800/40 uppercase tracking-widest">Mastery Level</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-indigo-900 tabular-nums">
                    {data.chapters.filter(c => c.completed).length}
                  </span>
                  <span className="text-indigo-700/50 font-bold uppercase text-[10px]">chapters done</span>
                </div>
              </div>
              <div className="bg-cyan-50/40 backdrop-blur-md p-8 rounded-[2rem] border border-cyan-100/50 shadow-xl shadow-cyan-900/5">
                <div className="bg-cyan-100 w-10 h-10 rounded-xl flex items-center justify-center text-cyan-600 mb-6">
                  <BookOpen size={20} />
                </div>
                <p className="text-[10px] font-bold text-cyan-800/40 uppercase tracking-widest">Academic Reach</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-cyan-900 tabular-nums">{data.subjects.length}</span>
                  <span className="text-cyan-700/50 font-bold uppercase text-[10px]">courses</span>
                </div>
              </div>
            </div>

            {/* Chapters Progress */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Tracking Progress</h3>
                  <div className="relative group">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-xl cursor-pointer hover:bg-blue-600 hover:text-white transition-all">
                      <Plus size={20} />
                    </div>
                    <div className="absolute right-0 top-full mt-3 w-72 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 hidden group-hover:block z-20 backdrop-blur-xl bg-white/95">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Add Study Target</h4>
                      <select 
                        className="w-full mb-3 p-3 rounded-2xl bg-slate-50 border-none text-sm font-medium outline-none"
                        value={newChapter.subjectId}
                        onChange={e => setNewChapter({ ...newChapter, subjectId: e.target.value })}
                      >
                        <option value="">Choose Course</option>
                        {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <input 
                        type="text" 
                        placeholder="Chapter name..."
                        className="w-full mb-4 p-3 rounded-2xl bg-slate-50 border-none text-sm font-medium outline-none"
                        value={newChapter.title}
                        onChange={e => setNewChapter({ ...newChapter, title: e.target.value })}
                      />
                      <button 
                        onClick={addChapter}
                        className="w-full bg-slate-900 text-white p-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                      >
                        Add Target
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {data.subjects.map(subject => {
                    const subjectChapters = data.chapters.filter(c => c.subjectId === subject.id);
                    if (subjectChapters.length === 0) return null;
                    return (
                      <div key={subject.id} className="space-y-3">
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] ml-1">{subject.name}</p>
                        {subjectChapters.map(chapter => (
                          <div 
                            key={chapter.id} 
                            onClick={() => toggleChapter(chapter.id)}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border",
                              chapter.completed ? "bg-emerald-50/50 border-transparent opacity-60" : "bg-white/60 border-white hover:border-blue-100 hover:bg-white shadow-sm"
                            )}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                              chapter.completed ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" : "border-slate-200"
                            )}>
                              {chapter.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                            </div>
                            <span className={cn("text-sm font-bold", chapter.completed ? "line-through text-slate-400" : "text-slate-700")}>
                              {chapter.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {data.chapters.length === 0 && (
                    <div className="text-center py-16">
                      <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <BookOpen size={24} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold italic text-sm">Quiet minds grow here.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Weekly Rhythms */}
              <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
                <header className="mb-8 relative z-10">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                     <span className="p-2 bg-white/10 rounded-xl">⚡</span> Weekly Rhythms
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Productivity Consistency</p>
                </header>

                <div className="space-y-6 flex-1 relative z-10 pr-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => {
                    const startOfW = startOfWeek(new Date(), { weekStartsOn: 1 });
                    const targetDate = addDays(startOfW, idx);
                    const dayFormatted = format(targetDate, 'yyyy-MM-dd');
                    const dayHours = data.sessions
                      .filter(s => format(new Date(s.date), 'yyyy-MM-dd') === dayFormatted)
                      .reduce((acc, s) => acc + s.duration, 0) / 60;

                    return (
                      <div key={day} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</span>
                           <span className="text-xs font-bold text-blue-400">{dayHours.toFixed(1)}h</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((dayHours / 6) * 100, 100)}%` }}
                            className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 relative z-10">
                   <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic text-center">
                     "Consistency beats intensity. 4 stable hours is better than 10 hours of chaos."
                   </p>
                </div>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
              </section>
            </div>
          </motion.div>
        )}

        {activeTab === 'timer' && (
          <motion.div 
            key="timer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-12 shadow-2xl border border-white flex flex-col items-center">
              <div className="mb-10 w-full">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-[0.2em] text-center">Active Study Mindset</label>
                <select 
                  className="w-full p-4 rounded-2xl bg-white/60 border border-slate-100 text-slate-800 font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all text-center"
                  value={timerSubjectId}
                  onChange={e => setTimerSubjectId(e.target.value)}
                >
                  <option value="">General Flow</option>
                  {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="relative mb-12 group">
                <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl scale-110 group-hover:bg-blue-500/10 transition-colors" />
                <svg className="w-72 h-72 transform -rotate-90 relative z-10">
                  <circle
                    cx="144"
                    cy="144"
                    r="130"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <motion.circle
                    cx="144"
                    cy="144"
                    r="130"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="816.8" // 2 * pi * 130
                    initial={{ strokeDashoffset: 816.8 }}
                    animate={{ strokeDashoffset: 816.8 - (timerTime / (25 * 60)) * 816.8 }}
                    className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <span className="text-7xl font-mono font-bold text-slate-900 tabular-nums tracking-tighter">
                    {formatTime(timerTime)}
                  </span>
                  <div className={cn(
                    "mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                    isActive ? "bg-blue-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"
                  )}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    {isActive ? 'In Deep Flow' : 'On Standby'}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 relative z-10">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all shadow-xl active:scale-90",
                    isActive 
                      ? "bg-slate-900 text-white shadow-slate-900/20" 
                      : "bg-blue-600 text-white shadow-blue-500/30 hover:scale-105"
                  )}
                >
                  {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" fill="currentColor" />}
                </button>
                <button 
                  onClick={() => { setIsActive(false); setTimerTime(25 * 60); }}
                  className="w-20 h-20 rounded-[2rem] bg-white text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all border border-slate-100 active:rotate-90"
                >
                  <RotateCcw size={32} />
                </button>
              </div>

              <div className="mt-12 w-full pt-10 border-t border-slate-100/50">
                 <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-6">Intentional Logging</p>
                 <div className="flex gap-3">
                    {[30, 45, 60, 90].map(m => (
                      <button 
                        key={m} 
                        onClick={() => manualLog(m)}
                        className="flex-1 py-4 rounded-2xl bg-white/60 text-slate-500 text-xs font-bold hover:bg-blue-500 hover:text-white transition-all border border-slate-100 hover:border-blue-500 shadow-sm"
                      >
                        +{m}m
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'subjects' && (
          <motion.div 
            key="subjects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl flex flex-col md:flex-row items-center gap-6">
              <input 
                type="text" 
                placeholder="Declare a new subject area..."
                className="flex-1 bg-white/60 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 transition-all border border-slate-100"
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSubject()}
              />
              <button 
                onClick={addSubject}
                className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
              >
                Create Hub
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.subjects.map(subject => {
                const completed = data.chapters.filter(c => c.subjectId === subject.id && c.completed).length;
                const total = data.chapters.filter(c => c.subjectId === subject.id).length;
                const prog = total ? (completed / total) * 100 : 0;
                
                return (
                  <motion.div 
                    layout
                    key={subject.id} 
                    className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-xl shadow-slate-900/5 group hover:border-blue-200 hover:scale-[1.02] transition-all"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className={cn("w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-blue-600 shadow-sm border border-white", subject.color.replace('bg-', 'bg-opacity-50 bg-'))}>
                        <span className="text-2xl italic font-serif">📚</span>
                      </div>
                      <button 
                        onClick={() => deleteSubject(subject.id)}
                        className="p-2 text-slate-200 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2 truncate">{subject.name}</h4>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Chapters</span>
                        <span className="text-blue-600">{completed} / {total}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden border border-white">
                        <motion.div 
                          className="h-full bg-blue-500 rounded-full" 
                          initial={{ width: 0 }}
                          animate={{ width: `${prog}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
