import React from 'react';
import { motion } from 'motion/react';

interface PlayerZoneProps {
  player1?: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    cardCount: number;
    score: number;
    cardPoints: number;
    stolenPoints: number;
  };
  player2?: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    cardCount: number;
    score: number;
    cardPoints: number;
    stolenPoints: number;
  };
  currentTurnPlayerId: string;
  activeViewingPlayerId?: string;
  myPlayerId: string | null;
  deckCount: number;
  onDrawCard: () => void;
  onSelectViewingPlayer?: (playerId: string) => void;
}

export const PlayerZone: React.FC<PlayerZoneProps> = ({
  player1,
  player2,
  currentTurnPlayerId,
  activeViewingPlayerId,
  deckCount,
  onDrawCard,
  onSelectViewingPlayer
}) => {
  const isP1Turn = player1 && player1.id === currentTurnPlayerId;
  const isP2Turn = player2 && player2.id === currentTurnPlayerId;

  const isViewingP1 = activeViewingPlayerId === 'p1' || (!activeViewingPlayerId && isP1Turn);
  const isViewingP2 = activeViewingPlayerId === 'p2';

  return (
    <section
      id="player-zone-section"
      className="relative w-full min-h-[95px] h-auto flex items-center justify-between px-3 sm:px-6 my-1"
    >
      {/* Player 1 Zone (AD - Boy Avatar) */}
      {player1 && (
        <motion.div
          id="player1-zone-card"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectViewingPlayer && onSelectViewingPlayer('p1')}
          animate={{
            borderColor: isViewingP1
              ? '#D4AF37'
              : isP1Turn
              ? '#E07A5F'
              : 'rgba(26,51,38,0.2)',
            boxShadow: isViewingP1
              ? '0 0 24px rgba(212, 175, 55, 0.45)'
              : isP1Turn
              ? '0 0 20px rgba(224, 122, 95, 0.4)'
              : '0 4px 12px rgba(26,51,38,0.06)'
          }}
          className={`w-[240px] sm:w-[285px] h-[95px] rounded-xl bg-[rgba(212,228,220,0.96)] border-2 p-2.5 flex items-center justify-between shadow-lg relative transition-all cursor-pointer ${
            isViewingP1 ? 'ring-2 ring-[#D4AF37]' : ''
          }`}
          title="Click to view AD's hand and cards"
        >
          {/* Turn Badge / Viewing Badge */}
          <div className="absolute -top-3 left-4 flex items-center gap-1.5 z-20">
            {isP1Turn && (
              <span className="bg-[#E07A5F] text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                ACTIVE TURN
              </span>
            )}
            {isViewingP1 ? (
              <span className="bg-[#163828] text-[#F4D03F] border border-[#D4AF37]/50 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                👁 VIEWING HAND
              </span>
            ) : (
              <span className="bg-black/60 text-white/80 text-[8.5px] font-bold px-1.5 py-0.5 rounded-full">
                TAP TO VIEW
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] shadow-md overflow-hidden">
                <img
                  src={player1.avatar}
                  alt={player1.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h3 className="font-centrion font-bold text-[#1A3326] text-sm leading-tight flex items-center gap-1">
                <span>{player1.name}</span>
                <span className="text-[10px] text-amber-800 font-semibold">(Boy)</span>
              </h3>
              <span className="text-[10px] text-[#1A3326]/75 uppercase tracking-wider font-semibold block">
                {player1.title}
              </span>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-[10.5px] bg-[#E8F0EC] border border-[#1A3326]/20 px-1.5 py-0.2 rounded font-bold text-[#1A3326]">
                  {player1.cardCount} Cards
                </span>
                <span className="text-[9px] text-[#163828] font-bold underline">
                  Show Cards
                </span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="text-right">
            <span className="text-[9px] text-[#1A3326]/60 font-bold uppercase tracking-wider">
              Score
            </span>
            <div className="font-supremacy text-2xl font-black text-[#E07A5F] leading-none mt-0.5">
              {player1.score}
            </div>
            <span className="text-[9px] text-emerald-700 font-bold">
              +{player1.stolenPoints} Stolen
            </span>
          </div>
        </motion.div>
      )}

      {/* The Central Draw Deck */}
      <div className="flex flex-col items-center justify-center z-10 mx-1 sm:mx-2">
        <motion.div
          id="central-draw-deck-anchor"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDrawCard}
          className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg bg-gradient-to-b from-[#1A3326] to-[#0D1F17] border-2 border-[#D4AF37] shadow-xl flex flex-col items-center justify-between p-1 cursor-pointer group"
          title="Click to Draw Card (-1 Point penalty)"
        >
          {/* Stack effect */}
          <div className="absolute -top-1.5 -right-1.5 w-full h-full rounded-lg bg-[#0F261C] border border-[#D4AF37]/40 -z-10" />
          <div className="absolute -top-3 -right-3 w-full h-full rounded-lg bg-[#081710] border border-[#D4AF37]/20 -z-20" />

          <div className="w-full flex justify-between items-center text-[#D4AF37] px-0.5">
            <span className="text-[7.5px] font-bold">🂠</span>
            <span className="text-[7.5px] font-bold">DECK</span>
          </div>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-black/40 group-hover:scale-110 transition-transform">
            <div className="flex flex-col items-center justify-center">
              <span className="font-supremacy text-xs sm:text-sm font-black text-[#F4D03F] leading-none">
                {deckCount}
              </span>
            </div>
          </div>

          <div className="w-full text-center z-10">
            <span className="text-[7.5px] text-[#F4D03F] tracking-wider font-extrabold uppercase bg-[#1A3326]/90 px-1 py-0.5 rounded-full border border-[#D4AF37]/50">
              DRAW (-1)
            </span>
          </div>
        </motion.div>

        <span className="font-kate text-[#1A3326] text-[10px] font-bold uppercase tracking-[0.1em] mt-0.5 flex items-center gap-1">
          <span>Deck</span>
          <span className="text-[#E07A5F]">(-1 Pt)</span>
        </span>
      </div>

      {/* Player 2 Zone (RS - Girl Avatar) */}
      {player2 && (
        <motion.div
          id="player2-zone-card"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectViewingPlayer && onSelectViewingPlayer('p2')}
          animate={{
            borderColor: isViewingP2
              ? '#D4AF37'
              : isP2Turn
              ? '#E07A5F'
              : 'rgba(26,51,38,0.2)',
            boxShadow: isViewingP2
              ? '0 0 24px rgba(212, 175, 55, 0.45)'
              : isP2Turn
              ? '0 0 20px rgba(224, 122, 95, 0.4)'
              : '0 4px 12px rgba(26,51,38,0.06)'
          }}
          className={`w-[240px] sm:w-[285px] h-[95px] rounded-xl bg-[rgba(212,228,220,0.96)] border-2 p-2.5 flex items-center justify-between shadow-md relative transition-all cursor-pointer ${
            isViewingP2 ? 'ring-2 ring-[#D4AF37]' : ''
          }`}
          title="Click to view RS's hand and cards"
        >
          {/* Turn Badge / Viewing Badge */}
          <div className="absolute -top-3 right-4 flex items-center gap-1.5 z-20">
            {isP2Turn && (
              <span className="bg-[#E07A5F] text-white text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                ACTIVE TURN
              </span>
            )}
            {isViewingP2 ? (
              <span className="bg-[#163828] text-[#F4D03F] border border-[#D4AF37]/50 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                👁 VIEWING HAND
              </span>
            ) : (
              <span className="bg-black/60 text-white/80 text-[8.5px] font-bold px-1.5 py-0.5 rounded-full">
                TAP TO VIEW
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] shadow-md overflow-hidden">
                <img
                  src={player2.avatar}
                  alt={player2.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <h3 className="font-centrion font-bold text-[#1A3326] text-sm leading-tight flex items-center gap-1">
                <span>{player2.name}</span>
                <span className="text-[10px] text-amber-800 font-semibold">(Girl)</span>
              </h3>
              <span className="text-[10px] text-[#1A3326]/75 uppercase tracking-wider font-semibold block">
                {player2.title}
              </span>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="text-[10.5px] bg-[#E8F0EC] border border-[#1A3326]/20 px-1.5 py-0.2 rounded font-bold text-[#1A3326]">
                  {player2.cardCount} Cards
                </span>
                <span className="text-[9px] text-[#163828] font-bold underline">
                  Show Cards
                </span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="text-right">
            <span className="text-[9px] text-[#1A3326]/60 font-bold uppercase tracking-wider">
              Score
            </span>
            <div className="font-supremacy text-2xl font-black text-[#E07A5F] leading-none mt-0.5">
              {player2.score}
            </div>
            <span className="text-[9px] text-emerald-700 font-bold">
              +{player2.stolenPoints} Stolen
            </span>
          </div>
        </motion.div>
      )}
    </section>
  );
};
