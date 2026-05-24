/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import IslamicTracker from './pages/IslamicTracker';
import StudyPlanner from './pages/StudyPlanner';
import PersonalityTracker from './pages/PersonalityTracker';
import Login from './pages/Login';
import { useLocalStorage } from './hooks/useLocalStorage';
// Navigate already imported above

export default function App() {
  const [name] = useLocalStorage<string | null>('user:name', null);
  // Track session authentication separately so the app always starts at the login
  // screen each new browser session. This uses sessionStorage and is reset when
  // the browser/tab is closed.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('user:auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Wrapper component used on protected routes to ensure Layout receives nested pages
  function LayoutWrapper() {
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  }

  // Protect routes and remember where the user was trying to go
  function RequireAuth() {
    const location = useLocation();
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <Outlet />;
  }

  return (
    <Router>
      <Routes>
       
          <Route
            path="/login"
            element={<Login onLogin={() => {
              setIsAuthenticated(true);
              try { sessionStorage.setItem('user:auth', 'true'); } catch (e) {}
            }} />}
          />
        {/* Protected routes */}
        <Route element={<RequireAuth /> }>
          <Route element={<LayoutWrapper /> }>
            <Route path="/" element={<Home />} />
            <Route path="/islamic" element={<IslamicTracker />} />
            <Route path="/study" element={<StudyPlanner />} />
            <Route path="/personality" element={<PersonalityTracker />} />
            
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>
    </Router>
  );
}
