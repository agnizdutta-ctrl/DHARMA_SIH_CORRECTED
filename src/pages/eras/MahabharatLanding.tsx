import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useAudio } from '../../hooks/useAudio';

// The 4 user-provided Mahabharata images with local paths and verified fallbacks
const MAHABHARATA_LANDING_IMAGES = [
  {
    id: 'krishna-arjuna-chariot',
    src: '/download.jpg',
    fallback: '/download.jpeg',
    title: 'Partha-Sarathi',
    subtitle: 'Lord Krishna & Arjuna at Kurukshetra',
    alt: 'Lord Krishna driving Arjuna chariot at Kurukshetra',
    desc: 'Lord Krishna holding the divine reins, guiding Arjuna wielding the celestial Gandiva bow amidst the golden solar aura.'
  },
  {
    id: 'kurukshetra-chariot-wheel',
    src: '/Murakami (@drunkruj) on X.jpg',
    fallback: '/murakami-drunkruj-kurukshetra.jpg',
    title: 'The Great Defense',
    subtitle: 'The Kurukshetra Chariot Wheel Stand',
    alt: 'Heroic warrior wielding the great chariot wheel amid dust and falling arrows',
    desc: 'The heroic warrior raising a massive chariot wheel to deflect showers of arrows in the tempest of Kurukshetra.'
  },
  {
    id: 'karna-surya-putra',
    src: '/karna mahabharat.jpg',
    fallback: '/karna-mahabharat.jpg',
    title: 'Karna: Surya-Putra',
    subtitle: 'Golden Armor & Vijaya Bow',
    alt: 'Karna in golden armor shooting a lightning-charged arrow',
    desc: 'Karna in celestial golden Kavacha standing atop the rugged battlefield, drawing a lightning-charged arrow on the Vijaya bow.'
  },
  {
    id: 'clash-of-astras',
    src: '/download (1).jpg',
    fallback: '/download-1.jpg',
    title: 'Clash of Astras',
    subtitle: 'Parashurama & Celestial Warriors',
    alt: 'Epic martial duel between axe warrior and celestial wielder',
    desc: 'The mythical duel of cosmic Astras and battleaxes, unleashing raw cosmic force across the heavens.'
  }
];

export const MahabharatLanding: React.FC = () => {
  const navigate = useNavigate();
  const { setShowRulesModal, settings, updateSettings, startDualPlayerGame, rounds, setCurrentPage } = useGameStore();
  const { play } = useAudio();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<number | null>(null);

  // Background cycling every 3.5 seconds with smooth cross-fade
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % MAHABHARATA_LANDING_IMAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleEnterCourt = () => {
    play('cardPlay');
    play('fluteFlourish');
    startDualPlayerGame(rounds || 7);
    setCurrentPage('arena');
    navigate('/arena');
  };

  const handleBackToMenu = () => {
    play('click');
    setCurrentPage('menu');
    navigate('/menu');
  };

  const currentImg = MAHABHARATA_LANDING_IMAGES[currentImageIndex];

  return (
    <div
      id="landing-screen"
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#0A1224] text-[#FDF6E2] overflow-x-hidden select-none"
    >
      {/* 1. Dynamic Living Mahabharata Background Gallery */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={currentImg.src}
            onError={(e) => {
              if (e.currentTarget.src !== currentImg.fallback) {
                e.currentTarget.src = currentImg.fallback;
              }
            }}
            alt={currentImg.alt}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{ opacity: 0.92, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.8, ease: 'easeInOut' },
              scale: { duration: 3.5, ease: 'linear' }
            }}
            className="absolute inset-0 w-screen h-screen object-cover object-center filter brightness-[0.96] contrast-[1.05]"
            style={{ width: '100vw', height: '100vh' }}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Minimal edge vignette to ensure text legibility while keeping the imagery 90%+ visible and vibrant without dark blue fog */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* Floating Royal Gold & Spiritual Purple Astral Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 22 }).map((_, i) => {
          const particleColors = ['#FFD700', '#1A4D8E', '#4CAF50', '#A52A2A', '#800080'];
          const pColor = particleColors[i % particleColors.length];
          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0.2 + (i % 5) * 0.12,
                y: '105vh',
                x: `${(i * 4.9 + 2) % 100}vw`
              }}
              animate={{
                y: '-10vh',
                opacity: [0.15, 0.85, 0]
              }}
              transition={{
                duration: 7 + (i % 5) * 2,
                repeat: Infinity,
                delay: (i * 0.4) % 4,
                ease: 'linear'
              }}
              className="absolute rounded-full blur-[0.5px]"
              style={{
                backgroundColor: pColor,
                width: `${2.5 + (i % 3)}px`,
                height: `${2.5 + (i % 3)}px`,
                boxShadow: `0 0 8px ${pColor}`
              }}
            />
          );
        })}
      </div>

      {/* 2. Rotating Sudarshana & Dharma Chakra Watermark (Top Right in Royal Gold #FFD700) */}
      <div className="absolute -top-16 -right-16 w-96 h-96 pointer-events-none opacity-[0.09] z-10">
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
          viewBox="0 0 100 100"
          className="w-full h-full stroke-[#FFD700] fill-none"
          strokeWidth="1.2"
        >
          <circle cx="50" cy="50" r="46" />
          <circle cx="50" cy="50" r="14" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 46 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 46 * Math.sin((i * 15 * Math.PI) / 180)}
            />
          ))}
        </motion.svg>
      </div>

      {/* 3. Top Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full border-2 border-[#FFD700] bg-gradient-to-br from-[#1A4D8E] to-[#800080] backdrop-blur-md flex items-center justify-center text-lg text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]">
            ☸
          </div>
          <div>
            <h1 className="font-supremacy text-xl font-black tracking-widest text-[#FDFBF7]">
              DHARMA
            </h1>
            <span className="text-[9.5px] uppercase font-kate tracking-[0.3em] text-[#FFD700] font-bold block -mt-0.5">
              MAHABHARAT · KURUKSHETRA YUGA
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="back-to-menu-btn"
            onClick={handleBackToMenu}
            className="px-3.5 py-2 rounded-full border-2 border-[#FFD700]/70 bg-[#1A4D8E]/80 hover:bg-[#FFD700] hover:text-[#0A1224] text-xs font-kate font-bold text-[#FFD700] transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Choose Era</span>
          </button>

          <button
            onClick={() => {
              play('tanpuraPluck');
              setShowRulesModal(true);
            }}
            className="px-4 py-2 rounded-full border-2 border-[#FFD700]/70 bg-[#1A4D8E]/80 hover:bg-[#FFD700] hover:text-[#0A1224] text-xs font-kate font-bold text-[#FFD700] hover:border-[#FFD700] transition cursor-pointer flex items-center gap-2 backdrop-blur-md shadow-lg"
          >
            <span>📜</span>
            <span>Rules &amp; Codex</span>
          </button>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="w-10 h-10 rounded-full border-2 border-[#FFD700]/60 bg-[#800080]/70 hover:bg-[#800080] backdrop-blur-md flex items-center justify-center text-sm transition cursor-pointer hover:border-[#FFD700] text-[#FFD700] shadow-lg"
            title={settings.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* 4. Central Grand Glassmorphic Card (Styled with the 5 sacred colors) */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center text-center z-20 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="relative w-full rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#102347]/90 via-[#1A1838]/90 to-[#1B072B]/95 border-2 border-[#FFD700]/70 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col items-center"
        >
          {/* Decorative Corner Filigree Motifs in Royal Gold #FFD700 */}
          <div className="absolute top-3 left-3 text-sm text-[#FFD700] select-none">⚜</div>
          <div className="absolute top-3 right-3 text-sm text-[#FFD700] select-none">⚜</div>
          <div className="absolute bottom-3 left-3 text-sm text-[#FFD700] select-none">⚜</div>
          <div className="absolute bottom-3 right-3 text-sm text-[#FFD700] select-none">⚜</div>

          {/* Version Badge: EXACT requested string "MAHABHARAT WORLD " in Royal Gold + Sage Green jewel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#1A4D8E]/80 via-[#800080]/80 to-[#1A4D8E]/80 border-2 border-[#FFD700] text-[#FFD700] text-[10.5px] sm:text-xs font-kate font-extrabold uppercase tracking-[0.25em] mb-4 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#4CAF50] shadow-[0_0_8px_#4CAF50] animate-pulse" />
            <span>MAHABHARAT WORLD </span>
          </motion.div>

          {/* Title: DHARMA in shining Royal Gold #FFD700 */}
          <div className="flex justify-center items-center gap-1 sm:gap-2.5 my-1">
            {'DHARMA'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6 + index * 0.08,
                  type: 'spring',
                  stiffness: 150
                }}
                className="font-supremacy text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD700] to-[#E6B800] filter drop-shadow-[0_4px_16px_rgba(26,77,142,0.8)]"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
            className="font-kate text-sm sm:text-base uppercase tracking-[0.4em] text-[#FFD700] font-bold mt-1"
          >
            The Epic of Kurukshetra
          </motion.h2>

          {/* Golden Solar Ornament Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 0.85, scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 my-4 w-full max-w-xs justify-center opacity-85"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#FFD700] to-[#FFD700]" />
            <span className="text-[#FFD700] text-sm">☸</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#FFD700] to-[#FFD700]" />
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <p className="font-editorial italic text-base sm:text-lg text-[#FDF6E2] max-w-xl leading-relaxed">
              &ldquo;Where Duty Determines Destiny. Where Dharma Overcomes All Empires.&rdquo;
            </p>

            <p className="font-centrion text-xs sm:text-sm text-amber-100/80 max-w-xl mt-2 leading-normal">
              A strategic pass-and-play card duel. Chain Creators, Dharma doctrines, and divine Astras across 52 authentic Mahabharata cards.
            </p>
          </motion.div>

          {/* SACRED MAHABHARAT PALETTE EMBLEMS: 5 COLORS */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6, ease: 'easeOut' }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-5 w-full max-w-2xl px-2"
          >
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A4D8E]/40 border border-[#1A4D8E] text-[10px] font-kate font-bold text-sky-200">
              <span className="w-2 h-2 rounded-full bg-[#1A4D8E] shadow-[0_0_6px_#1A4D8E]" />
              Dharma Blue
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A52A2A]/40 border border-[#A52A2A] text-[10px] font-kate font-bold text-red-200">
              <span className="w-2 h-2 rounded-full bg-[#A52A2A] shadow-[0_0_6px_#A52A2A]" />
              Warrior Red
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4CAF50]/30 border border-[#4CAF50] text-[10px] font-kate font-bold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] shadow-[0_0_6px_#4CAF50]" />
              Sage Green
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFD700]/25 border border-[#FFD700] text-[10px] font-kate font-bold text-[#FFD700]">
              <span className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_6px_#FFD700]" />
              Royal Gold
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#800080]/40 border border-[#800080] text-[10px] font-kate font-bold text-purple-200">
              <span className="w-2 h-2 rounded-full bg-[#800080] shadow-[0_0_6px_#800080]" />
              Mystic Purple
            </span>
          </motion.div>

          {/* 4 USER-PROVIDED MAHABHARATA IMAGES GALLERY SHOWCASE */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6, ease: 'easeOut' }}
            className="w-full mt-6 pt-5 border-t border-[#FFD700]/30"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] sm:text-[11px] font-kate uppercase tracking-[0.2em] text-[#FFD700] font-bold flex items-center gap-1.5">
                <span>🏹</span>
                <span>Four Chronicles of Mahabharat</span>
              </span>
              <span className="text-[9.5px] text-amber-200/70 font-mono hidden sm:inline">
                Click any chronicle to spotlight
              </span>
            </div>

            {/* 4 Image Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full">
              {MAHABHARATA_LANDING_IMAGES.map((item, idx) => {
                const isActive = currentImageIndex === idx;
                const borderColors = ['#1A4D8E', '#A52A2A', '#FFD700', '#800080'];
                const cardAccent = borderColors[idx % borderColors.length];
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      play('cardHover');
                      setCurrentImageIndex(idx);
                      setSelectedPreviewImage(idx);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 text-left group cursor-pointer aspect-[4/3] bg-black/60 ${
                      isActive
                        ? 'border-[#FFD700] ring-2 ring-[#FFD700]/80 scale-[1.03] shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                        : 'border-[#FFD700]/40 hover:border-[#FFD700] opacity-85 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={item.src}
                      onError={(e) => {
                        if (e.currentTarget.src !== item.fallback) {
                          e.currentTarget.src = item.fallback;
                        }
                      }}
                      alt={item.alt}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex flex-col justify-end">
                      <span className="text-[9px] sm:text-[10px] font-kate font-bold text-[#FFD700] leading-tight block truncate">
                        {item.title}
                      </span>
                      <span className="text-[8px] sm:text-[8.5px] text-amber-100/80 block truncate">
                        {item.subtitle}
                      </span>
                    </div>
                    {isActive && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#4CAF50] shadow-[0_0_8px_#4CAF50] animate-ping" />
                    )}
                    <div
                      className="absolute top-0 left-0 h-1 w-full"
                      style={{ backgroundColor: cardAccent }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Active Image Caption Banner */}
            <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-[#1A4D8E]/70 via-[#800080]/60 to-[#102347]/80 border border-[#FFD700]/40 flex items-center justify-between text-left gap-2 text-[10.5px]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#FFD700] font-bold text-xs shrink-0">📜</span>
                <p className="text-amber-100/90 truncate font-serif italic">
                  <strong className="not-italic text-[#FFD700] font-kate mr-1.5 font-bold">
                    {currentImg.title}:
                  </strong>
                  {currentImg.desc}
                </p>
              </div>
              <span className="text-[9px] font-mono text-[#FFD700] shrink-0 font-bold bg-black/40 px-2 py-0.5 rounded border border-[#FFD700]/30">
                {currentImageIndex + 1} / 4
              </span>
            </div>
          </motion.div>

          {/* CTA Buttons: ENTER THE COURT & HOW TO PLAY */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 mt-6 w-full justify-center">
            {/* Primary: ENTER THE COURT (Royal Gold #FFD700 with Warrior Red #A52A2A hover shadow) */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(255,215,0,0.7), 0 0 15px rgba(165,42,42,0.6)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnterCourt}
              className="w-full sm:w-auto px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFE55C] to-[#FFD700] text-[#0A1224] font-kate text-sm sm:text-base font-black tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(255,215,0,0.4)] transition cursor-pointer border-2 border-white/70 flex items-center justify-center gap-3"
            >
              <span className="text-lg">⚔</span>
              <span>ENTER THE COURT</span>
            </motion.button>

            {/* Secondary: HOW TO PLAY (Dharma Blue & Mystic Purple with Royal Gold border) */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(26,77,142,0.9)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                play('tanpuraPluck');
                setShowRulesModal(true);
              }}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#1A4D8E]/85 to-[#800080]/85 border-2 border-[#FFD700] text-[#FFD700] font-kate text-sm sm:text-base font-bold tracking-wider uppercase shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📜</span>
              <span>HOW TO PLAY</span>
            </motion.button>
          </div>

          {/* Bottom metadata tags highlighting the 5 Mahabharat themes */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-6 pt-4 border-t border-[#FFD700]/25 w-full text-[11px] font-kate uppercase tracking-widest text-amber-200/75">
            <span className="flex items-center gap-1.5">
              <span className="text-[#4CAF50]">●</span> 52 Mahabharata Cards
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#FFD700]">●</span> CLeMaR Architecture
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#A52A2A]">●</span> UNO-Style Hotseat Flow
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#1A4D8E]">●</span> Dharma Duty
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#800080]">●</span> Mystic Astras
            </span>
          </div>
        </motion.div>
      </main>

      {/* 5. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-centrion text-amber-200/60 z-20 border-t border-[#FFD700]/20 gap-2">
        <span>© 2026 Dharma: Mahabharat · Authoritative CLeMaR Card Duel</span>
        <span className="font-editorial italic">Designed for 2-Player Tactical Succession</span>
      </footer>
    </div>
  );
};

