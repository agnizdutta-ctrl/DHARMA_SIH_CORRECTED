import React from 'react';
import { motion } from 'motion/react';

interface PotDisplayProps {
  pot: number;
  deckCount: number;
}

export const PotDisplay: React.FC<PotDisplayProps> = ({ pot, deckCount }) => {
  return (
    <div className="flex items-center gap-6">
      {/* The Pot Pill */}
      <motion.div
        id="pot-pill-display"
        whileHover={{ scale: 1.04 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 215, 0, 0.45), inset 0 0 10px rgba(255, 255, 255, 0.3)',
            '0 0 35px rgba(255, 215, 0, 0.75), inset 0 0 15px rgba(255, 255, 255, 0.5)',
            '0 0 20px rgba(255, 215, 0, 0.45), inset 0 0 10px rgba(255, 255, 255, 0.3)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative group cursor-pointer"
      >
        <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFE55C] to-[#FFD700] border-2 border-white flex items-center gap-2.5 text-[#0A1224] shadow-lg">
          <span className="text-xl filter drop-shadow">☸</span>
          <div className="flex flex-col text-left">
            <span className="text-[9px] tracking-widest uppercase font-extrabold text-[#0A1224]/75">
              Mahabharat Pot
            </span>
            <span className="font-supremacy font-black text-lg tracking-wide leading-none text-[#0A1224]">
              POT: {pot} PTS
            </span>
          </div>
          <div className="ml-1 bg-[#1A4D8E] text-[#FFD700] px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
            Active
          </div>
        </div>
      </motion.div>

      {/* Deck Counter Pill */}
      <div
        id="deck-counter-pill"
        className="flex items-center gap-2 bg-[#1A4D8E]/80 border-2 border-[#FFD700]/50 px-3.5 py-1.5 rounded-full shadow text-[#FFD700] font-centrion font-bold text-xs"
      >
        <span className="text-sm">🂠</span>
        <span className="tracking-wide">
          DECK: <strong className="font-bold text-white">{deckCount}</strong>
        </span>
      </div>
    </div>
  );
};
