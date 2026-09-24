import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { CardData } from '../../engine/types';
import { Card } from './Card';
import { useAudio } from '../hooks/useAudio';

interface HandProps {
  hand: CardData[];
  selectedCardId: string | null;
  validCardsInHand: Record<string, boolean>;
  shakingCardId?: string | null;
  isMyTurn: boolean;
  playerName?: string;
  onSelectCard: (cardId: string) => void;
}

export const Hand: React.FC<HandProps> = ({
  hand,
  selectedCardId,
  validCardsInHand,
  shakingCardId = null,
  isMyTurn,
  playerName = 'Your',
  onSelectCard
}) => {
  const { play } = useAudio();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="player-hand-container"
      className="relative w-full flex flex-col items-center justify-end pt-1 pb-3 px-2 bg-gradient-to-t from-black/60 via-[#0A1A12]/40 to-transparent rounded-2xl border-t border-[#D4AF37]/20"
    >
      {/* Hand status & instructions strip */}
      <div className="w-full max-w-5xl flex items-center justify-between px-4 mb-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#55EFC4] animate-pulse" />
          <span className="font-kate font-bold text-amber-200 uppercase tracking-wider">
            {playerName}&apos;s Hand ({hand.length} Cards)
          </span>
          <span className="text-[11px] text-white/50 font-mono">
            {hand.filter((c) => validCardsInHand[c.id]).length} Legal Moves Available
          </span>
        </div>

        {/* Instructions banner */}
        <div className="hidden sm:flex items-center gap-2">
          {isMyTurn ? (
            <span className="text-[11px] font-semibold text-[#F4D03F] bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-3 py-0.5 rounded-full flex items-center gap-1.5">
              <span>⚔</span>
              <span>Click a highlighted card to link over Base Card / Chain</span>
            </span>
          ) : (
            <span className="text-[11px] font-medium text-amber-200/50">
              Awaiting opponent turn...
            </span>
          )}
        </div>

        {/* Slide Carousel Arrow Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={scrollLeft}
            className="w-7 h-7 rounded-full bg-[#163828] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0A1A12] text-amber-200 text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-sm"
            title="Slide Cards Left"
          >
            ◀
          </button>
          <span className="text-[10px] uppercase font-bold text-amber-200/70 tracking-widest px-1">
            Slide Rack
          </span>
          <button
            onClick={scrollRight}
            className="w-7 h-7 rounded-full bg-[#163828] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0A1A12] text-amber-200 text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-sm"
            title="Slide Cards Right"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Rack with Custom Royal Slidebar */}
      <div
        ref={scrollContainerRef}
        className="w-full max-w-6xl overflow-x-auto overflow-y-visible px-4 py-2 flex items-center gap-3.5 scroll-smooth select-none min-h-[195px] custom-hand-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D4AF37 #0A1C14'
        }}
      >
        {hand.length === 0 ? (
          <div className="w-full py-8 text-center text-amber-200/60 font-editorial italic text-sm">
            👑 Hand is empty! DHARMA declared!
          </div>
        ) : (
          hand.map((card, index) => {
            const isSelected = selectedCardId === card.id;
            const isValid = isMyTurn && Boolean(validCardsInHand[card.id]);
            const isShaking = shakingCardId === card.id;

            return (
              <motion.div
                key={card.id || `card-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: 1,
                  y: isSelected ? -16 : 0,
                  scale: isSelected ? 1.06 : 1,
                  zIndex: isSelected ? 40 : 10 + index
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="shrink-0 relative py-1"
              >
                <Card
                  card={card}
                  isSelected={isSelected}
                  isValid={isValid}
                  isShaking={isShaking}
                  compact={false}
                  onHover={() => play('cardHover')}
                  onClick={() => {
                    onSelectCard(card.id);
                  }}
                  className={`transition-all shadow-2xl ${
                    !isValid && isMyTurn ? 'opacity-85 hover:opacity-100' : ''
                  }`}
                />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Slide Bar bottom hint for wide hands */}
      <div className="w-full max-w-xs flex items-center justify-center gap-2 mt-1 opacity-60 text-[10px] text-amber-200 font-mono">
        <span>◀</span>
        <span>Drag or slide horizontal bar to view all cards in hand</span>
        <span>▶</span>
      </div>
    </footer>
  );
};
