import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { IslamicData } from '../types';
import { format } from 'date-fns';
import { Check, Book, MessageSquare, Moon, Sun, Cloud, Wind, Sunset } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const PRAYERS = [
  { id: 'fajr', name: 'Fajr', icon: Moon, description: 'Dawn prayer' },
  { id: 'dhuhr', name: 'Dhuhr', icon: Sun, description: 'Noon prayer' },
  { id: 'asr', name: 'Asr', icon: Cloud, description: 'Afternoon prayer' },
  { id: 'maghrib', name: 'Maghrib', icon: Sunset, description: 'Sunset prayer' },
  { id: 'isha', name: 'Isha', icon: Wind, description: 'Night prayer' },
];

export default function IslamicTracker() {
  const [data, setData] = useLocalStorage<IslamicData>('islamic-data', {
    prayers: {},
    quranPages: {},
    zikr: {},
  });

  const today = format(new Date(), 'yyyy-MM-dd');

  const togglePrayer = (prayerId: string) => {
    const key = `${today}-${prayerId}`;
    setData((prev) => ({
      ...prev,
      prayers: {
        ...prev.prayers,
        [key]: !prev.prayers[key],
      },
    }));
  };

  const toggleZikr = () => {
    setData((prev) => ({
      ...prev,
      zikr: {
        ...prev.zikr,
        [today]: !prev.zikr[today],
      },
    }));
  };

  const updateQuranPages = (pages: number) => {
    setData((prev) => ({
      ...prev,
      quranPages: {
        ...prev.quranPages,
        [today]: pages,
      },
    }));
  };

  const completedPrayers = PRAYERS.filter(p => data.prayers[`${today}-${p.id}`]).length;
  const progress = (completedPrayers / PRAYERS.length) * 100;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Islamic Routine</h2>
          <p className="text-slate-500 font-medium">Spiritual discipline for the soul.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
           <span className="text-xs font-bold uppercase tracking-widest">{Math.round(progress)}% Progress</span>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Prayers Section */}
        <section className="bg-emerald-50/40 backdrop-blur-md border border-emerald-100 p-8 rounded-[2rem] shadow-xl shadow-emerald-900/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-emerald-800 font-bold flex items-center gap-3">
              <span className="bg-emerald-200/50 p-2 rounded-xl text-xl">🌙</span> Relational Salah
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">{completedPrayers}/5 Completed</span>
          </div>

          <div className="space-y-3">
            {PRAYERS.map((prayer) => {
              const isDone = data.prayers[`${today}-${prayer.id}`];
              return (
                <button
                  key={prayer.id}
                  onClick={() => togglePrayer(prayer.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                    isDone 
                      ? "bg-emerald-500/10 border-emerald-200/50 shadow-sm" 
                      : "bg-white/60 hover:bg-white/80 border border-white backdrop-blur-sm"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      isDone ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-emerald-50 text-emerald-400 group-hover:bg-emerald-100"
                    )}>
                      <prayer.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className={cn("font-bold text-sm", isDone ? "text-emerald-900" : "text-slate-600")}>{prayer.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{prayer.description}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isDone ? "bg-emerald-500 border-emerald-500" : "border-emerald-100 group-hover:border-emerald-300"
                  )}>
                    {isDone && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="space-y-8">
          {/* Quran Tracker */}
          <section className="bg-white/40 backdrop-blur-md border border-white rounded-[2rem] p-8 shadow-xl shadow-slate-900/5">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3 mb-6">
              <span className="bg-slate-100 p-2 rounded-xl">📚</span> Quran Insight
            </h3>
            
            <div className="space-y-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pages Read Today</p>
              <div className="flex items-end gap-3">
                <input
                  type="number"
                  min="0"
                  value={data.quranPages[today] || ''}
                  onChange={(e) => updateQuranPages(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="text-6xl font-serif italic bg-transparent border-none outline-none w-32 pb-2 text-slate-900 placeholder:text-slate-100"
                />
                <span className="text-slate-400 font-bold pb-2 italic text-sm">pages</span>
              </div>
              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-3">
                 <span className="text-emerald-500">✨</span>
                 <p className="text-xs text-emerald-800/60 leading-relaxed font-semibold italic">
                   "He who recites the Quran will have a light on the Day of Judgment."
                 </p>
              </div>
            </div>
          </section>

          {/* Zikr Tracker */}
          <section className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <h3 className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-4">Adhkar & Remembrance</h3>
            <p className="text-xl font-serif italic text-white mb-8 leading-snug">
              Did you find your inner peace through morning & evening Zikr?
            </p>
            
            <button
              onClick={toggleZikr}
              className={cn(
                "group relative overflow-hidden rounded-2xl w-full py-4 transition-all duration-500 font-bold tracking-tight text-lg",
                data.zikr[today] 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/10" 
                  : "bg-white/10 text-white/60 hover:bg-white/20 border border-white/10 active:scale-95"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {data.zikr[today] ? (
                  <>
                    <Check size={20} strokeWidth={3} />
                    Alhamdulillah, Done
                  </>
                ) : 'Confirm Completion'}
              </span>
            </button>
            
            {/* Decorative glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none transition-transform group-hover:scale-150" />
          </section>
        </div>
      </div>
    </div>
  );
}
