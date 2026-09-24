import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Settings, Shield, BookOpen, Trophy, Sparkles, ArrowRight, Play } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';

// Curated authentic uploaded Indian heritage imagery spanning all three epic eras
const UNIVERSAL_HERITAGE_IMAGES = [
  {
    id: 'mughal-elephant-court',
    src: '/33.jpeg',
    fallback: '/new image 33.jpeg',
    title: 'Imperial Mughal Throne & River Procession',
    era: 'Mughal Yugam (1526–1707 CE)',
    caption: 'Majestic elephant cavalcades, marble river pavilions and royal dynastic splendor'
  },
  {
    id: 'swaraj-mangal-pandey',
    src: '/Mangal Pandey  _Biography_ History, Role in the Revolt of 1857_.jpg',
    fallback: '/Population Density of the British Indian Empire, 1909.jpg',
    title: 'The Clarion of Swaraj (1857)',
    era: 'Swaraj Yug (1857–1947 CE)',
    caption: 'Barrackpore defiance and the first epic uprising for India’s sovereign liberty'
  },
  {
    id: 'mahabharata-kurukshetra',
    src: '/murakami-drunkruj-kurukshetra.jpg',
    fallback: '/Murakami (@drunkruj) on X.jpg',
    title: 'The Cosmic Chariot of Kurukshetra',
    era: 'Mahabharata Yugam (Dvapara Yuga)',
    caption: 'Krishna and Arjuna standing steadfast at the pivotal crossroad of righteous Dharma'
  },
  {
    id: 'mughal-palace-garden',
    src: '/Traditional mughal decorative palace and garden - PRAKASH MEENA.jpeg',
    fallback: '/Vintage mughal garden wallpaper mural with peacock and floral tree wall decor for home interior design Stock Illustration _ Adobe Stock - Copy.jpeg',
    title: 'The Shalimar Court & Royal Gardens',
    era: 'Mughal Yugam (1526–1707 CE)',
    caption: 'Symmetrical Charbagh waterways, ornate jali screens and timeless miniature craftsmanship'
  }
];

export const UniversalLanding: React.FC = () => {
  const navigate = useNavigate();
  const { setShowRulesModal, settings, updateSettings, setCurrentPage } = useGameStore();
  const { play } = useAudio();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Dynamic heritage background cycling every 2 seconds with smooth cross-fade & Ken Burns zoom
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % UNIVERSAL_HERITAGE_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleEnterCourt = () => {
    play('cardPlay');
    setCurrentPage('menu');
    navigate('/menu');
  };

  const handleOpenHowToPlay = () => {
    play('click');
    setShowRulesModal(true);
  };

  const currentImg = UNIVERSAL_HERITAGE_IMAGES[currentImageIndex];

  return (
    <div
      id="universal-landing-screen"
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#080B10] text-[#F8FAFC] overflow-hidden select-none"
    >
      {/* 1. Full Viewport Dynamic Background with Ken Burns Zoom (Every 2s) - 90%+ Visible */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={currentImg.src}
            alt={currentImg.title}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== currentImg.fallback) {
                target.src = currentImg.fallback;
              }
            }}
            initial={{ opacity: 0.8, scale: 1.02 }}
            animate={{
              opacity: 0.94,
              scale: 1.08,
              transition: {
                opacity: { duration: 0.7, ease: 'easeInOut' },
                scale: { duration: 5, ease: 'easeOut' }
              }
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.7, ease: 'easeInOut' }
            }}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96] contrast-[1.04]"
          />
        </AnimatePresence>

        {/* Minimalist edge scrims for navigation & footer readability, leaving 90%+ of the central image crystal clear */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

        {/* Warm Golden Ambient Glows instead of cold blue blur */}
        <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-yellow-500/15 blur-3xl" />
        </div>
      </div>

      {/* 2. Top Navigation Bar */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/30">
        {/* Brand Logo & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-black to-indigo-900/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <span className="text-xl select-none">🕉️</span>
          </div>
          <div>
            <span
              className="text-lg font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 drop-shadow"
              style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
            >
              DHARMA
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-amber-200/60 font-medium -mt-0.5">
              Chronicles of Bharat
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-semibold text-slate-300">
          <button
            id="nav-play-btn"
            onClick={handleEnterCourt}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-white/5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            Play
          </button>
          <button
            id="nav-rules-btn"
            onClick={handleOpenHowToPlay}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-white/5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            How To Play
          </button>
          <button
            id="nav-leaderboard-btn"
            onClick={() => {
              play('click');
              alert('Leaderboard chronicles are updated upon match victory.');
            }}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-white/5 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Leaderboard
          </button>
          <button
            id="nav-about-btn"
            onClick={() => {
              play('click');
              setShowAboutModal(true);
            }}
            className="hover:text-amber-300 transition-colors flex items-center gap-1.5 py-1 px-2 rounded hover:bg-white/5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            About
          </button>
        </nav>

        {/* Right Tools (Sound, Music, Settings) */}
        <div className="flex items-center gap-3">
          <button
            id="sound-toggle-btn"
            onClick={() => {
              play('click');
              updateSettings({ soundEnabled: !settings.soundEnabled });
            }}
            title={settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          <button
            id="settings-toggle-btn"
            onClick={() => {
              play('click');
              setShowSettingsModal(true);
            }}
            title="Settings"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Hero Section with Glassmorphic Center Card & Staggered Reveal */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-5xl mx-auto w-full text-center">
        {/* Active Era Indicator badge at top of card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-black/60 backdrop-blur-md text-[11px] uppercase tracking-widest text-amber-300 font-semibold shadow-lg shadow-black/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Unified Indian History Card Engine</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-amber-100 font-normal">CLeMaR Protocol</span>
        </motion.div>

        {/* Central Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-2xl border border-amber-400/35 bg-black/55 backdrop-blur-md p-8 sm:p-12 shadow-[0_12px_48px_rgba(0,0,0,0.7)] overflow-hidden"
        >
          {/* Subtle gold ornamental corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400/50" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400/50" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400/50" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400/50" />

          {/* Majestic Title in Supremacy / Cinzel Decorative Font */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 drop-shadow-[0_4px_16px_rgba(212,175,55,0.45)] mb-2"
            style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
          >
            DHARMA
          </motion.h1>

          {/* Subtitle in Kate / Cormorant Garamond Font */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl sm:text-3xl italic tracking-wide text-amber-200/90 font-medium mb-3"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            The Chronicles of Bharat
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-sm sm:text-base font-normal tracking-wide text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Three civilizations. One sovereign engine. Infinite history.
            <br />
            <span className="text-xs text-amber-300/80 font-mono mt-1 block">
              Mughal Yugam &bull; Swaraj Yug &bull; Mahabharata Yugam
            </span>
          </motion.p>

          {/* Primary & Ghost Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            {/* Primary ENTER THE COURT Button */}
            <button
              id="enter-court-btn"
              onClick={handleEnterCourt}
              className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>ENTER THE COURT</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Ghost HOW TO PLAY Button */}
            <button
              id="how-to-play-ghost-btn"
              onClick={handleOpenHowToPlay}
              className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 rounded-xl font-semibold text-sm tracking-widest uppercase border border-white/20 bg-white/5 hover:bg-white/10 hover:border-amber-400/40 text-slate-200 hover:text-amber-200 active:scale-[0.98] transition-all backdrop-blur-md flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>HOW TO PLAY</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Current Heritage Backdrop Info Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] text-slate-400 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-amber-200 font-medium">{currentImg.era}:</span>
          <span className="truncate max-w-xs">{currentImg.title}</span>
        </motion.div>
      </main>

      {/* 4. Footer */}
      <footer className="relative z-10 w-full px-6 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 bg-black/40 backdrop-blur-md text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span>&copy; DHARMA Card Gaming Protocol</span>
          <span className="text-white/20">&bull;</span>
          <span>52 Cards &bull; 9 Rulers &bull; 4 Categories</span>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-4 text-amber-300/80">
          <span>CLeMaR: Category &bull; Lineage &bull; Marvel &bull; Region</span>
        </div>
      </footer>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1120] border border-amber-400/30 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl">
            <h3
              className="text-xl font-bold text-amber-300 mb-2 uppercase tracking-wider"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              About DHARMA: Chronicles of Bharat
            </h3>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              DHARMA is a unified Indian historical card duel engine based on the CLeMaR taxonomy. Players engage in tactical hand-shedding combat across three distinct epochs of Bharat:
            </p>
            <ul className="text-xs space-y-2 text-slate-400 mb-6">
              <li><strong className="text-amber-300">Mughal Yugam:</strong> Imperial court intrigues, dynastic lineages from Babur to Aurangzeb, and royal wealth.</li>
              <li><strong className="text-orange-400">Swaraj Yug:</strong> Vanguard of freedom fighters from Mangal Pandey in 1857 to Mahatma Gandhi and INA in 1947.</li>
              <li><strong className="text-indigo-400">Mahabharata Yugam:</strong> Cosmic war of Kurukshetra, divine astras, Shakuni’s dice, and Krishna’s righteousness.</li>
            </ul>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold uppercase tracking-wider text-xs hover:bg-amber-400 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1120] border border-amber-400/30 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl">
            <h3
              className="text-lg font-bold text-amber-300 mb-4 uppercase tracking-wider"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Game Settings
            </h3>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex items-center justify-between">
                <span>Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Ambient Music</span>
                <input
                  type="checkbox"
                  checked={settings.musicEnabled}
                  onChange={(e) => updateSettings({ musicEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Visual Particles</span>
                <input
                  type="checkbox"
                  checked={settings.particlesEnabled}
                  onChange={(e) => updateSettings({ particlesEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-lg bg-amber-500 text-black font-bold uppercase tracking-wider text-xs hover:bg-amber-400 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
