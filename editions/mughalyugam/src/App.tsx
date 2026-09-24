/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from './store/gameStore';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Arena } from './pages/Arena';
import { Chronicle } from './components/Chronicle';

export default function App() {
  const { currentPage, showRulesModal, setShowRulesModal } = useGameStore();

  return (
    <div className="w-full min-h-screen bg-[#E8F0EC] font-sans antialiased text-[#1A3326] selection:bg-[#D4AF37]/30">
      {currentPage === 'landing' && <Landing />}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'arena' && <Arena />}

      <Chronicle isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
    </div>
  );
}
