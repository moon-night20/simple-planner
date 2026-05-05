import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PersonalityData, DailyReflection, Meal, Spending } from '../types';
import { format } from 'date-fns';
import { Heart, Droplets, Bed, Dumbbell, Sparkles, Utensils, Wallet, Activity, ArrowRight, Plus, Trash2, PenLine } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function PersonalityTracker() {
  const [data, setData] = useLocalStorage<PersonalityData>('personality-data', {
    reflections: {},
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Get current day's reflection or initialize
  const currentReflection: DailyReflection = data.reflections[today] || {
    date: today,
    reflection: '',
    health: { water: 0, sleep: 7, exercise: false, selfCare: false },
    meals: [],
    spending: [],
    timeUsage: { productive: 0, unproductive: 0 },
  };

  const updateField = (field: keyof DailyReflection, value: any) => {
    setData(prev => ({
      ...prev,
      reflections: {
        ...prev.reflections,
        [today]: { ...currentReflection, [field]: value }
      }
    }));
  };

  const updateHealth = (field: keyof DailyReflection['health'], value: any) => {
    updateField('health', { ...currentReflection.health, [field]: value });
  };

  const addMeal = (meal: Meal) => {
    updateField('meals', [...currentReflection.meals, meal]);
  };

  const deleteMeal = (idx: number) => {
    updateField('meals', currentReflection.meals.filter((_, i) => i !== idx));
  };

  const addSpending = (spending: Spending) => {
    updateField('spending', [...currentReflection.spending, spending]);
  };

  const deleteSpending = (idx: number) => {
    updateField('spending', currentReflection.spending.filter((_, i) => i !== idx));
  };

  const [newMeal, setNewMeal] = useState<Meal>({ type: 'breakfast', content: '', healthy: true });
  const [newSpending, setNewSpending] = useState<Spending>({ amount: 0, category: '', description: '' });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Self Growth</h2>
          <p className="text-slate-500 font-medium">Nurturing the bloom of your potential.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-pink-500/10 text-pink-600 px-4 py-2 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
           <span className="text-xs font-bold uppercase tracking-widest">Growth Journey</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Health & Habits */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-900/5">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <span className="bg-pink-100 p-2 rounded-xl">✨</span> Vitality Check
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div className="group">
                  <label className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-slate-400">
                      <Droplets size={14} className="text-blue-500" />
                      Hydration
                    </span>
                    <span className="text-sm font-bold text-blue-600">{currentReflection.health.water} glasses</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                      <button
                        key={g}
                        onClick={() => updateHealth('water', g)}
                        className={cn(
                          "flex-1 h-10 rounded-xl transition-all duration-300 font-bold text-xs",
                          currentReflection.health.water >= g 
                            ? "bg-blue-500 text-white shadow-lg shadow-blue-100" 
                            : "bg-white/60 border border-slate-100 text-slate-300 hover:border-blue-200"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center justify-between mb-4">
                    <span className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-slate-400">
                      <Bed size={14} className="text-indigo-500" />
                      Rest (Hours)
                    </span>
                    <span className="text-sm font-bold text-indigo-600">{currentReflection.health.sleep}h</span>
                  </label>
                  <input 
                    type="range" min="1" max="12" step="0.5"
                    value={currentReflection.health.sleep}
                    onChange={(e) => updateHealth('sleep', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-300 font-bold mt-2 px-1 uppercase tracking-widest">
                    <span>Low</span>
                    <span>Optional 8h</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateHealth('exercise', !currentReflection.health.exercise)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-[2.5rem] border transition-all duration-500 group",
                    currentReflection.health.exercise 
                      ? "bg-emerald-500/10 border-emerald-200 text-emerald-600 shadow-xl shadow-emerald-900/5" 
                      : "bg-white/60 border-slate-100 text-slate-300 hover:border-pink-100"
                  )}
                >
                  <div className={cn("mb-4 transition-all duration-500 p-4 rounded-3xl", currentReflection.health.exercise ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-300 group-hover:scale-110")}>
                    <Dumbbell size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Exercise</span>
                </button>
                <button
                  onClick={() => updateHealth('selfCare', !currentReflection.health.selfCare)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-[2.5rem] border transition-all duration-500 group",
                    currentReflection.health.selfCare 
                      ? "bg-pink-500/10 border-pink-200 text-pink-600 shadow-xl shadow-pink-900/5" 
                      : "bg-white/60 border-slate-100 text-slate-300 hover:border-pink-100"
                  )}
                >
                  <div className={cn("mb-4 transition-all duration-500 p-4 rounded-3xl", currentReflection.health.selfCare ? "bg-pink-500 text-white" : "bg-slate-50 text-slate-300 group-hover:scale-110")}>
                    <Sparkles size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Self Care</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Meal Tracker */}
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-900/5">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="bg-orange-100 p-2 rounded-xl text-lg">🥗</span> Food Insight
              </h3>
              
              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-1">
                {currentReflection.meals.map((meal, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-2 h-2 rounded-full", meal.healthy ? "bg-emerald-400" : "bg-pink-400")} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{meal.type}</p>
                        <p className="text-sm font-bold text-slate-700">{meal.content}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteMeal(i)} className="text-slate-200 hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50/50 p-4 rounded-3xl border border-orange-100/50 backdrop-blur-sm">
                <div className="flex gap-2 mb-4">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as Meal['type'][]).map(t => (
                    <button 
                      key={t}
                      onClick={() => setNewMeal({ ...newMeal, type: t })}
                      className={cn(
                        "flex-1 text-[10px] font-bold uppercase py-2 rounded-xl transition-all",
                        newMeal.type === t ? "bg-orange-500 text-white shadow-lg" : "bg-white/80 text-orange-400 hover:bg-white"
                      )}
                    >
                      {t[0]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="Declare your intake..."
                    className="flex-1 bg-white/80 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-4 focus:ring-orange-100 transition-all"
                    value={newMeal.content}
                    onChange={(e) => setNewMeal({ ...newMeal, content: e.target.value })}
                  />
                  <button 
                    onClick={() => { if(newMeal.content) { addMeal(newMeal); setNewMeal({ ...newMeal, content: '' }); } }}
                    className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Spending Tracker */}
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-900/5">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="bg-emerald-100 p-2 rounded-xl text-lg">💸</span> Wealth Flow
              </h3>

              <div className="space-y-3 mb-8 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                {currentReflection.spending.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-sm group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">$</div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                        <p className="text-sm font-bold text-slate-700">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">${item.amount}</p>
                      <button onClick={() => deleteSpending(i)} className="text-pink-400 hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold uppercase">remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="number" placeholder="$0"
                    className="w-20 bg-white/80 p-4 rounded-2xl text-xs font-bold outline-none border border-transparent focus:ring-4 focus:ring-emerald-100 transition-all"
                    value={newSpending.amount || ''}
                    onChange={(e) => setNewSpending({ ...newSpending, amount: parseFloat(e.target.value) || 0 })}
                  />
                  <input 
                    type="text" placeholder="Description..."
                    className="flex-1 bg-white/80 p-4 rounded-2xl text-xs font-bold outline-none border border-transparent focus:ring-4 focus:ring-emerald-100 transition-all"
                    value={newSpending.description}
                    onChange={(e) => setNewSpending({ ...newSpending, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="Category"
                    className="flex-1 bg-white/80 p-4 rounded-2xl text-xs font-bold outline-none border border-transparent focus:ring-4 focus:ring-emerald-100 transition-all"
                    value={newSpending.category}
                    onChange={(e) => setNewSpending({ ...newSpending, category: e.target.value })}
                  />
                  <button 
                    onClick={() => { if(newSpending.amount >= 0) { addSpending(newSpending); setNewSpending({ amount: 0, category: '', description: '' }); } }}
                    className="bg-slate-900 text-white px-8 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg font-bold text-xs uppercase tracking-widest"
                  >
                    Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Journal & Reflection */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-pink-200 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
              <PenLine size={120} strokeWidth={1} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10 font-serif italic">
              Today's Inner Narrative
            </h3>
            
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-6 relative z-10">How did I improve my reality today?</p>
            
            <textarea
              className="w-full bg-white/5 backdrop-blur-sm rounded-[2rem] p-6 text-slate-200 placeholder:text-slate-600 outline-none border border-white/5 focus:border-pink-500/20 transition-all min-h-[350px] text-lg font-serif italic relative z-10 shadow-inner"
              placeholder="Start typing your heart out..."
              value={currentReflection.reflection}
              onChange={(e) => updateField('reflection', e.target.value)}
            />

            <div className="mt-10 flex items-center gap-4 relative z-10">
              <div className="bg-pink-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-pink-500/20">
                <Heart size={20} fill="currentColor" strokeWidth={0} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Consistency is Bloom.
              </p>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white shadow-xl shadow-slate-900/5">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Efficiency Ratios (Hours)</h4>
             <div className="grid grid-cols-2 gap-6">
               <div>
                  <label className="text-[10px] font-bold text-emerald-500 uppercase mb-3 block text-center tracking-widest">Flow</label>
                  <input 
                    type="number" step="0.5" min="0" max="24"
                    value={currentReflection.timeUsage.productive}
                    onChange={(e) => updateField('timeUsage', { ...currentReflection.timeUsage, productive: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/60 rounded-3xl p-6 text-3xl font-bold text-emerald-800 outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-center border border-white"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-pink-500 uppercase mb-3 block text-center tracking-widest">Idle</label>
                  <input 
                    type="number" step="0.5" min="0" max="24"
                    value={currentReflection.timeUsage.unproductive}
                    onChange={(e) => updateField('timeUsage', { ...currentReflection.timeUsage, unproductive: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/60 rounded-3xl p-6 text-3xl font-bold text-pink-800 outline-none focus:ring-4 focus:ring-pink-100 transition-all text-center border border-white"
                  />
               </div>
             </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[2.5rem] border border-indigo-100/50 text-center backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 text-indigo-500 shadow-sm">
                 <Sparkles size={24} />
              </div>
              <p className="text-xs font-bold text-slate-700 mb-1">Decentralized Vault</p>
              <p className="text-[10px] text-slate-400 italic font-medium">Your data is yours alone, stored locally on this machine.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
