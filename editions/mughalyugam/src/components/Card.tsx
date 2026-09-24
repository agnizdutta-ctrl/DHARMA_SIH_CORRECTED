import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CardData, PlayedCard } from '../../engine/types';
import { CardCharacterArt } from './CardCharacterArt';

interface CardProps {
  card: CardData | PlayedCard;
  isSelected?: boolean;
  isValid?: boolean;
  isLegalTarget?: boolean;
  isBase?: boolean;
  compact?: boolean;
  isShaking?: boolean;
  isWildDramatic?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  card,
  isSelected,
  isValid,
  isLegalTarget,
  isBase,
  compact = false,
  isShaking = false,
  isWildDramatic = false,
  onClick,
  onHover,
  className = '',
  style
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isNullified = (card as PlayedCard).isNullified;
  const isRival = card.type === 'rival' || card.variant === 'rival';
  const isAadesh = card.type === 'aadesh' || card.variant === 'aadesh' || card.name.toLowerCase().includes('aadesh');
  const isKarma = card.type === 'mahaKarma' || card.variant === 'karma';
  const isMouna = card.type === 'mouna' || card.variant === 'mouna';
  const isChakra = card.type === 'chakravyuha' || card.variant === 'chakra';
  const isCrisis = card.type === 'crisis' || card.variant === 'crisis';

  // Category symbol, color accents, and full name
  const getCategoryMeta = () => {
    if (isRival) {
      return {
        symbol: card.symbol || '⚔️',
        label: 'RIVAL',
        color: '#C0392B',
        badgeBg: 'bg-[#C0392B]',
        tagText: 'text-red-300'
      };
    }
    if (isAadesh) {
      const declared = (card as PlayedCard).declaredCategory;
      return {
        symbol: '📜',
        label: declared ? `AADESH [${declared}]` : 'AADESH',
        color: '#8E44AD',
        badgeBg: 'bg-[#8E44AD]',
        tagText: 'text-purple-300'
      };
    }
    if (isKarma) {
      return {
        symbol: card.symbol || '☯️',
        label: 'KARMA',
        color: '#E67E22',
        badgeBg: 'bg-[#D35400]',
        tagText: 'text-amber-300'
      };
    }
    if (isMouna) {
      return {
        symbol: card.symbol || '🤫',
        label: 'MOUNA',
        color: '#7F8C8D',
        badgeBg: 'bg-[#5D6D7E]',
        tagText: 'text-gray-300'
      };
    }
    if (isChakra) {
      return {
        symbol: card.symbol || '🌀',
        label: 'CHAKRA',
        color: '#16A085',
        badgeBg: 'bg-[#16A085]',
        tagText: 'text-teal-300'
      };
    }
    if (isCrisis) {
      return {
        symbol: card.symbol || '☠️',
        label: 'CRISIS',
        color: '#962D3E',
        badgeBg: 'bg-[#962D3E]',
        tagText: 'text-rose-300'
      };
    }

    const cat = card.category;
    if (cat === 'C') {
      return {
        symbol: card.symbol || '👑',
        label: 'CREATOR',
        color: '#D4AF37',
        badgeBg: 'bg-[#B7950B]',
        tagText: 'text-amber-200'
      };
    }
    if (cat === 'Le' || cat === 'L') {
      return {
        symbol: card.symbol || '⚖️',
        label: 'LEGISLATURE',
        color: '#8E44AD',
        badgeBg: 'bg-[#8E44AD]',
        tagText: 'text-purple-300'
      };
    }
    if (cat === 'Ma' || cat === 'M') {
      return {
        symbol: card.symbol || '🏛️',
        label: 'MARVEL',
        color: '#2980B9',
        badgeBg: 'bg-[#2471A3]',
        tagText: 'text-sky-300'
      };
    }
    if (cat === 'R') {
      return {
        symbol: card.symbol || '🗺️',
        label: 'REGION',
        color: '#27AE60',
        badgeBg: 'bg-[#229954]',
        tagText: 'text-emerald-300'
      };
    }

    return {
      symbol: card.symbol || '✦',
      label: 'SPECIAL',
      color: '#D4AF37',
      badgeBg: 'bg-[#D4AF37]',
      tagText: 'text-amber-200'
    };
  };

  const meta = getCategoryMeta();

  // Border & Glow styling
  const getBorderClass = () => {
    if (isShaking) return 'border-2 border-red-500 ring-4 ring-red-500 shadow-[0_0_35px_rgba(239,68,68,1)] scale-[1.06] z-50';
    if (isNullified) return 'border-2 border-gray-500 grayscale opacity-60';
    if (isSelected) return 'border-2 border-[#FF9F43] ring-4 ring-[#FF9F43]/70 scale-[1.05] z-30 shadow-2xl';
    if (isLegalTarget) return 'border-2 border-[#F4D03F] ring-4 ring-[#F4D03F]/70 animate-pulse z-20';
    if (isRival) return 'border-2 border-[#E74C3C] shadow-lg shadow-red-900/40';
    if (isBase) return 'border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/50';
    return 'border-2 border-[#D4AF37]/45 hover:border-[#D4AF37]';
  };

  const cornerPointDisplay = isRival
    ? 'STEAL'
    : isAadesh
    ? ((card as PlayedCard).declaredCategory || 'CMD')
    : isKarma
    ? 'KARMA'
    : isMouna
    ? 'SKIP'
    : isChakra
    ? 'REV'
    : isCrisis
    ? 'VOID'
    : `${card.points || 0}`;

  return (
    <motion.div
      layoutId={(card as PlayedCard).instanceId || card.id}
      id={`card-${card.id}`}
      onClick={onClick}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      whileHover={{ y: -8, scale: 1.05, rotateX: 2, rotateY: -1.5 }}
      whileTap={{ scale: 0.96 }}
      animate={
        isShaking
          ? {
              x: [-10, 10, -9, 9, -5, 5, -2, 2, 0],
              rotate: [-4, 4, -3, 3, -1, 1, 0],
              scale: [1, 1.06, 0.98, 1.05, 1],
              transition: { duration: 0.5, ease: 'easeInOut' }
            }
          : isSelected
          ? {
              scale: 1.06,
              y: -8,
              transition: { type: 'spring', stiffness: 350, damping: 22 }
            }
          : undefined
      }
      style={{
        perspective: 900,
        transformStyle: 'preserve-3d',
        ...style
      }}
      className={`relative select-none cursor-pointer rounded-2xl p-2.5 flex flex-col justify-between card-physical-depth transition-all duration-200 group overflow-hidden ${
        compact ? 'w-[115px] h-[168px]' : 'w-[130px] h-[184px]'
      } ${getBorderClass()} ${isValid ? 'card-valid-glow' : ''} ${className}`}
    >
      {/* Glossy Collector Card Sheen Sweep on Hover */}
      <div className="card-sheen-sweep" />

      {/* Authentic Mughal Green Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#163828] via-[#102A1E] to-[#0A1C14] pointer-events-none" />

      {/* Subtle Linen Cardstock Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:6px_6px]" />

      {/* Decorative Golden Inner Border */}
      <div className="absolute inset-1 rounded-xl border border-[#D4AF37]/25 pointer-events-none z-10" />

      {/* Corner Filigrees */}
      <div className="absolute top-1.5 left-1.5 text-[8px] text-[#D4AF37]/40 pointer-events-none select-none z-10">⚜</div>
      <div className="absolute top-1.5 right-1.5 text-[8px] text-[#D4AF37]/40 pointer-events-none select-none z-10">⚜</div>
      <div className="absolute bottom-1.5 left-1.5 text-[8px] text-[#D4AF37]/40 pointer-events-none select-none z-10">⚜</div>
      <div className="absolute bottom-1.5 right-1.5 text-[8px] text-[#D4AF37]/40 pointer-events-none select-none z-10">⚜</div>

      {/* Base Anchor Ribbon */}
      {isBase && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] text-[#163828] text-[8.5px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow border border-white/60 z-30">
          BASE (0 PTS)
        </div>
      )}

      {/* Rival Steal Ribbon */}
      {isRival && (
        <div className="absolute -top-0.5 right-1 bg-[#C0392B] text-white text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded shadow z-30 border border-red-300/40 animate-pulse">
          POT STEAL
        </div>
      )}

      {/* Nullified Stamp */}
      {isNullified && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 bg-black/45">
          <span className="border-2 border-[#C0392B] text-[#C0392B] text-xs font-black uppercase tracking-widest px-2 py-1 -rotate-12 bg-white/95 rounded shadow-lg">
            NULLIFIED
          </span>
        </div>
      )}

      {/* TOP HEADER: Category Badge + Points */}
      <div className="flex justify-between items-center z-20 pt-0.5">
        <div className="flex items-center gap-1">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${meta.badgeBg} text-white ring-1 ring-white/20`}
          >
            {meta.symbol}
          </span>
          <span className="font-supremacy text-xs font-black text-[#F4D03F] leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {cornerPointDisplay}
          </span>
        </div>

        <span className="text-[8.5px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-black/50 text-amber-200/90 border border-amber-300/25 truncate max-w-[70px] shadow-sm">
          {card.ruler || card.rulerName || (isRival ? 'Rival' : card.type.toUpperCase())}
        </span>
      </div>

      {/* CENTER ICONIC EMBLEM / THEMED CHARACTER ARTWORK */}
      <div className="relative w-full h-[76px] rounded-lg overflow-hidden border border-[#D4AF37]/35 my-1 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-black/60 via-[#0C2217]/70 to-black/70 shadow-inner group-hover:border-[#D4AF37]/75 transition-colors">
        {/* Dynamic Themed Character Artwork with Living Animation & Effects */}
        <CardCharacterArt
          card={card}
          compact={compact}
          isSelected={Boolean(isSelected)}
          isHovered={isHovered}
          isWildDramatic={isWildDramatic}
        />

        {/* Ruler subtitle / Lineage prompt */}
        {card.category === 'C' && (card.immediateFather || card.immediateSon) ? (
          <div className="absolute bottom-1 w-full text-center px-1 z-20">
            <span className="text-[7.5px] text-amber-200/95 bg-black/75 backdrop-blur-[2px] px-1.5 py-0.2 rounded-full border border-amber-200/30 font-mono truncate block shadow">
              {card.immediateFather ? `↑ ${card.immediateFather}` : ''}
              {card.immediateFather && card.immediateSon ? ' · ' : ''}
              {card.immediateSon ? `↓ ${card.immediateSon}` : ''}
            </span>
          </div>
        ) : card.ruler ? (
          <div className="absolute bottom-1 w-full text-center px-1 z-20">
            <span className="text-[7.5px] text-amber-200/90 bg-black/70 backdrop-blur-[2px] px-1.5 py-0.2 rounded font-editorial truncate block shadow">
              — {card.ruler}
            </span>
          </div>
        ) : card.effect ? (
          <div className="absolute bottom-1 w-full text-center px-1 z-20">
            <span className="text-[7px] text-[#55EFC4] bg-black/80 backdrop-blur-[2px] px-1.5 py-0.2 rounded font-mono font-bold truncate block shadow">
              {isRival ? '⚡ STEAL ALL' : isKarma ? '⚡ STEAL LAST' : '⚡ ACTION'}
            </span>
          </div>
        ) : null}
      </div>

      {/* CARD NAME & DETAIL */}
      <div className="text-center z-20 px-0.5">
        <h4 className="font-kate text-[11px] font-bold text-[#FDFBF7] leading-tight truncate drop-shadow-sm">
          {card.name}
        </h4>
        <p className="font-centrion text-[7.5px] text-amber-100/70 truncate leading-normal">
          {card.detail || card.historicalDetail || card.itemType || 'Dynastic Chronicle'}
        </p>
      </div>

      {/* BOTTOM FOOTER: Category Label & Points value */}
      <div className="flex justify-between items-center z-20 pt-1 border-t border-[#D4AF37]/25">
        <span className="text-[7.5px] font-black uppercase tracking-wider text-amber-200/80 truncate max-w-[70px]">
          {meta.label}
        </span>
        <div className="flex items-center gap-1">
          <span
            className={`font-supremacy text-xs sm:text-sm font-black leading-none ${
              isRival || isKarma
                ? 'text-[#FF7675]'
                : isBase
                ? 'text-gray-400'
                : 'text-[#55EFC4]'
            }`}
          >
            {isBase ? '0' : card.points > 0 ? `+${card.points}` : '0'}
          </span>
          <span className="text-[7px] font-bold text-amber-200/60">PTS</span>
        </div>
      </div>

      {/* Hover Tooltip: Complete historical details */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-60 bg-[#0D241A] text-[#F5EBE6] p-3 rounded-xl shadow-2xl text-[11px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 border border-[#D4AF37]/60">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-1 mb-1.5">
          <span className="font-kate font-bold text-[#F4D03F] text-xs truncate flex items-center gap-1">
            <span>{meta.symbol}</span>
            <span>{card.name}</span>
          </span>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#F4D03F]">
            {card.points ? `+${card.points} PTS` : '0 PTS'}
          </span>
        </div>
        <p className="text-white/85 text-[10px] leading-relaxed">
          {card.detail || card.historicalDetail || card.historicalContext || 'Dynastic chronicle from the Great Mughal records.'}
        </p>
        {card.effect && (
          <p className="text-[#55EFC4] text-[9.5px] mt-1.5 font-bold">
            ⚡ Rule: {card.effect}
          </p>
        )}
      </div>
    </motion.div>
  );
};
