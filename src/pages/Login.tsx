import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

type Props = {
  onLogin?: () => void;
};

export default function Login({ onLogin }: Props) {
  const [name, setName] = useState('');
  const [storedName, setStoredName] = useLocalStorage<string | null>('user:name', null);
  const navigate = useNavigate();

  useEffect(() => {
    if (storedName) setName(storedName);
  }, [storedName]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length === 0) return;
    setStoredName(name.trim());
    // Mark session as authenticated and notify parent
    try { sessionStorage.setItem('user:auth', 'true'); } catch (e) {}
    if (onLogin) onLogin();
    // Always navigate to home after login
    navigate('/');
  }

  function handleSignOut() {
    setStoredName(null);
    setName('');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-slate-200 p-10 rounded-3xl shadow-lg"
      >
        <header className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">A</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome to Simple Planner</h1>
            <p className="text-sm text-slate-500">Sign in with your name to personalize your experience.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your name</label>
            <input
              aria-label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              className="w-1/2 text-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md"
            >
              Save & Continue
            </button>

            {storedName && (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium"
              >
                Sign out
              </button>
            )}
          </div>

          <div className="text-sm text-slate-500">
            Your name is stored locally in your browser. It won't be sent anywhere.
          </div>
        </form>
      </motion.div>
    </div>
  );
}
