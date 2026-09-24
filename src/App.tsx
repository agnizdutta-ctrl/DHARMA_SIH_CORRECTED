/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { UniversalLanding } from './pages/UniversalLanding';
import { Menu } from './pages/Menu';
import { EraLandingPage } from './pages/EraLandingPage';
import { Arena } from './pages/Arena';
import { Dashboard } from './pages/Dashboard';
import { Chronicle } from './components/Chronicle';
import { applyTheme } from './theme/themeManager';

function AppContent() {
  const { currentEra, showRulesModal, setShowRulesModal } = useGameStore();

  useEffect(() => {
    applyTheme(currentEra);
  }, [currentEra]);

  return (
    <div className="w-full min-h-screen bg-[#0A0E17] font-sans antialiased text-[#F8FAFC]">
      <Routes>
        {/* Screen 1: Universal DHARMA Landing Page */}
        <Route path="/" element={<UniversalLanding />} />

        {/* Screen 2: Menu Page (Choose Your Era) */}
        <Route path="/menu" element={<Menu />} />

        {/* Screen 3: Era-Specific Landing Pages */}
        <Route path="/era/:eraId" element={<EraLandingPage />} />
        <Route path="/era" element={<EraLandingPage />} />

        {/* Screen 4: Duel Battlefield Arena */}
        <Route path="/arena" element={<Arena />} />

        {/* Analytical Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Fallback to Screen 1 */}
        <Route path="*" element={<UniversalLanding />} />
      </Routes>

      {/* Global Rules & Chronicle Codex Modal */}
      <Chronicle isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
