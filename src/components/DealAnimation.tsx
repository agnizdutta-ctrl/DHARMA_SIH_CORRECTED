import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CardData } from '../../engine/types';
import { Card } from './Card';
import { useAudio } from '../hooks/useAudio';

interface DealAnimationProps {
  baseCard: CardData | null;
  p1Name: string;
  p2Name: string;
  p1Cards: CardData[];
  p2Cards: CardData[];
  onComplete: () => void;
}

export const DealAnimation: React.FC<DealAnimationProps> = ({
  baseCard,
  p1Name = 'AD',
  p2Name = 'RS',
  p1Cards,
  p2Cards,
  onComplete
}) => {
  const { play } = useAudio();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  const finishAnimation = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onCompleteRef.current();
  };

  // Stages: 'shuffle' | 'deal' | 'baseCard' | 'ready'
  const [stage, setStage] = useState<'shuffle' | 'deal' | 'baseCard' | 'ready'>('shuffle');
  const [dealtCount, setDealtCount] = useState(0); // 0 to 10
  const [deckRemaining, setDeckRemaining] = useState(52);

  // Global safety fallback: guarantees auto-return to Arena
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      finishAnimation();
    }, 3800);
    return () => clearTimeout(safetyTimer);
  }, []);

  // 1. Shuffling Phase (0 to 1100ms)
  useEffect(() => {
    play('cardShuffle');
    const timerShuffle = setTimeout(() => {
      setStage('deal');
      play('cardShuffle');
    }, 1100);

    return () => clearTimeout(timerShuffle);
  }, [play]);

  // 2. Dealing phase (12 cards: 6 to AD, 6 to RS)
  useEffect(() => {
    if (stage !== 'deal') return;

    const interval = setInterval(() => {
      setDealtCount((prev) => {
        const next = prev + 1;
        play('cardDeal');
        setDeckRemaining(52 - next);

        if (next >= 12) {
          clearInterval(interval);
          setTimeout(() => {
            setStage('baseCard');
            play('cardPlay');
            play('fluteFlourish');
            setDeckRemaining(39); // 40 - 1 = 39 cards remaining in draw deck
          }, 300);
        }
        return next;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [stage, play]);

  // 3. Base Card reveal & auto transition to Arena
  useEffect(() => {
    if (stage === 'baseCard') {
      const readyTimer = setTimeout(() => {
        setStage('ready');
      }, 1000);

      const autoEndTimer = setTimeout(() => {
        finishAnimation();
      }, 1600);

      return () => {
        clearTimeout(readyTimer);
        clearTimeout(autoEndTimer);
      };
    }
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0E1F17]/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 text-center select-none overflow-hidden">
      {/* Skip button */}
      <div className="w-full max-w-5xl flex justify-between items-center z-30">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#55EFC4] animate-ping" />
          <span className="text-xs font-kate font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            Imperial Deal: {p1Name} vs {p2Name}
          </span>
        </div>
        <button
          onClick={finishAnimation}
          className="px-5 py-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-[#1A3326] text-xs font-bold text-amber-200 transition cursor-pointer shadow-lg flex items-center gap-2"
        >
          <span>Enter Battle Arena</span>
          <span>➔</span>
        </button>
      </div>

      {/* Center Stage Container */}
      <div className="relative w-full max-w-4xl h-[480px] flex flex-col items-center justify-center">
        {/* Stage 1: Shuffling 52 Cards */}
        {stage === 'shuffle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-40 h-56 flex items-center justify-center">
              {/* Stack of animated cards riffling */}
              {[-30, -20, -10, 0, 10, 20, 30].map((deg, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, deg * 2, 0],
                    rotate: [0, deg, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: 2,
                    ease: 'easeInOut',
                    delay: i * 0.05
                  }}
                  className="absolute w-36 h-52 rounded-2xl bg-gradient-to-br from-[#163828] via-[#1A3326] to-[#0A1C14] border-2 border-[#D4AF37] shadow-2xl flex items-center justify-center"
                >
                  <span className="text-4xl text-[#D4AF37]/50 font-supremacy">☸</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <h3 className="font-supremacy text-2xl font-black text-[#F4D03F] tracking-wider">
                Shuffling Complete 52-Card Deck
              </h3>
              <p className="font-editorial italic text-sm text-[#F5EBE6]/80 mt-1">
                Randomizing 36 CLeMaR dynastic cards + 16 Special tactical relics...
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 2: Distribution to P1 and P2 */}
        {stage === 'deal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-full flex flex-col items-center justify-between py-6"
          >
            {/* Player 2 (Top) receiving cards */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-kate font-bold uppercase tracking-wider text-amber-200 mb-2">
                {p2Name} (Chronicler II) · {Math.floor(dealtCount / 2)} Cards Received
              </span>
              <div className="flex -space-x-4">
                {Array.from({ length: Math.floor(dealtCount / 2) }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-14 h-20 rounded-lg bg-[#163828] border border-[#D4AF37] shadow-md flex items-center justify-center text-xs text-[#D4AF37]"
                  >
                    🂠
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Center Deck Countdown */}
            <div className="flex flex-col items-center my-auto">
              <div className="w-28 h-36 rounded-xl bg-gradient-to-br from-[#163828] to-[#0A1C14] border-2 border-[#D4AF37] shadow-2xl flex flex-col items-center justify-center text-[#F4D03F] relative">
                <span className="text-3xl font-supremacy font-black">{deckRemaining}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5EBE6]/70 mt-1">
                  Deck Left
                </span>
              </div>
              <span className="text-xs font-editorial italic text-[#55EFC4] mt-2">
                Dealing 5 Cards to Each Player... (10 Total)
              </span>
            </div>

            {/* Player 1 (Bottom) receiving cards */}
            <div className="flex flex-col items-center">
              <div className="flex -space-x-4">
                {Array.from({ length: Math.ceil(dealtCount / 2) }).map((_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, y: -100 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-14 h-20 rounded-lg bg-[#163828] border border-[#D4AF37] shadow-md flex items-center justify-center text-xs text-[#D4AF37]"
                  >
                    🂠
                  </motion.div>
                ))}
              </div>
              <span className="text-xs font-kate font-bold uppercase tracking-wider text-amber-200 mt-2">
                {p1Name} (Chronicler I) · {Math.ceil(dealtCount / 2)} Cards Received
              </span>
            </div>
          </motion.div>
        )}

        {/* Stage 3: Base Card Anchor Revealed */}
        {(stage === 'baseCard' || stage === 'ready') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-xs font-kate font-bold uppercase tracking-[0.3em] text-[#55EFC4] mb-4">
              42 Remaining in Deck ➔ Flipping Starter Card
            </span>

            {baseCard && (
              <motion.div
                initial={{ rotateY: 180, scale: 0.5 }}
                animate={{ rotateY: 0, scale: 1.15 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="relative"
              >
                <Card card={baseCard} isBase={true} />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
                <span>⚓</span>
                <span>Base Anchor: {baseCard?.name} (0 PTS)</span>
              </div>
              <p className="font-editorial italic text-sm text-[#F5EBE6]/90 max-w-md">
                Just like UNO, the starter card is placed in the center with 0 points. 41 cards remain in the Draw Deck!
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="w-full max-w-2xl py-3 px-6 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs text-[#F5EBE6]/80 z-30">
        <span className="flex items-center gap-2">
          <span className="text-[#FF9F43]">⚔</span>
          <span>Dual Player Hotseat Match</span>
        </span>
        <span className="font-bold text-[#55EFC4]">
          {stage === 'shuffle' && 'Step 1 of 3: Shuffling 52 Cards...'}
          {stage === 'deal' && 'Step 2 of 3: Dealing Hands...'}
          {stage === 'baseCard' && 'Step 3 of 3: Revealing Base Anchor...'}
          {stage === 'ready' && 'Entering Sage Court Arena...'}
        </span>
        <span className="text-amber-200">Deck: {deckRemaining} Cards</span>
      </div>
    </div>
  );
};
