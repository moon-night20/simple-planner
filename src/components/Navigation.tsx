import { NavLink } from 'react-router-dom';
import { Home, Moon, BookOpen, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard', activeColor: 'text-gray-900', bgColor: 'bg-gray-100' },
  { path: '/islamic', icon: Moon, label: 'Spiritual', activeColor: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  { path: '/study', icon: BookOpen, label: 'Study', activeColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  { path: '/personality', icon: Heart, label: 'Growth', activeColor: 'text-rose-700', bgColor: 'bg-rose-50' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Moon size={16} />
          </div>
          <span className="font-bold tracking-tight text-slate-800">Simple Planner</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for Desktop / Mobile Menu */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.nav
            initial={window.innerWidth < 768 ? { x: -300 } : {}}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-white/60 backdrop-blur-xl border-r border-slate-200/50 p-6 flex flex-col transition-all duration-300 md:static md:translate-x-0",
              isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}
          >
            <div className="mb-10 hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <Moon size={20} />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                Simple Planner
              </h1>
            </div>

            <div className="flex-1 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-semibold",
                      isActive 
                        ? cn("text-indigo-600 bg-indigo-50/80 backdrop-blur-sm shadow-sm border border-indigo-100/50")
                        : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-900"
                    )
                  }
                >
                  <item.icon size={20} className="transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-auto p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-100/50 backdrop-blur-sm">
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1">Daily Quote</p>
              <p className="text-sm text-slate-600 italic">"The best way to predict the future is to create it."</p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
