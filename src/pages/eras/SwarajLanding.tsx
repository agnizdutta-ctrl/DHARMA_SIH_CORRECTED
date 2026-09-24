import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useAudio } from '../../hooks/useAudio';

// The 4 user-provided Swaraj Yuga images with original uploaded filenames and clean fallbacks
const SWARAJYUGA_LANDING_IMAGES = [
  {
    id: 'india-tapestry',
    src: '/download (2).jpg',
    fallback: '/images/india-tapestry.jpg',
    title: 'Swarajya: The Soul of Bharat',
    subtitle: 'Unity, Heritage & The National Spirit',
    alt: 'Montage celebrating Indian diversity, heritage and freedom',
    desc: 'Five sacred pillars of Bharat — the emerald oceans, sacrificial fire, fertile agricultural heartland, the silhouette of the Mahatma, and snow-crowned Himalayas.'
  },
  {
    id: 'mangal-pandey-1857',
    src: '/Mangal Pandey  _Biography_ History, Role in the Revolt of 1857_.jpg',
    fallback: '/images/mangal-pandey-1857.jpg',
    title: '1857: The First War of Independence',
    subtitle: 'Mangal Pandey & The Barrackpore Uprising',
    alt: 'Historic sepoy uprising of 1857 marching towards Delhi',
    desc: 'The historic clarion call for freedom in 1857 as Mangal Pandey and brave sepoys struck the first decisive blow against colonial hegemony.'
  },
  {
    id: 'mahatma-gandhi-dandi',
    src: '/മഹാത്_മാ ഗാന്ധി; 50 ചോദ്യങ്ങളിലൂടെ.jpg',
    fallback: '/images/mahatma-gandhi-dandi.jpg',
    title: 'The Dandi Salt March (1930)',
    subtitle: 'Mahatma Gandhi & Non-Violent Satyagraha',
    alt: 'Mahatma Gandhi walking at sunset leading the Dandi March with doves in flight',
    desc: 'The epochal 240-mile march to the Arabian Sea where millions joined hands in fearless satyagraha to shake the foundations of empire.'
  },
  {
    id: 'british-indian-empire-1909',
    src: '/Population Density of the British Indian Empire, 1909.jpg',
    fallback: '/images/british-indian-empire-1909.jpg',
    title: 'Imperial Gazetteer Atlas (1909)',
    subtitle: 'Historical Map of Undivided Bharat',
    alt: 'Vintage 1909 British Indian Empire density of population map',
    desc: 'An authentic cartographic chronicle of the British Indian Empire in 1909, depicting the provinces and people who rose together for complete Swaraj.'
  }
];

export const SwarajLanding: React.FC = () => {
  const navigate = useNavigate();
  const { setShowRulesModal, settings, updateSettings, startDualPlayerGame, rounds, setCurrentPage } = useGameStore();
  const { play } = useAudio();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background cycling every 4 seconds with smooth cross-fade
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SWARAJYUGA_LANDING_IMAGES.length);
    }, 4000);
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

  const currentImg = SWARAJYUGA_LANDING_IMAGES[currentImageIndex];

  return (
    <div
      id="landing-screen"
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#C04000] text-[#FFFFFF] overflow-x-hidden select-none"
      style={{ backgroundColor: '#2B0F06' }}
    >
      {/* 1. Dynamic Living Swaraj Yuga Background Gallery */}
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
            className="absolute inset-0 w-screen h-screen object-cover object-center filter brightness-[0.96] contrast-[1.04]"
            style={{ width: '100vw', height: '100vh' }}
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Minimal edge vignette to ensure text legibility while keeping the imagery 90%+ visible */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Floating Tricolour Astral Particles (Saffron #FF9933, White #FFFFFF, Green #138808, Blue #000080, Gold #D4A24C) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 24 }).map((_, i) => {
          const tricolourParticles = ['#FF9933', '#FFFFFF', '#138808', '#000080', '#D4A24C', '#D8C3A5'];
          const pColor = tricolourParticles[i % tricolourParticles.length];
          return (
            <motion.div
              key={i}
              initial={{
                opacity: 0.2 + (i % 5) * 0.14,
                y: '105vh',
                x: `${(i * 4.3 + 3) % 100}vw`
              }}
              animate={{
                y: '-10vh',
                opacity: [0.15, 0.9, 0]
              }}
              transition={{
                duration: 8 + (i % 5) * 2,
                repeat: Infinity,
                delay: (i * 0.35) % 4,
                ease: 'linear'
              }}
              className="absolute rounded-full blur-[0.4px]"
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

      {/* 2. Rotating Ashoka Chakra Watermark (Top Right in Ashoka Blue #000080 and Gold #D4A24C) */}
      <div className="absolute -top-16 -right-16 w-96 h-96 pointer-events-none opacity-[0.14] z-10">
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
          viewBox="0 0 100 100"
          className="w-full h-full stroke-[#D4A24C] fill-none"
          strokeWidth="1.2"
        >
          <circle cx="50" cy="50" r="46" stroke="#000080" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="14" stroke="#D4A24C" strokeWidth="2" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 46 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 46 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="#000080"
              strokeWidth="1.2"
            />
          ))}
        </motion.svg>
      </div>

      {/* 3. Top Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full border-2 border-[#D4A24C] bg-gradient-to-br from-[#000080] via-[#C04000] to-[#138808] backdrop-blur-md flex items-center justify-center text-lg text-[#FFFFFF] shadow-[0_0_15px_rgba(255,153,51,0.4)]">
            🇮🇳
          </div>
          <div>
            <h1 className="font-supremacy text-xl font-black tracking-widest text-[#FFFFFF] drop-shadow-md">
              DHARMA
            </h1>
            <span className="text-[9.5px] uppercase font-kate tracking-[0.25em] text-[#FF9933] font-bold block -mt-0.5">
              THE CHRONICLES OF BHARAT · SWARAJYUGA EDITION
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="back-to-menu-btn"
            onClick={handleBackToMenu}
            className="px-3.5 py-2 rounded-full border-2 border-[#D4A24C] bg-[#000080]/85 hover:bg-[#FF9933] hover:text-[#2B0F06] text-xs font-kate font-bold text-[#FFFFFF] transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Choose Era</span>
          </button>

          <button
            onClick={() => {
              play('tanpuraPluck');
              setShowRulesModal(true);
            }}
            className="px-4 py-2 rounded-full border-2 border-[#D4A24C] bg-[#000080]/85 hover:bg-[#FF9933] hover:text-[#2B0F06] text-xs font-kate font-bold text-[#FFFFFF] transition cursor-pointer flex items-center gap-2 backdrop-blur-md shadow-lg"
          >
            <span>📜</span>
            <span>Codex &amp; Rules</span>
          </button>

          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="w-10 h-10 rounded-full border-2 border-[#D4A24C]/80 bg-[#C04000]/80 hover:bg-[#FF9933] hover:text-[#2B0F06] backdrop-blur-md flex items-center justify-center text-sm transition cursor-pointer text-[#FFFFFF] shadow-lg"
            title={settings.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* 4. Central Grand Card (Adjusted to balanced square profile) */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center text-center z-20 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="relative w-full rounded-3xl p-8 sm:p-11 bg-gradient-to-b from-[#38140B]/95 via-[#230C05]/95 to-[#160703]/98 border-2 border-[#D4A24C] shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col items-center"
        >
          {/* Decorative Corner Motifs in Antique Gold #D4A24C */}
          <div className="absolute top-3 left-3 text-sm text-[#D4A24C] select-none">⚜</div>
          <div className="absolute top-3 right-3 text-sm text-[#D4A24C] select-none">⚜</div>
          <div className="absolute bottom-3 left-3 text-sm text-[#D4A24C] select-none">⚜</div>
          <div className="absolute bottom-3 right-3 text-sm text-[#D4A24C] select-none">⚜</div>

          {/* The Freedom Struggle Tale badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#000080]/90 via-[#C04000]/90 to-[#138808]/90 border-2 border-[#FF9933] text-[#FFFFFF] text-[10.5px] sm:text-xs font-kate font-black uppercase tracking-[0.25em] mb-4 shadow-[0_0_18px_rgba(255,153,51,0.5)]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933] shadow-[0_0_8px_#FF9933] animate-pulse" />
            <span>THE FREEDOM STRUGGLE TALE</span>
          </motion.div>

          {/* Grand Branding Title: DHARMA: THE CHRONICLES OF BHARAT */}
          <div className="flex flex-col items-center justify-center my-1">
            <span className="text-xs sm:text-sm font-kate uppercase tracking-[0.4em] text-[#D8C3A5] font-bold">
              THE CHRONICLES OF BHARAT
            </span>
            <div className="flex justify-center items-center gap-1 sm:gap-2.5 mt-1">
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
                  className="font-supremacy text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#FF9933] to-[#D4A24C] filter drop-shadow-[0_4px_16px_rgba(0,0,128,0.7)]"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Edition Subtitle: SWARAJYUGA EDITION */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
            className="font-kate text-sm sm:text-base uppercase tracking-[0.35em] text-[#D4A24C] font-extrabold mt-1"
          >
            SWARAJYUGA EDITION
          </motion.h2>

          {/* Ashoka Chakra Ornamental Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 0.85, scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 my-4 w-full max-w-sm justify-center opacity-90"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#FF9933] to-[#D4A24C]" />
            <span className="text-[#000080] bg-[#FFFFFF] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-sm">
              ☸
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#138808] to-[#D4A24C]" />
          </motion.div>

          {/* Narrative Tagline & Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <p className="font-editorial italic text-base sm:text-lg text-[#FFFFFF] max-w-lg leading-relaxed">
              &ldquo;Swaraj is my birthright, and I shall have it!&rdquo;
            </p>

            <p className="font-centrion text-xs sm:text-sm text-[#D8C3A5] max-w-lg mt-2.5 leading-relaxed">
              A strategic pass-and-play card duel of the Indian Freedom Movement. Chain Creators, Leaders, Movements, and Historic Decrees across 52 authentic Swaraj Yuga cards.
            </p>
          </motion.div>

          {/* CTA Buttons: ENTER THE BATTLEFIELD (India Saffron #FF9933) & HOW TO PLAY (India Green #138808) */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 mt-7 w-full justify-center">
            {/* Primary Button: India Saffron / Bhagwa #FF9933 */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(255,153,51,0.8), 0 0 15px rgba(192,64,0,0.7)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleEnterCourt}
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#FF9933] via-[#FFB74D] to-[#FF9933] text-[#230C05] font-kate text-sm sm:text-base font-black tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(255,153,51,0.5)] transition cursor-pointer border-2 border-[#FFFFFF] flex items-center justify-center gap-3"
            >
              <span className="text-lg">⚔</span>
              <span>ENTER THE BATTLEFIELD</span>
            </motion.button>

            {/* Secondary Button: India Green #138808 */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, backgroundColor: '#138808' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                play('tanpuraPluck');
                setShowRulesModal(true);
              }}
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-full bg-[#138808] border-2 border-[#D4A24C] text-[#FFFFFF] font-kate text-sm sm:text-base font-bold tracking-wider uppercase shadow-lg transition cursor-pointer flex items-center justify-center gap-2 hover:brightness-110"
            >
              <span>📜</span>
              <span>HOW TO PLAY &amp; CODEX</span>
            </motion.button>
          </div>

          {/* Bottom metadata tags highlighting Swaraj Yuga architecture */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7 pt-4 border-t border-[#D4A24C]/30 w-full text-[11px] font-kate uppercase tracking-widest text-[#D8C3A5]">
            <span className="flex items-center gap-1.5">
              <span className="text-[#138808]">●</span> 52 Swaraj Yuga Cards
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#FF9933]">●</span> CLeMaR Architecture
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#000080]">●</span> Ashoka Chakra Pot
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#D4A24C]">●</span> Aadesh Decrees
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C04000]">●</span> 2-Player Hotseat Flow
            </span>
          </div>
        </motion.div>
      </main>

      {/* 5. Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-centrion text-[#D8C3A5]/80 z-20 border-t border-[#D4A24C]/30 gap-2">
        <span>© 2026 Dharma: Swaraj Yuga · Authoritative Freedom Movement Card Duel</span>
        <span className="font-editorial italic">Designed for Tactical Succession &amp; Historical Enlightenment</span>
      </footer>
    </div>
  );
};
