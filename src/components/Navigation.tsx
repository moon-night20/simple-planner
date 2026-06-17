import { NavLink } from 'react-router-dom';
import { Home, Moon, BookOpen, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard', activeColor: 'text-gray-900', bgColor: 'bg-gray-100' },
  { path: '/islamic', icon: Moon, label: 'Spiritual', activeColor: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  { path: '/study', icon: BookOpen, label: 'Study', activeColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  { path: '/personality', icon: Heart, label: 'Growth', activeColor: 'text-rose-700', bgColor: 'bg-rose-50' },
  { path: '/login', icon: Moon, label: 'Profile', activeColor: 'text-indigo-700', bgColor: 'bg-indigo-50' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top navigation for md+ and mobile header */}
      <header className="w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3 md:py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg">
              <Moon size={16} />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">Simple Planner</h1>
              <UserBadge />
            </div>
          </div>

          {/* Desktop nav items */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-150 font-semibold",
                    isActive
                      ? "text-indigo-600 bg-indigo-50/80 backdrop-blur-sm shadow-sm border border-indigo-100/50"
                      : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
                  )
                }
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ y: -300 }}
            animate={{ y: 0 }}
            exit={{ y: -300 }}
            className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 p-6"
          >
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg">
                  <Moon size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">Simple Planner</h1>
                  <UserBadge />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
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

            <div className="mt-6 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-100/50 backdrop-blur-sm">
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1">Daily Quote</p>
              <p className="text-sm text-slate-600 italic">"The best way to predict the future is to create it."</p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function UserBadge() {
  const [name] = useLocalStorage<string | null>('user:name', null);

  if (!name) {
    return <div className="text-xs text-indigo-600 font-medium">Not signed in</div>;
  }

  return <div className="text-sm font-semibold text-slate-700">Hi, {name.split(' ')[0]}</div>;
}
