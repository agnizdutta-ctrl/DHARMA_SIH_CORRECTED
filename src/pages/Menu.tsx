import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers, Crown, Sparkles, BookOpen } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import { ERA_CATALOG, EraId } from '../types/era';

export const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentEra, setCurrentPage, setShowRulesModal } = useGameStore();
  const { play } = useAudio();

  const handleBackToLanding = () => {
    play('click');
    setCurrentPage('universal-landing');
    navigate('/');
  };

  const handleSelectEra = (eraId: EraId) => {
    play('cardPlay');
    setCurrentEra(eraId);
    setCurrentPage('era-landing');
    navigate(`/era/${eraId}`);
  };

  const eras = [
    {
      ...ERA_CATALOG.mughal,
      accentBorder: 'border-amber-400 hover:border-amber-500',
      accentBg: 'bg-amber-500/10 text-amber-900 border-amber-300',
      accentColorHex: '#D4AF37',
      cardGradient: 'hover:shadow-amber-500/20',
      btnBg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-stone-950 hover:brightness-110',
      tagText: 'text-amber-800'
    },
    {
      ...ERA_CATALOG.swaraj,
      accentBorder: 'border-orange-400 hover:border-orange-500',
      accentBg: 'bg-orange-500/10 text-orange-900 border-orange-300',
      accentColorHex: '#EA580C',
      cardGradient: 'hover:shadow-orange-500/20',
      btnBg: 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-stone-950 hover:brightness-110',
      tagText: 'text-orange-800'
    },
    {
      ...ERA_CATALOG.mahabharat,
      accentBorder: 'border-indigo-400 hover:border-indigo-500',
      accentBg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
      accentColorHex: '#312E81',
      cardGradient: 'hover:shadow-indigo-500/20',
      btnBg: 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white hover:brightness-110',
      tagText: 'text-indigo-800'
    }
  ];

  return (
    <div
      id="era-selection-menu-screen"
      className="min-h-screen w-full flex flex-col justify-between bg-[#FBF8F3] text-stone-900 select-none relative overflow-x-hidden"
      style={{
        backgroundImage: `radial-gradient(#E8DCC8 1px, transparent 1px), radial-gradient(#F0E5D3 1px, #FBF8F3 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px'
      }}
    >
      {/* Top Header with Back Button and Quick Rules */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center justify-between border-b border-stone-200/80 bg-white/70 backdrop-blur-md">
        <button
          id="back-to-universal-landing-btn"
          onClick={handleBackToLanding}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 bg-white/80 hover:bg-stone-100 text-stone-700 hover:text-stone-950 text-xs font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Landing</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="menu-how-to-play-btn"
            onClick={() => {
              play('click');
              setShowRulesModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white/60 hover:bg-white text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Game Rules</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 flex flex-col items-center justify-center">
        {/* Page Title & Subtitle */}
        <div className="text-center max-w-2xl mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-200/70 text-stone-700 text-[11px] font-semibold tracking-widest uppercase mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Select Your Historical Chronicle</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-stone-900 mb-3"
            style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
          >
            CHOOSE YOUR ERA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-stone-600 font-medium"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Three civilizations. One sovereign engine. Infinite history.
          </motion.p>
        </div>

        {/* 3 Horizontal Era Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
          {eras.map((era, index) => (
            <motion.div
              key={era.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 * (index + 1), ease: [0.16, 1, 0.3, 1] }}
              className={`group relative rounded-2xl bg-white border-2 ${era.accentBorder} shadow-lg ${era.cardGradient} transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden`}
            >
              {/* Card Header Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                <img
                  src={era.bannerImage}
                  alt={era.name}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== era.fallbackImage) {
                      target.src = era.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                {/* Era Symbol & Period Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-xl shadow-md border border-white/40">
                    {era.symbol}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-white/90 border border-white/10">
                    {era.period}
                  </span>
                </div>

                {/* Bottom title in banner */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3
                    className="text-2xl font-bold text-white tracking-wide drop-shadow-md"
                    style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
                  >
                    {era.name}
                  </h3>
                  <p className="text-xs text-stone-300 font-medium italic">
                    {era.hindiName} &bull; {era.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6 line-clamp-3">
                    {era.description}
                  </p>

                  {/* Pills: Card count & Ruler count & Crises */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold">
                      <Layers className="w-3.5 h-3.5 text-stone-500" />
                      {era.cardCount} Cards
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold">
                      <Crown className="w-3.5 h-3.5 text-amber-600" />
                      {era.rulerCount} Rulers
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${era.accentBg}`}>
                      {era.id === 'mughal' ? 'Famine & Nadir Shah' : era.id === 'swaraj' ? 'Rowlatt & Martial Law' : 'Lakshagriha & Kurukshetra'}
                    </span>
                  </div>
                </div>

                {/* Action: EXPLORE ERA Button */}
                <button
                  id={`explore-era-${era.id}-btn`}
                  onClick={() => handleSelectEra(era.id)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-widest uppercase ${era.btnBg} shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group/btn`}
                >
                  <span>EXPLORE ERA</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-stone-200/80 bg-white/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
        <div>
          <span>DHARMA Indian Historical Card Duel</span> &bull; <span>CLeMaR Unified Engine</span>
        </div>
        <div className="mt-2 sm:mt-0 font-medium text-stone-700">
          Select an era to load its authentic historical artifacts and duel arena
        </div>
      </footer>
    </div>
  );
};
