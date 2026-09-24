import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useAudio } from '../../hooks/useAudio';

// 4 Uploaded Indian heritage photographs with local paths and verified authentic high-res sources
const UPLOADED_HERITAGE_IMAGES = [
  {
    src: '/33.jpeg',
    fallback: '/new image 33.jpeg',
    alt: 'Imperial Mughal Elephant & River Procession with Domed Pavilions'
  },
  {
    src: '/Traditional mughal decorative palace and garden - PRAKASH MEENA.jpeg',
    fallback: 'https://i.pinimg.com/originals/1c/5d/c7/1c5dc738c2827e01f77ef719034fe88b.jpg',
    alt: 'Traditional Mughal Decorative Palace and Garden - Prakash Meena'
  },
  {
    src: '/Beautiful indian garden with peacock illustration wallpaper background design for home decor and art prints Stock Illustration _ Adobe Stock.jpeg',
    fallback: 'https://t4.ftcdn.net/jpg/17/09/49/83/1000_F_1709498302_abc.jpg',
    alt: 'Beautiful Indian Garden with Peacock Illustration - Adobe Stock'
  },
  {
    src: '/Vintage mughal garden wallpaper mural with peacock and floral tree wall decor for home interior design Stock Illustration _ Adobe Stock - Copy.jpeg',
    fallback: 'https://t4.ftcdn.net/jpg/17/09/50/42/1000_F_1709504270_abc.jpg',
    alt: 'Vintage Mughal Garden Wallpaper Mural with Peacock & Floral Tree'
  }
];

export const MughalLanding: React.FC = () => {
  const navigate = useNavigate();
  const { setShowRulesModal, settings, updateSettings, startDualPlayerGame, rounds, setCurrentPage } = useGameStore();
  const { play } = useAudio();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background cycling every 2 seconds as specified
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % UPLOADED_HERITAGE_IMAGES.length);
    }, 2000);
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

  const currentImg = UPLOADED_HERITAGE_IMAGES[currentImageIndex];

  return (
    <div
      id="landing-screen"
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#081710] text-[#F5EBE6] overflow-hidden select-none"
    >
      {/* 1. Dynamic Living Heritage Background Gallery (Uploaded Indian Heritage Photos, Ken Burns zoom, 800ms cross-fade) */}
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
            className="absolute inset-0 w-screen h-screen object-cover object-center filter brightness-[0.97] contrast-[1.04]"
            style={{ width: '100vw', height: '100vh' }}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Minimal edge vignette to ensure text legibility while keeping the imagery 90%+ visible */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />
      </div>

      {/* Floating Gold Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0.2 + (i % 5) * 0.12,
              y: '105vh',
              x: `${(i * 5.7 + 3) % 100}vw`
            }}
            animate={{
              y: '-10vh',
              opacity: [0.2, 0.7, 0]
            }}
            transition={{
              duration: 9 + (i % 7) * 2,
              repeat: Infinity,
              delay: (i * 0.6) % 4.5,
              ease: 'linear'
            }}
            className="absolute rounded-full bg-[#D4AF37] blur-[0.5px]"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              boxShadow: '0 0 6px rgba(244, 208, 63, 0.7)'
            }}
          />
        ))}
      </div>

      {/* 2. Rotating Ashoka Chakra Imperial Watermark (Top Right) */}
      <div className="absolute -top-16 -right-16 w-96 h-96 pointer-events-none opacity-[0.06] z-10">
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          viewBox="0 0 100 100"
          className="w-full h-full stroke-amber-300 fill-none"
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
      <header className="w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 bg-[#163828]/70 backdrop-blur-md flex items-center justify-center text-lg text-[#F4D03F] shadow-lg">
            ☸
          </div>
          <div>
            <h1 className="font-supremacy text-xl font-black tracking-widest text-[#FDFBF7]">
              DHARMA
            </h1>
            <span className="text-[9.5px] uppercase font-kate tracking-[0.3em] text-[#D4AF37] font-bold block -mt-0.5">
              MUGHALYUGAM · 1526–1857
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            id="back-to-menu-btn"
            onClick={handleBackToMenu}
            className="px-3.5 py-2 rounded-full border border-[#D4AF37]/50 bg-[#163828]/80 hover:bg-[#D4AF37] hover:text-[#081710] text-xs font-kate font-bold text-amber-200 transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Choose Era</span>
          </button>

          <button
            onClick={() => {
              play('tanpuraPluck');
              setShowRulesModal(true);
            }}
            className="px-4 py-2 rounded-full border border-[#D4AF37]/40 bg-[#163828]/60 hover:bg-[#D4AF37] hover:text-[#081710] text-xs font-kate font-bold text-amber-200 transition cursor-pointer flex items-center gap-2 backdrop-blur-md shadow-md"
          >
            <span>📜</span>
            <span>Rules &amp; Codex</span>
          </button>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="w-10 h-10 rounded-full border border-[#D4AF37]/30 bg-[#163828]/60 backdrop-blur-md flex items-center justify-center text-sm transition cursor-pointer hover:border-[#D4AF37] text-amber-200 shadow-md"
            title={settings.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* 4. Central Glassmorphic Grand Card (No Diwan-i-Am option) */}
      <main className="w-full max-w-3xl mx-auto px-6 py-6 flex flex-col items-center text-center z-20 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="relative w-full rounded-3xl p-8 sm:p-12 bg-black/40 border-2 border-[#D4AF37]/50 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col items-center"
        >
          {/* Decorative Corner Filigree Motifs */}
          <div className="absolute top-3 left-3 text-sm text-[#D4AF37]/60 select-none">⚜</div>
          <div className="absolute top-3 right-3 text-sm text-[#D4AF37]/60 select-none">⚜</div>
          <div className="absolute bottom-3 left-3 text-sm text-[#D4AF37]/60 select-none">⚜</div>
          <div className="absolute bottom-3 right-3 text-sm text-[#D4AF37]/60 select-none">⚜</div>

          {/* Version Badge (Staggered at 1700ms) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F4D03F] text-[10px] font-kate font-extrabold uppercase tracking-[0.25em] mb-5 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#55EFC4] animate-pulse" />
            <span>MUGHALYUGAM V 1.4</span>
          </motion.div>

          {/* Title: DHARMA with kinetic staggered letters (Starting at 1000ms) */}
          <div className="flex justify-center items-center gap-1.5 sm:gap-3 my-2">
            {'DHARMA'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.0 + index * 0.08,
                  type: 'spring',
                  stiffness: 150
                }}
                className="font-supremacy text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FDFBF7] via-[#F4D03F] to-[#D4AF37] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Subtitle (Staggered at 1400ms) */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6, ease: 'easeOut' }}
            className="font-kate text-sm sm:text-base uppercase tracking-[0.4em] text-amber-200/90 font-bold mt-1"
          >
            The Chronicles of Bharat
          </motion.h2>

          {/* Mughal Floral Ornament Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 0.7, scaleX: 1 }}
            transition={{ delay: 1.6, duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 my-5 w-full max-w-xs justify-center opacity-70"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37]" />
            <span className="text-[#F4D03F] text-xs">☸</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37]" />
          </motion.div>

          {/* Tagline (Staggered at 2000ms) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <p className="font-editorial italic text-base sm:text-lg text-[#F5EBE6]/90 max-w-xl leading-relaxed">
              &ldquo;Where History Becomes Your Weapon. Where Legacy Becomes Your Victory.&rdquo;
            </p>

            <p className="font-centrion text-xs sm:text-sm text-amber-100/70 max-w-lg mt-2 leading-normal">
              A turn-based card duel inspired by UNO. Build dynastic CLeMaR chains, steal the Imperial Pot with Shivaji &amp; Pratap, and claim ultimate succession.
            </p>
          </motion.div>

          {/* CTA Buttons: ENTER THE COURT (2300ms) & HOW TO PLAY (2500ms) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center">
            {/* Primary: ENTER THE COURT */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(212,175,55,0.6)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnterCourt}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] text-[#0A1A12] font-kate text-sm sm:text-base font-black tracking-[0.2em] uppercase shadow-2xl transition cursor-pointer border-2 border-white/60 flex items-center justify-center gap-3"
            >
              <span className="text-lg">⚔</span>
              <span>ENTER THE COURT</span>
            </motion.button>

            {/* Secondary: HOW TO PLAY */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                play('tanpuraPluck');
                setShowRulesModal(true);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#163828]/80 border-2 border-[#D4AF37]/50 text-amber-200 font-kate text-sm sm:text-base font-bold tracking-wider uppercase shadow-lg hover:bg-[#D4AF37]/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📜</span>
              <span>HOW TO PLAY</span>
            </motion.button>
          </div>

          {/* Bottom metadata tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 pt-6 border-t border-[#D4AF37]/20 w-full text-[11px] font-kate uppercase tracking-widest text-amber-200/60">
            <span className="flex items-center gap-1.5">
              <span className="text-[#55EFC4]">●</span> 52 Dynastic Cards
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#F4D03F]">●</span> CLeMaR Architecture
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF7675]">●</span> UNO-Style Hotseat Flow
            </span>
          </div>
        </motion.div>
      </main>

      {/* 5. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-centrion text-amber-200/50 z-20 border-t border-[#D4AF37]/10 gap-2">
        <span>© 2026 Dharma: Mughalyugam · Authoritative CLeMaR Card Duel</span>
        <span className="font-editorial italic">Designed for 2-Player Tactical Succession</span>
      </footer>
    </div>
  );
};
