import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardNode } from '../../engine/types';
import { Card } from './Card';

interface ChainProps {
  chain: CardNode[];
  legalTargetNodeIds: string[];
  selectedTargetNodeId: string | null;
  selectedCardId?: string | null;
  onSelectTargetNode: (nodeId: string) => void;
  onCommitPlay?: () => void;
  className?: string;
}

export const Chain: React.FC<ChainProps> = ({
  chain,
  legalTargetNodeIds,
  selectedTargetNodeId,
  selectedCardId,
  onSelectTargetNode,
  onCommitPlay,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [recentlyLandedNodeId, setRecentlyLandedNodeId] = useState<string | null>(null);
  const prevChainLengthRef = useRef(chain.length);

  useEffect(() => {
    if (chain.length > prevChainLengthRef.current && chain.length > 1) {
      const newestNode = chain[chain.length - 1];
      if (newestNode) {
        setRecentlyLandedNodeId(newestNode.id);
        const timer = setTimeout(() => {
          setRecentlyLandedNodeId(null);
        }, 1200);
        prevChainLengthRef.current = chain.length;
        return () => clearTimeout(timer);
      }
    }
    prevChainLengthRef.current = chain.length;
  }, [chain.length, chain]);

  // Group nodes into visual columns by depth
  const columns: CardNode[][] = [];
  chain.forEach((node) => {
    const colIdx = Math.min(node.depth, 12);
    if (!columns[colIdx]) columns[colIdx] = [];
    columns[colIdx].push(node);
  });

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const headNode = chain[chain.length - 1];
  const headCard = headNode?.card;
  const isAadeshActive = headCard?.type === 'aadesh' || Boolean((headCard as any)?.declaredCategory);
  const declaredCategory = (headCard as any)?.declaredCategory;
  const isCrisisActive = headCard?.type === 'crisis';

  return (
    <section
      id="dynastic-chain-section"
      className={`relative w-full flex-1 min-h-0 rounded-2xl bg-gradient-to-b from-[#102347]/95 via-[#181F3D]/95 to-[#160B24]/98 border-2 border-[#FFD700]/60 p-3 sm:p-4 shadow-[0_0_35px_rgba(0,0,0,0.75)] flex flex-col justify-between overflow-hidden select-none ${className}`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(255, 215, 0, 0.12) 0%, transparent 70%), linear-gradient(180deg, rgba(16, 35, 71, 0.95) 0%, rgba(24, 31, 61, 0.95) 50%, rgba(22, 11, 36, 0.98) 100%)'
      }}
    >
      {/* Decorative Ornate Gold Filigree Corners */}
      <div className="absolute top-2 left-2.5 text-xs text-[#FFD700]/60 pointer-events-none select-none">☸</div>
      <div className="absolute top-2 right-2.5 text-xs text-[#FFD700]/60 pointer-events-none select-none">☸</div>
      <div className="absolute bottom-2 left-2.5 text-xs text-[#FFD700]/40 pointer-events-none select-none">☸</div>
      <div className="absolute bottom-2 right-2.5 text-xs text-[#FFD700]/40 pointer-events-none select-none">☸</div>

      {/* 1. Header Bar: Title, Matching Rules & Category Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1 shrink-0 border-b border-[#FFD700]/30 pb-2.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-xs sm:text-sm font-kate uppercase tracking-[0.2em] text-[#FFD700] font-black flex items-center gap-1.5">
            <span>🏛️</span>
            <span>DYNASTIC CHAIN &amp; BASE ANCHOR</span>
          </h2>
          <span className="text-[10px] sm:text-[11px] bg-[#1A4D8E]/80 text-[#FFD700] border border-[#FFD700]/40 px-2.5 py-0.5 rounded-full font-medium">
            Match Category (C, L, M, R) or Character / Archetype
          </span>
        </div>

        {/* Legend chips & Slide controls */}
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-medium text-amber-200/90 hidden xl:flex items-center gap-2 bg-black/50 px-2.5 py-1 rounded-full border border-[#FFD700]/30">
            <span>👑 Creator (C: 8pts)</span>
            <span className="text-[#4CAF50]">📜 Dharma (D/L: 6pts)</span>
            <span>🏛️ Marvel (M: 4pts)</span>
            <span>🗺️ Realm (R: 2pts)</span>
            <span className="text-red-400">⚔️ Rival (Pot Steal)</span>
          </div>

          {/* Quick Slide Arrow Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={scrollLeft}
              className="w-7 h-7 rounded-full bg-[#1A4D8E] border border-[#FFD700]/50 hover:bg-[#FFD700] hover:text-[#0A1224] text-[#FFD700] text-xs font-bold transition flex items-center justify-center cursor-pointer shadow"
              title="Slide Chain Left"
            >
              ◀
            </button>
            <span className="text-[10px] uppercase font-bold text-[#FFD700]/80 tracking-widest px-1">
              Scroll Chain
            </span>
            <button
              onClick={scrollRight}
              className="w-7 h-7 rounded-full bg-[#1A4D8E] border border-[#FFD700]/50 hover:bg-[#FFD700] hover:text-[#0A1224] text-[#FFD700] text-xs font-bold transition flex items-center justify-center cursor-pointer shadow"
              title="Slide Chain Right"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Active Directive Banner for Aadesh / Crisis */}
      {(isAadeshActive || isCrisisActive) && (
        <div className="mx-1 mb-2 px-3 py-1.5 rounded-xl bg-black/55 border border-[#D4AF37]/40 flex items-center justify-between gap-2 text-xs shrink-0 shadow">
          {isAadeshActive && (
            <div className="flex items-center gap-2 text-purple-200 truncate">
              <span className="text-base">📜</span>
              <span className="truncate">
                <strong className="text-purple-300">Imperial Command (Aadesh) Active:</strong> Declared Category:{' '}
                <span className="font-bold text-[#F4D03F] bg-purple-950/80 px-2 py-0.5 rounded border border-purple-400 font-mono">
                  {declaredCategory ? `${declaredCategory} (Must Match)` : 'Aadesh Active'}
                </span>
                . Play {declaredCategory || 'required category'} or another Wild card!
              </span>
            </div>
          )}
          {isCrisisActive && (
            <div className="flex items-center gap-2 text-rose-200 truncate">
              <span className="text-base">☠️</span>
              <span className="truncate">
                <strong className="text-rose-300">Imperial Crisis ({headCard?.name}) Active:</strong> Must play{' '}
                <span className="font-bold text-[#F4D03F] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-400 font-mono">
                  {headCard?.effect === 'require_region' ? 'Region (R)' : 'Marvel (M)'}
                </span>{' '}
                or draw with a 1-point penalty!
              </span>
            </div>
          )}
        </div>
      )}

      {/* 2. Main Dynastic Chain Arena Canvas (Expansive Center Stage) */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-[240px] flex items-center justify-start overflow-x-auto overflow-y-auto px-4 py-3 custom-hand-scrollbar"
      >
        {/* Subtle Watermark or Floor Pattern */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <div className="w-96 h-96 rounded-full border-8 border-[#D4AF37] flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border-4 border-[#D4AF37]" />
          </div>
        </div>

        <div className="flex items-center gap-5 sm:gap-7 min-w-max h-full relative z-10 py-2">
          {columns.map((colNodes, colIndex) => (
            <div key={`col_${colIndex}`} className="flex flex-col gap-3 justify-center items-center relative">
              {/* Lineage Branch connector indicator */}
              {colIndex > 0 && (
                <div className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37] pointer-events-none" />
              )}

              {colNodes.map((node) => {
                const isBase = node.parentCardId === null || node.card.id === 'base_anchor_card';
                const isLegalTarget = legalTargetNodeIds.includes(node.id);
                const isSelected = selectedTargetNodeId === node.id;
                const isJustLanded = recentlyLandedNodeId === node.id;

                return (
                  <motion.div
                    key={node.id}
                    initial={isJustLanded ? { scale: 1.15, rotate: -3.5, y: -12 } : false}
                    animate={{ scale: 1, rotate: 0, y: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                    className="relative group"
                  >
                    {/* Legal Target Ring Overlay */}
                    {isLegalTarget && (
                      <div className="absolute -inset-2 rounded-2xl border-2 border-[#D4AF37] animate-ping opacity-45 pointer-events-none" />
                    )}

                    {/* Card Play Landing Themed Particle Burst & Shockwave Ring */}
                    <AnimatePresence>
                      {isJustLanded && (
                        <div className="absolute -inset-4 pointer-events-none z-40 overflow-visible flex items-center justify-center">
                          {/* Expanding Radial Shockwave Ring */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 1 }}
                            animate={{ scale: 1.35, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.85, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-2xl border-2 border-[#F4D03F] shadow-[0_0_20px_rgba(212,175,55,0.7)]"
                          />

                          {/* Radiating Sparkle Particles */}
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, pIdx) => {
                            const rad = (angle * Math.PI) / 180;
                            const tx = Math.cos(rad) * 48;
                            const ty = Math.sin(rad) * 48;

                            return (
                              <motion.div
                                key={`sparkle-${pIdx}`}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{ x: tx, y: ty, opacity: 0, scale: 0.2 }}
                                transition={{ duration: 0.75, ease: 'easeOut' }}
                                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#F4D03F] to-[#D4AF37] shadow-[0_0_8px_#F4D03F]"
                              />
                            );
                          })}
                        </div>
                      )}
                    </AnimatePresence>

                    <Card
                      card={node.card}
                      isBase={isBase}
                      compact={false}
                      isLegalTarget={isLegalTarget}
                      isSelected={isSelected}
                      onClick={() => {
                        onSelectTargetNode(node.id);
                        if (isSelected && onCommitPlay) {
                          onCommitPlay();
                        }
                      }}
                      className={`transition-all duration-200 ${
                        isJustLanded ? 'animate-card-landing' : ''
                      } ${
                        isLegalTarget ? 'ring-2 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.6)] cursor-pointer' : ''
                      } ${isSelected ? 'ring-4 ring-[#E07A5F] scale-105' : ''}`}
                    />

                    {/* Quick indicator badge */}
                    {isSelected && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E07A5F] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg z-30 border border-white/60">
                        Target Slot
                      </div>
                    )}

                    {isLegalTarget && !isSelected && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#163828] text-[#F4D03F] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full shadow border border-[#D4AF37]/50 z-20 whitespace-nowrap">
                        Legal Link
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}

          {/* Open Attachment Slot indicator (+ LEGAL LINK SLOT) */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            onClick={() => {
              if (legalTargetNodeIds.length > 0) {
                onSelectTargetNode(legalTargetNodeIds[legalTargetNodeIds.length - 1]);
              }
            }}
            className={`w-[130px] h-[184px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition cursor-pointer shrink-0 relative ${
              selectedCardId && legalTargetNodeIds.length > 0
                ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_25px_rgba(212,175,55,0.4)] animate-pulse'
                : 'border-[#D4AF37]/35 bg-black/25 opacity-75 hover:opacity-100 hover:border-[#D4AF37]'
            }`}
          >
            <span className="text-3xl text-[#D4AF37] mb-1 font-black">+</span>
            <span className="font-kate text-xs text-[#F4D03F] font-bold uppercase tracking-wider">
              {legalTargetNodeIds.length > 0 ? 'Click to Attach' : 'Legal Link Slot'}
            </span>
            <span className="text-[9.5px] text-amber-200/70 mt-1 leading-snug">
              {selectedCardId
                ? 'Attach selected card here'
                : 'Select card in hand to branch'}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
