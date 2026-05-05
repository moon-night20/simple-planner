/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import IslamicTracker from './pages/IslamicTracker';
import StudyPlanner from './pages/StudyPlanner';
import PersonalityTracker from './pages/PersonalityTracker';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/islamic" element={<IslamicTracker />} />
          <Route path="/study" element={<StudyPlanner />} />
          <Route path="/personality" element={<PersonalityTracker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
