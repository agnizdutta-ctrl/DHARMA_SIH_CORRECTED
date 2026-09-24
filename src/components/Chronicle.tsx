/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import { EraId } from '../types/era';
import cardsMahabharat from '../../data/cards-mahabharat.json';
import cardsMughal from '../../data/cards-mughal.json';
import cardsSwaraj from '../../data/cards-swaraj.json';

interface ChronicleProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chronicle: React.FC<ChronicleProps> = ({ isOpen, onClose }) => {
  const { currentEra, setCurrentEra } = useGameStore();
  const [activeEraTab, setActiveEraTab] = useState<EraId>(currentEra || 'mahabharat');
  const [activeTab, setActiveTab] = useState<'rules' | 'rulers' | 'cards'>('rules');

  if (!isOpen) return null;

  // Era specific metadata and dataset
  const getEraDataset = () => {
    switch (activeEraTab) {
      case 'mughal':
        return {
          title: 'DHARMA: MUGHAL YUGAM',
          subtitle: 'The Imperial Chronicles of Hindustan (1526–1857)',
          tagline: 'Padishahs, Navaratnas, Royal Farmans & Dynastic Succession',
          rulersLabel: 'The Imperial Sovereigns',
          accent: 'from-amber-400 via-emerald-400 to-amber-300',
          badgeBg: 'bg-emerald-800 text-emerald-100',
          data: cardsMughal,
          specialList: cardsMughal.specialCards || []
        };
      case 'swaraj': {
        const specials = (cardsSwaraj.cards || []).filter(
          (c: any) =>
            c.type !== 'main' ||
            ['rival', 'aadesh', 'mouna', 'chakravyuha', 'crisis'].includes(c.type) ||
            ['Rival', 'Special'].includes(c.category)
        );
        // Deduplicate special cards by name
        const uniqueSpecials: any[] = [];
        const seenNames = new Set<string>();
        for (const sp of specials) {
          if (!seenNames.has(sp.name)) {
            seenNames.add(sp.name);
            uniqueSpecials.push(sp);
          }
        }

        return {
          title: 'DHARMA: SWARAJ YUG',
          subtitle: 'The Indian Freedom Struggle (1857–1947)',
          tagline: 'Vanguard Freedom Fighters, Defiance, Satyagraha & Unity',
          rulersLabel: 'The Freedom Vanguards',
          accent: 'from-orange-400 via-amber-300 to-emerald-400',
          badgeBg: 'bg-orange-800 text-orange-100',
          data: cardsSwaraj,
          specialList: uniqueSpecials
        };
      }
      case 'mahabharat':
      default:
        return {
          title: 'DHARMA: MAHABHARATA',
          subtitle: 'The Epic Chronicles of Kurukshetra (Dvapara Yuga)',
          tagline: 'Pandavas, Kauravas, Divine Astras & Sacred Rajadharma',
          rulersLabel: 'The 9 Epic Figures',
          accent: 'from-amber-300 via-yellow-200 to-indigo-300',
          badgeBg: 'bg-indigo-900 text-indigo-100',
          data: cardsMahabharat,
          specialList: cardsMahabharat.specialCards || []
        };
    }
  };

  const currentDataset = getEraDataset();

  return (
    <div
      id="chronicle-rules-modal"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[88vh] bg-[#0E1520] border-2 border-amber-400/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold">
                Authoritative Historical Codex
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">
                {currentDataset.title}
              </h2>
              <p className="text-[11px] text-slate-300 -mt-0.5">{currentDataset.subtitle}</p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 hover:text-white transition flex items-center justify-center font-bold text-sm cursor-pointer shadow"
            >
              ✕
            </button>
          </div>

          {/* Era Switcher Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-white/5">
            <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 px-2">Era:</span>
              <button
                onClick={() => setActiveEraTab('mughal')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEraTab === 'mughal'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                👑 Mughal Yugam
              </button>
              <button
                onClick={() => setActiveEraTab('swaraj')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEraTab === 'swaraj'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                🇮🇳 Swaraj Yug
              </button>
              <button
                onClick={() => setActiveEraTab('mahabharat')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeEraTab === 'mahabharat'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                🕉️ Mahabharata
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'rules'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                CLeMaR Rules
              </button>
              <button
                onClick={() => setActiveTab('rulers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'rulers'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {currentDataset.rulersLabel}
              </button>
              <button
                onClick={() => setActiveTab('cards')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'cards'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                Special & Rivals
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'rules' && (
            <div className="space-y-6 text-sm">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="font-bold text-base text-amber-300 mb-2">
                  The CLeMaR Connection Architecture
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Each turn, players connect a card to one of the <strong>last two cards</strong> played in the dynastic chain. Match either by <strong>Same Ruler/Figure</strong>, <strong>Same Category</strong>, or <strong>Direct Immediate Kinship/Succession</strong>.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center mb-1">
                      C
                    </span>
                    <h4 className="font-bold text-xs text-amber-200">Creator (Sovereign / Vanguard)</h4>
                    <span className="text-amber-400 font-bold text-xs block mt-1">+8 Points</span>
                    <p className="text-[10.5px] text-slate-300 mt-1">
                      Foundational historical figure. Matches by Leader, Category (C-to-C), or lineage opening.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-400/30">
                    <span className="w-6 h-6 rounded-full bg-purple-400 text-slate-950 text-xs font-black flex items-center justify-center mb-1">
                      L
                    </span>
                    <h4 className="font-bold text-xs text-purple-200">Law / Movement (Dharma)</h4>
                    <span className="text-purple-300 font-bold text-xs block mt-1">+6 Points</span>
                    <p className="text-[10.5px] text-slate-300 mt-1">
                      Principles, decrees, vows or historical uprisings. Connects to matching Leader or L card.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-400/30">
                    <span className="w-6 h-6 rounded-full bg-sky-400 text-slate-950 text-xs font-black flex items-center justify-center mb-1">
                      M
                    </span>
                    <h4 className="font-bold text-xs text-sky-200">Marvel (Artifacts & Wonders)</h4>
                    <span className="text-sky-300 font-bold text-xs block mt-1">+4 Points</span>
                    <p className="text-[10.5px] text-slate-300 mt-1">
                      Monuments, divine astras, weapons, or inventions. Connects to matching Leader or M card.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30">
                    <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center mb-1">
                      R
                    </span>
                    <h4 className="font-bold text-xs text-emerald-200">Region (Subah / Sacred Lands)</h4>
                    <span className="text-emerald-300 font-bold text-xs block mt-1">+2 Points</span>
                    <p className="text-[10.5px] text-slate-300 mt-1">
                      Historical territories, ashrams, forts, or capitals. Connects to matching Leader or R card.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-sm text-amber-300 mb-2">
                    Scoring & The Imperial Pot
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-300 list-disc pl-4">
                    <li>
                      <strong>Card Points:</strong> Sum of all legal CLeMaR card points played into the chain.
                    </li>
                    <li>
                      <strong>The Pot:</strong> Every CLeMaR card adds its points directly to the center Pot.
                    </li>
                    <li>
                      <strong>Draw Penalties:</strong> Each drawn card from the draw pile inflicts a <strong>-1 point penalty</strong>.
                    </li>
                    <li>
                      <strong>Net Score Formula:</strong> <code>Card Points + Stolen Points - Draw Penalties</code>.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-sm text-amber-300 mb-2">
                    Endgame & Authoritative Tie-Breakers
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-300 list-disc pl-4">
                    <li>
                      <strong>Winning Condition 1:</strong> A player empties their hand completely ("DHARMA!").
                    </li>
                    <li>
                      <strong>Winning Condition 2:</strong> Draw pile exhausted & max rounds concluded.
                    </li>
                    <li>
                      <strong>Tie-Breaker 1:</strong> Fewest cards remaining in hand.
                    </li>
                    <li>
                      <strong>Tie-Breaker 2:</strong> Most successful Rival steals.
                    </li>
                    <li>
                      <strong>Tie-Breaker 3:</strong> Highest single-card value in the final chain.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rulers' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                The authoritative figures anchoring this historical deck. Each figure anchors a complete 4-card CLeMaR set:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {((currentDataset.data as any).rulers || []).map((r: any) => (
                  <div
                    key={r.id}
                    className="p-3.5 bg-white/5 rounded-2xl border border-white/10 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-amber-200">{r.name}</h4>
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                        {r.reign || r.era || 'Historical Era'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {r.historicalNarrative || r.kinship || 'Foundational dynastic leader.'}
                    </p>
                    {r.cards && (
                      <div className="mt-2 text-[10px] space-y-0.5 text-slate-400 border-t border-white/10 pt-1.5">
                        <div><strong>L:</strong> {r.cards.L?.name}</div>
                        <div><strong>M:</strong> {r.cards.M?.name}</div>
                        <div><strong>R:</strong> {r.cards.R?.name}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Special action cards, crises, and legendary Wild Rivals specific to {currentDataset.title}:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentDataset.specialList.map((sc: any, idx: number) => (
                  <div
                    key={sc.id || idx}
                    className="p-3.5 bg-white/5 rounded-2xl border border-white/10 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-sm text-amber-200">{sc.name}</h4>
                      <span className="text-[10px] bg-rose-600/80 text-white font-bold px-2 py-0.5 rounded-full">
                        {sc.category || sc.type?.toUpperCase()} {sc.count ? `(${sc.count}x)` : ''}
                      </span>
                    </div>
                    <p className="text-xs text-amber-400 font-bold">
                      {(sc.effect || sc.type || '').replace(/_/g, ' ')}
                    </p>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                      {sc.historicalContext || sc.historicalDetail || sc.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
