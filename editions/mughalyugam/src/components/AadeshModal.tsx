import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AadeshModalProps {
  isOpen: boolean;
  playerName: string;
  onSelectCategory: (category: 'C' | 'L' | 'M' | 'R') => void;
  onCancel: () => void;
}

const CATEGORIES = [
  {
    id: 'C' as const,
    name: 'Creator (C)',
    points: 8,
    symbol: '👑',
    color: '#D4AF37',
    border: 'border-[#D4AF37]',
    bg: 'from-[#B7950B]/30 to-[#163828]',
    hoverBg: 'hover:border-[#F4D03F] hover:bg-[#D4AF37]/20',
    desc: 'Foundational Emperors & Sovereigns (8 pts)'
  },
  {
    id: 'L' as const,
    name: 'Legislature (L)',
    points: 6,
    symbol: '⚖️',
    color: '#8E44AD',
    border: 'border-[#8E44AD]',
    bg: 'from-[#8E44AD]/30 to-[#163828]',
    hoverBg: 'hover:border-[#BB8FCE] hover:bg-[#8E44AD]/20',
    desc: 'Imperial Law, Farman & Coinage (6 pts)'
  },
  {
    id: 'M' as const,
    name: 'Marvel (M)',
    points: 4,
    symbol: '🏛️',
    color: '#2980B9',
    border: 'border-[#2980B9]',
    bg: 'from-[#2980B9]/30 to-[#163828]',
    hoverBg: 'hover:border-[#5DADE2] hover:bg-[#2980B9]/20',
    desc: 'Taj Mahal, Red Fort & Monuments (4 pts)'
  },
  {
    id: 'R' as const,
    name: 'Region (R)',
    points: 2,
    symbol: '🗺️',
    color: '#27AE60',
    border: 'border-[#27AE60]',
    bg: 'from-[#27AE60]/30 to-[#163828]',
    hoverBg: 'hover:border-[#58D68D] hover:bg-[#27AE60]/20',
    desc: 'Subahs, Deccan, Bengal & Frontiers (2 pts)'
  }
];

export const AadeshModal: React.FC<AadeshModalProps> = ({
  isOpen,
  playerName,
  onSelectCategory,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="aadesh-modal-overlay"
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-gradient-to-b from-[#163828] via-[#0E2419] to-[#081710] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(212,175,55,0.35)] relative overflow-hidden"
          >
            {/* Corner Filigrees */}
            <div className="absolute top-2 left-3 text-xs text-[#D4AF37]/50 pointer-events-none">⚜</div>
            <div className="absolute top-2 right-3 text-xs text-[#D4AF37]/50 pointer-events-none">⚜</div>
            <div className="absolute bottom-2 left-3 text-xs text-[#D4AF37]/40 pointer-events-none">⚜</div>
            <div className="absolute bottom-2 right-3 text-xs text-[#D4AF37]/40 pointer-events-none">⚜</div>

            {/* Modal Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#8E44AD]/30 border border-[#8E44AD] text-2xl mb-2 shadow-inner">
                📜
              </div>
              <span className="text-[10px] font-kate uppercase tracking-[0.25em] text-[#D4AF37] font-black block">
                Royal Farman · Aadesh Card
              </span>
              <h3 className="font-supremacy text-xl sm:text-2xl font-black text-[#FDFBF7] mt-0.5">
                Issue Imperial Command
              </h3>
              <p className="text-xs text-amber-100/75 max-w-md mx-auto mt-1 leading-relaxed">
                <span className="text-[#F4D03F] font-bold">{playerName}</span>, declare the required category. The next chronicler <span className="text-white font-semibold">MUST</span> play this category or another Wild card!
              </p>
            </div>

            {/* 4 Category Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border-2 ${cat.border} bg-gradient-to-r ${cat.bg} ${cat.hoverBg} text-left transition-all duration-150 flex items-center gap-3 cursor-pointer group shadow-md hover:scale-[1.02]`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow border border-white/20"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.symbol}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-kate font-bold text-sm text-white group-hover:text-[#F4D03F] transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-mono font-black text-[#55EFC4] bg-black/40 px-1.5 py-0.5 rounded">
                        +{cat.points} pts
                      </span>
                    </div>
                    <span className="text-[10.5px] text-amber-100/70 block truncate mt-0.5">
                      {cat.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Cancel Button */}
            <div className="flex justify-center">
              <button
                onClick={onCancel}
                className="px-6 py-2 rounded-full bg-black/40 border border-[#D4AF37]/30 text-amber-200/70 text-xs font-kate font-bold hover:text-white hover:border-[#D4AF37] transition cursor-pointer"
              >
                Cancel &amp; Keep Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
