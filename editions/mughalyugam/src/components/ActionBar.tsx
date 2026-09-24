import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

interface ActionBarProps {
  isMyTurn: boolean;
  canPlayCard: boolean;
  onPlaySelectedCard: () => void;
  onDrawCard: () => void;
  onTimeout?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  isMyTurn,
  canPlayCard,
  onPlaySelectedCard,
  onDrawCard
}) => {
  const {
    settings,
    updateSettings,
    setShowRulesModal,
    selectedCardId,
    selectedTargetNodeId
  } = useGameStore();

  return (
    <section
      id="action-bar-strip"
      className="w-full flex items-center justify-between px-4 sm:px-8 py-2 bg-[#D4E4DC]/85 backdrop-blur-md border-y border-[#1A3326]/10 shadow-sm"
    >
      {/* Left: Quick Actions & Help */}
      <div className="flex items-center gap-3">
        <button
          id="btn-view-chronicle-rules"
          onClick={() => setShowRulesModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F0EC] border border-[#1A3326]/20 text-xs font-bold text-[#1A3326] hover:bg-[#1A3326] hover:text-[#E8F0EC] transition cursor-pointer"
        >
          <span>📜</span>
          <span>Imperial Codex (Rules)</span>
        </button>

        <button
          id="btn-toggle-sound"
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className="p-2 rounded-full bg-[#E8F0EC] border border-[#1A3326]/20 text-[#1A3326] hover:bg-[#1A3326]/10 transition cursor-pointer"
          title={settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
        >
          {settings.soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Center: Main Turn Controls */}
      <div className="flex items-center gap-4">
        {/* Play Move Button */}
        <motion.button
          id="btn-play-card-action"
          whileHover={{ scale: canPlayCard ? 1.05 : 1 }}
          whileTap={{ scale: canPlayCard ? 0.96 : 1 }}
          disabled={!canPlayCard}
          onClick={onPlaySelectedCard}
          className={`px-8 py-2.5 rounded-full font-kate text-sm font-black tracking-widest uppercase shadow-md transition cursor-pointer flex items-center gap-2 ${
            canPlayCard
              ? 'bg-[#E07A5F] text-white hover:bg-[#d46a4e] ring-2 ring-[#E07A5F]/50 animate-pulse'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>⚔</span>
          <span>
            {selectedCardId && !selectedTargetNodeId
              ? 'Pick Target Slot In Chain'
              : canPlayCard
              ? 'Commit Card To Table'
              : 'Select Card to Play'}
          </span>
        </motion.button>

        {/* Draw Card Button */}
        <button
          id="btn-draw-card-action"
          disabled={!isMyTurn}
          onClick={onDrawCard}
          className={`px-5 py-2 rounded-full font-centrion text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
            isMyTurn
              ? 'bg-[#E8F0EC] border-[#1A3326]/40 text-[#1A3326] hover:bg-[#1A3326] hover:text-[#E8F0EC]'
              : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>🂠</span>
          <span>Draw Card (-1 pt penalty)</span>
        </button>
      </div>

      {/* Right: Manual Mode Indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <span className="text-[11px] font-kate uppercase font-bold tracking-wider text-[#1A3326]/80">
          Manual Hotseat Duel
        </span>
      </div>
    </section>
  );
};
