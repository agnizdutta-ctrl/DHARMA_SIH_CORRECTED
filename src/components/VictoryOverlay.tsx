/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, Sparkles, RefreshCw, Compass, BookOpen, Share2, Check, Shield, Flame, Zap, Target } from 'lucide-react';
import { Player, FinalScore } from '../../engine/types';
import { EraId } from '../types/era';
import { playSound } from '../utils/audio';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  eraFlavoredTitle: Record<EraId, string>;
  unlocked: boolean;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Mythic';
}

interface VictoryOverlayProps {
  isOpen: boolean;
  winner?: Player;
  players: Player[];
  finalScores: FinalScore[];
  currentEra: EraId;
  roundsPlayed: number;
  onRematch: () => void;
  onExitToMenu: () => void;
  onOpenCodex: () => void;
}

export const VictoryOverlay: React.FC<VictoryOverlayProps> = ({
  isOpen,
  winner,
  players,
  finalScores,
  currentEra,
  roundsPlayed,
  onRematch,
  onExitToMenu,
  onOpenCodex
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'metrics' | 'achievements' | 'scoreboard'>('metrics');

  useEffect(() => {
    if (isOpen) {
      playSound('roundWin');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Best player is the winner or first in finalScores
  const topScore = finalScores[0] || {
    player: winner || players[0],
    totalScore: winner?.score || 0,
    cardPoints: winner?.cardPoints || 0,
    stolenPoints: winner?.stolenPoints || 0,
    drawPenalties: winner?.drawPenalties || 0,
    handCount: winner?.hand?.length || 0,
    rivalStealsCount: winner?.rivalStealsCount || 0,
    highestCardValue: winner?.highestSingleCard || 8,
    rank: 1
  };

  const winningPlayer = topScore.player;
  const isHandCleared = topScore.handCount === 0;

  // Era specific presentation titles & palettes
  const eraThemes: Record<
    EraId,
    {
      title: string;
      crest: string;
      crownTitle: string;
      accentGrad: string;
      borderCol: string;
      glowCol: string;
      primaryBtn: string;
    }
  > = {
    mughal: {
      title: 'MUGHAL YUGAM',
      crest: '👑',
      crownTitle: 'Padishah of Hindustan',
      accentGrad: 'from-amber-400 via-emerald-400 to-amber-300',
      borderCol: 'border-emerald-500/50',
      glowCol: 'rgba(16, 185, 129, 0.35)',
      primaryBtn: 'from-emerald-600 to-emerald-800'
    },
    swaraj: {
      title: 'SWARAJ YUG',
      crest: '🇮🇳',
      crownTitle: 'Vanguard of Freedom',
      accentGrad: 'from-orange-400 via-amber-300 to-emerald-400',
      borderCol: 'border-orange-500/50',
      glowCol: 'rgba(249, 115, 22, 0.35)',
      primaryBtn: 'from-orange-600 to-amber-700'
    },
    mahabharat: {
      title: 'MAHABHARATA',
      crest: '🕉️',
      crownTitle: 'Dharmic Sovereign',
      accentGrad: 'from-amber-300 via-yellow-200 to-indigo-300',
      borderCol: 'border-amber-400/50',
      glowCol: 'rgba(212, 175, 55, 0.4)',
      primaryBtn: 'from-amber-600 to-yellow-700'
    }
  };

  const currentEraTheme = eraThemes[currentEra] || eraThemes.mahabharat;

  // Calculate Unlocked Achievements based on performance
  const achievements: Achievement[] = [
    {
      id: 'sovereign_claim',
      icon: '👑',
      title: 'Crown Sovereign',
      subtitle: 'Achieved 1st place in the court',
      description: 'Defeated all rival commanders to claim supreme points supremacy.',
      eraFlavoredTitle: {
        mughal: 'Imperial Padishah',
        swaraj: 'Rashtra Nayak',
        mahabharat: 'Chakravartin Samrat'
      },
      unlocked: true,
      rarity: 'Legendary'
    },
    {
      id: 'clean_sweep',
      icon: '🎴',
      title: 'Dharma Hand Clear',
      subtitle: 'Completely emptied active hand',
      description: 'Shed all initial cards into the dynastic chain before the duel ended.',
      eraFlavoredTitle: {
        mughal: 'Royal Court Depletion',
        swaraj: 'Swaraj Liberation',
        mahabharat: 'Maha Dharma Consecration'
      },
      unlocked: isHandCleared || topScore.handCount <= 1,
      rarity: 'Mythic'
    },
    {
      id: 'pot_raider',
      icon: '⚔️',
      title: 'Imperial Pot Raider',
      subtitle: 'Stole points with a Rival card',
      description: 'Snatched points directly from the center Pot with a calculated Rival play.',
      eraFlavoredTitle: {
        mughal: 'Mewar Guerilla Strike',
        swaraj: 'Colonial Pot Intercept',
        mahabharat: "Shakuni's Deceitful Steal"
      },
      unlocked: topScore.stolenPoints > 0 || topScore.rivalStealsCount > 0,
      rarity: 'Rare'
    },
    {
      id: 'apex_card',
      icon: '⚡',
      title: 'Apex Sovereign',
      subtitle: 'Played a top 8-point card',
      description: 'Successfully deployed a foundational 8-point Creator figure into the chain.',
      eraFlavoredTitle: {
        mughal: 'Imperial Akbar Farman',
        swaraj: 'Netaji Clarion Call',
        mahabharat: 'Sudarshana Avatar Strike'
      },
      unlocked: topScore.highestCardValue >= 8,
      rarity: 'Common'
    },
    {
      id: 'pristine_discipline',
      icon: '🛡️',
      title: 'Tactical Purity',
      subtitle: 'Zero or minimal draw penalties',
      description: 'Maintained seamless tactical flow without incurring heavy draw penalties.',
      eraFlavoredTitle: {
        mughal: 'Unbroken Mansab Rule',
        swaraj: 'Disciplined Satyagraha',
        mahabharat: 'Unswerving Rajadharma'
      },
      unlocked: topScore.drawPenalties <= 1,
      rarity: 'Rare'
    },
    {
      id: 'clemar_mastery',
      icon: '🏛️',
      title: 'CLeMaR Master Architect',
      subtitle: 'Balanced dynastic expansion',
      description: 'Connected cards across multiple branches while preserving chain continuity.',
      eraFlavoredTitle: {
        mughal: 'Navaratna Court Builder',
        swaraj: 'Pan-Indian Vanguard',
        mahabharat: 'Kuru Lineage Chronicler'
      },
      unlocked: topScore.cardPoints >= 12,
      rarity: 'Common'
    }
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleShare = () => {
    const text = `🏆 DHARMA: ${currentEraTheme.title} Match Result!\n👑 Champion: ${winningPlayer.name}\n⭐ Score: ${topScore.totalScore} PTS (Card: +${topScore.cardPoints}, Stolen: +${topScore.stolenPoints}, Penalties: -${topScore.drawPenalties})\n🎖️ Achievements Unlocked: ${unlockedCount}/${achievements.length}\nPlay the Chronicles of Bharat!`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="post-match-victory-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      {/* Dynamic celebratory confetti / particle bursts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: '50vw',
              y: '45vh',
              scale: 0,
              opacity: 1,
              rotate: 0
            }}
            animate={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: Math.random() * 1.4 + 0.6,
              opacity: [1, 1, 0],
              rotate: Math.random() * 720 - 360
            }}
            transition={{
              duration: Math.random() * 2.5 + 2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: Math.random() * 0.8
            }}
            className="absolute w-3 h-3 rounded-sm shadow-md"
            style={{
              backgroundColor: ['#F59E0B', '#10B981', '#F97316', '#EAB308', '#6366F1', '#EC4899'][i % 6]
            }}
          />
        ))}
      </div>

      {/* Main Glassmorphic Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className={`relative w-full max-w-3xl rounded-3xl bg-gradient-to-b from-[#111827]/95 via-[#0c121e]/98 to-[#060a12] border-2 ${currentEraTheme.borderCol} p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden text-[#F8FAFC]`}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: currentEraTheme.glowCol }}
        />

        {/* Top Header & Crest */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-amber-300 shadow">
            <span>{currentEraTheme.crest}</span>
            <span>{currentEraTheme.title} · VICTORY ARCHIVE</span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-bounce" />
            <h1
              className={`text-2xl sm:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${currentEraTheme.accentGrad}`}
              style={{ fontFamily: "'Cinzel Decorative', 'Cinzel', serif" }}
            >
              {winningPlayer.name}
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-amber-200/90 mt-1 uppercase tracking-widest">
            {currentEraTheme.crownTitle} · Round {roundsPlayed} Concluded
          </p>
        </div>

        {/* Tabs for Navigation (Performance Metrics / Unlocked Achievements / Tie-Breaker Table) */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-6 border-b border-white/10 pb-3">
          <button
            onClick={() => {
              playSound('click');
              setSelectedTab('metrics');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'metrics'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Performance Metrics
          </button>

          <button
            onClick={() => {
              playSound('click');
              setSelectedTab('achievements');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'achievements'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Achievements ({unlockedCount}/{achievements.length})
          </button>

          <button
            onClick={() => {
              playSound('click');
              setSelectedTab('scoreboard');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'scoreboard'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Scoreboard Table
          </button>
        </div>

        {/* TAB 1: PERFORMANCE METRICS OVERLAY */}
        {selectedTab === 'metrics' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4"
          >
            {/* Top Score Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-400/30 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-amber-200/70 font-semibold">Total Points</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow mt-0.5">
                  {topScore.totalScore}
                </span>
                <span className="text-[9.5px] text-emerald-400 font-bold mt-0.5">Net Sovereign Score</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Card Points</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
                  +{topScore.cardPoints}
                </span>
                <span className="text-[9.5px] text-slate-400 font-bold mt-0.5">CLeMaR Matches</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Stolen Pot</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5">
                  +{topScore.stolenPoints}
                </span>
                <span className="text-[9.5px] text-amber-400/80 font-bold mt-0.5">
                  {topScore.rivalStealsCount} Rival Steals
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Draw Penalties</span>
                <span className="text-2xl sm:text-3xl font-black text-rose-400 mt-0.5">
                  -{topScore.drawPenalties}
                </span>
                <span className="text-[9.5px] text-rose-300/80 font-bold mt-0.5">Tactical Deductions</span>
              </div>
            </div>

            {/* Tactical Metrics Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Duel Tactical Analysis
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-slate-400">Hand Depletion:</span>
                  <span className="font-bold text-amber-200">
                    {topScore.handCount === 0 ? '✨ 0 Left (Clean DHARMA)' : `${topScore.handCount} Cards Remaining`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-slate-400">Highest Card:</span>
                  <span className="font-bold text-amber-200">
                    👑 {topScore.highestCardValue} Pts (Creator Tier)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-slate-400">Era Edition:</span>
                  <span className="font-bold text-amber-200">
                    {currentEraTheme.title}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: UNLOCKED ACHIEVEMENTS OVERLAY */}
        {selectedTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[290px] overflow-y-auto pr-1"
          >
            {achievements.map((ach) => {
              const eraTitle = ach.eraFlavoredTitle[currentEra] || ach.title;

              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    ach.unlocked
                      ? 'bg-gradient-to-r from-amber-500/10 via-black/40 to-black/40 border-amber-400/40 shadow-sm'
                      : 'bg-black/30 border-white/5 opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 ring-2 ring-amber-300/40'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs truncate text-amber-100">
                        {eraTitle}
                      </h4>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                          ach.unlocked
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-white/5 text-slate-500'
                        }`}
                      >
                        {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-amber-200/70 mt-0.5">{ach.subtitle}</p>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-snug line-clamp-2">
                      {ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* TAB 3: AUTHORITATIVE TIE-BREAKER SCOREBOARD */}
        {selectedTab === 'scoreboard' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-inner"
          >
            <table className="w-full text-left text-xs">
              <thead className="bg-white/10 text-amber-200 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Player</th>
                  <th className="p-3 text-right">Card Pts</th>
                  <th className="p-3 text-right">Stolen</th>
                  <th className="p-3 text-right">Penalty</th>
                  <th className="p-3 text-right">Hand</th>
                  <th className="p-3 text-right font-black">Net Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {finalScores.map((score, idx) => (
                  <tr
                    key={score.player.id}
                    className={idx === 0 ? 'bg-amber-400/10 font-bold text-amber-100' : ''}
                  >
                    <td className="p-3">
                      {idx === 0 ? '👑 1st' : `${idx + 1}th`}
                    </td>
                    <td className="p-3 font-semibold text-white">{score.player.name}</td>
                    <td className="p-3 text-right text-emerald-400">+{score.cardPoints}</td>
                    <td className="p-3 text-right text-amber-300">+{score.stolenPoints}</td>
                    <td className="p-3 text-right text-rose-400">-{score.drawPenalties}</td>
                    <td className="p-3 text-right text-slate-400">{score.handCount}</td>
                    <td className="p-3 text-right text-sm font-black text-amber-300">
                      {score.totalScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Action Controls & Navigation Footer */}
        <div className="relative z-10 flex flex-wrap items-center justify-center sm:justify-between gap-3 mt-7 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('click');
                onOpenCodex();
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Era Codex
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
              {copied ? 'Copied!' : 'Share'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('cardPlay');
                onExitToMenu();
              }}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-xs font-bold text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              Choose Another Era
            </button>

            <button
              onClick={() => {
                playSound('cardPlay');
                onRematch();
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer border border-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Play Rematch
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
