import React from 'react';

interface WildCardLightningEffectProps {
  active?: boolean;
}

export const WildCardLightningEffect: React.FC<WildCardLightningEffectProps> = ({ active = true }) => {
  if (!active) return null;

  return (
    <div
      id="wild-card-lightning-overlay"
      className="fixed inset-0 pointer-events-none select-none z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Subtle Screen Glow & Radial Energy Burst */}
      <div className="wild-glow-bloom absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.5)_0%,rgba(140,230,255,0.3)_30%,rgba(212,175,55,0.18)_60%,transparent_85%)]" />

      {/* 2. Rapid Electric Flash Overlay (200-400ms smoothly disappearing) */}
      <div className="wild-lightning-flash absolute inset-0 bg-white/25 backdrop-brightness-150 backdrop-contrast-125" />

      {/* 3. Electric Lightning Strikes SVG */}
      <svg
        className="wild-bolt-flicker absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Intense cyan and golden high-voltage glow filter */}
          <filter id="lightning-intense-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Electric bolt gradient */}
          <linearGradient id="bolt-cyan-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#A7F3D0" />
            <stop offset="60%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* PRIMARY LIGHTNING BOLT: Striking across the battlefield from sky to table */}
        {/* Outer Glow Halo (Gold & Electric Cyan) */}
        <path
          d="M 580,0 L 595,75 L 560,135 L 610,210 L 555,280 L 635,370 L 580,440 L 650,540 L 615,620 L 670,710 L 650,800"
          stroke="#00E5FF"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          opacity="0.5"
          filter="url(#lightning-intense-glow)"
        />
        {/* Mid Energy Channel */}
        <path
          d="M 580,0 L 595,75 L 560,135 L 610,210 L 555,280 L 635,370 L 580,440 L 650,540 L 615,620 L 670,710 L 650,800"
          stroke="#38BDF8"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          opacity="0.85"
        />
        {/* Intense Pure White Core */}
        <path
          d="M 580,0 L 595,75 L 560,135 L 610,210 L 555,280 L 635,370 L 580,440 L 650,540 L 615,620 L 670,710 L 650,800"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          opacity="1"
        />

        {/* FORK 1: Branching to the Left (Maratha / Imperial Sovereign flank) */}
        <path
          d="M 560,135 L 480,185 L 430,240 L 370,265 L 310,320 L 260,340"
          stroke="#38BDF8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          opacity="0.5"
          filter="url(#lightning-intense-glow)"
        />
        <path
          d="M 560,135 L 480,185 L 430,240 L 370,265 L 310,320 L 260,340"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          opacity="0.9"
        />

        {/* Sub-branch on left */}
        <path
          d="M 430,240 L 410,305 L 360,350 L 340,410"
          stroke="#F4D03F"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* FORK 2: Branching to the Right (Dynastic Chain Arena flank) */}
        <path
          d="M 635,370 L 730,415 L 790,475 L 860,510 L 920,580 L 980,610"
          stroke="#38BDF8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          opacity="0.5"
          filter="url(#lightning-intense-glow)"
        />
        <path
          d="M 635,370 L 730,415 L 790,475 L 860,510 L 920,580 L 980,610"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="miter"
          fill="none"
          opacity="0.9"
        />

        {/* Sub-branch on right */}
        <path
          d="M 790,475 L 840,440 L 900,455 L 945,430"
          stroke="#F4D03F"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />

        {/* SECONDARY BOLT: Darting diagonally from top-right */}
        <path
          d="M 950,0 L 910,80 L 865,145 L 885,215 L 840,290 L 780,345 L 720,380"
          stroke="#00E5FF"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
          filter="url(#lightning-intense-glow)"
        />
        <path
          d="M 950,0 L 910,80 L 865,145 L 885,215 L 840,290 L 780,345 L 720,380"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* IONIZATION BLOOM NODES (Flash sparks at convergence junctions) */}
        <circle cx="580" cy="0" r="18" fill="#FFFFFF" opacity="0.8" filter="url(#lightning-intense-glow)" />
        <circle cx="635" cy="370" r="24" fill="#FFFFFF" opacity="0.9" filter="url(#lightning-intense-glow)" />
        <circle cx="650" cy="540" r="16" fill="#A7F3D0" opacity="0.85" filter="url(#lightning-intense-glow)" />
        <circle cx="260" cy="340" r="12" fill="#F4D03F" opacity="0.7" filter="url(#lightning-intense-glow)" />
        <circle cx="980" cy="610" r="14" fill="#F4D03F" opacity="0.7" filter="url(#lightning-intense-glow)" />
      </svg>
    </div>
  );
};
