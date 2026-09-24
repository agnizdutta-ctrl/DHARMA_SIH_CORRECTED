import React from 'react';
import { CardData, PlayedCard } from '../../engine/types';
import { Card } from './Card';

interface WildCardCinematicOverlayProps {
  card: CardData | PlayedCard | null;
  isCinematicActive: boolean;
  isLightningActive: boolean;
}

export const WildCardCinematicOverlay: React.FC<WildCardCinematicOverlayProps> = ({
  card,
  isCinematicActive,
  isLightningActive
}) => {
  if (!isCinematicActive && !isLightningActive) return null;

  return (
    <div
      id="wild-card-cinematic-master-overlay"
      className="fixed inset-0 pointer-events-none select-none z-[60] overflow-hidden flex flex-col items-center justify-center"
      aria-hidden="true"
    >
      {/* 1. Cinematic Ambient Spotlight Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(10,26,18,0.35)_0%,rgba(4,12,8,0.75)_100%)] transition-opacity duration-700 pointer-events-none" />

      {/* 2. Slow-Motion Dramatic WILD CARD Spotlight (0.0s - 1.4s) */}
      {card && isCinematicActive && (
        <div className="relative z-10 flex flex-col items-center justify-center wild-card-cinematic-entrance">
          {/* Imperial Celestial Header */}
          <div className="flex flex-col items-center mb-4 text-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-md">
              <span className="text-[#00E5FF] text-xs animate-pulse">⚡</span>
              <span className="text-[11px] sm:text-xs font-serif font-black tracking-[0.25em] text-[#F5EBE6] uppercase drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">
                WILD CARD UNLEASHED
              </span>
              <span className="text-[#D4AF37] text-xs animate-pulse">⚡</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-[#A7F3D0] tracking-widest font-mono uppercase mt-1 opacity-90">
              Cosmic Law Overruled • Fate Altered
            </span>
          </div>

          {/* Glowing Aura Rings Behind Card */}
          <div className="relative">
            <div className="absolute -inset-8 sm:-inset-12 rounded-full border border-[#00E5FF]/30 blur-sm animate-pulse" />
            <div className="absolute -inset-16 sm:-inset-24 rounded-full border border-[#D4AF37]/20 blur-md pointer-events-none" />

            {/* High-Resolution Hero Wild Card Display with Dramatic Animated Character */}
            <div className="transform scale-110 sm:scale-125 transition-transform duration-500 shadow-[0_0_60px_rgba(0,229,255,0.4),0_0_100px_rgba(212,175,55,0.3)] rounded-xl">
              <Card
                card={card}
                compact={false}
                isSelected={false}
                isLegalTarget={false}
                isWildDramatic={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Electric Lightning Strikes & Flash (Active around 1.0s) */}
      {isLightningActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {/* Screen Glow Bloom */}
          <div className="wild-glow-bloom absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.55)_0%,rgba(140,230,255,0.35)_30%,rgba(212,175,55,0.22)_60%,transparent_85%)]" />

          {/* Intense Multi-Flash Screen Strobe */}
          <div className="wild-lightning-flash absolute inset-0 bg-white/30 backdrop-brightness-150 backdrop-contrast-125" />

          {/* Jagged Electric Lightning SVG Bolts */}
          <svg
            className="wild-bolt-flicker absolute inset-0 w-full h-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="cinematic-lightning-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur2" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur3" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* PRIMARY VERTICAL STRIKE */}
            {/* Outer Cyan/Gold Glow */}
            <path
              d="M 580,0 L 595,75 L 560,135 L 610,210 L 555,280 L 635,370 L 580,440 L 650,540 L 615,620 L 670,710 L 650,800"
              stroke="#00E5FF"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="miter"
              fill="none"
              opacity="0.55"
              filter="url(#cinematic-lightning-glow)"
            />
            {/* Mid Electric Blue Energy Channel */}
            <path
              d="M 580,0 L 595,75 L 560,135 L 610,210 L 555,280 L 635,370 L 580,440 L 650,540 L 615,620 L 670,710 L 650,800"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="miter"
              fill="none"
              opacity="0.9"
            />
            {/* Pure White Hot Core */}
            <path
              d="M 580,0 L 595,75 L 560,135 L 610,210 L 555,280 L 635,370 L 580,440 L 650,540 L 615,620 L 670,710 L 650,800"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="miter"
              fill="none"
              opacity="1"
            />

            {/* FORK 1: Left Branch */}
            <path
              d="M 560,135 L 480,185 L 430,240 L 370,265 L 310,320 L 260,340"
              stroke="#00E5FF"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
              filter="url(#cinematic-lightning-glow)"
            />
            <path
              d="M 560,135 L 480,185 L 430,240 L 370,265 L 310,320 L 260,340"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            <path
              d="M 430,240 L 410,305 L 360,350 L 340,410"
              stroke="#F4D03F"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* FORK 2: Right Branch */}
            <path
              d="M 635,370 L 730,415 L 790,475 L 860,510 L 920,580 L 980,610"
              stroke="#00E5FF"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
              filter="url(#cinematic-lightning-glow)"
            />
            <path
              d="M 635,370 L 730,415 L 790,475 L 860,510 L 920,580 L 980,610"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            <path
              d="M 790,475 L 840,440 L 900,455 L 945,430"
              stroke="#F4D03F"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* SECONDARY BOLT: Darting diagonally from top-right */}
            <path
              d="M 960,0 L 915,80 L 865,145 L 885,215 L 840,290 L 780,345 L 720,380"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
              filter="url(#cinematic-lightning-glow)"
            />
            <path
              d="M 960,0 L 915,80 L 865,145 L 885,215 L 840,290 L 780,345 L 720,380"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />

            {/* Ionization Convergence Sparks */}
            <circle cx="580" cy="0" r="18" fill="#FFFFFF" opacity="0.9" filter="url(#cinematic-lightning-glow)" />
            <circle cx="635" cy="370" r="26" fill="#FFFFFF" opacity="0.95" filter="url(#cinematic-lightning-glow)" />
            <circle cx="650" cy="540" r="18" fill="#A7F3D0" opacity="0.85" filter="url(#cinematic-lightning-glow)" />
            <circle cx="260" cy="340" r="14" fill="#F4D03F" opacity="0.8" filter="url(#cinematic-lightning-glow)" />
            <circle cx="980" cy="610" r="16" fill="#F4D03F" opacity="0.8" filter="url(#cinematic-lightning-glow)" />
          </svg>
        </div>
      )}
    </div>
  );
};
