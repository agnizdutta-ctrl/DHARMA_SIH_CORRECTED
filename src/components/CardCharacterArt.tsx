/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CardData, PlayedCard } from '../../engine/types';
import { EraId } from '../types/era';

interface CardCharacterArtProps {
  card: CardData | PlayedCard;
  era?: EraId;
  isHovered?: boolean;
  isSelected?: boolean;
  isWildDramatic?: boolean;
}

export const CardCharacterArt: React.FC<CardCharacterArtProps> = ({
  card,
  era,
  isHovered = false,
  isSelected = false,
  isWildDramatic = false
}) => {
  const isRival = card.type === 'rival' || card.variant === 'rival';
  const isAadesh = card.type === 'aadesh' || card.variant === 'aadesh' || card.name.toLowerCase().includes('aadesh');
  const isMouna = card.type === 'mouna' || card.variant === 'mouna';
  const isChakra = card.type === 'chakravyuha' || card.variant === 'chakra';
  const isCrisis = card.type === 'crisis' || card.variant === 'crisis';

  const category = card.category;
  const cardNameLower = card.name.toLowerCase();
  const rulerNameLower = (card.ruler || card.rulerName || '').toLowerCase();
  const rulerIdLower = (card.rulerId || '').toLowerCase();

  // Detect Era from prop or heuristics
  const detectedEra: EraId = era || (() => {
    if (
      rulerIdLower.includes('babur') ||
      rulerIdLower.includes('humayun') ||
      rulerIdLower.includes('akbar') ||
      rulerIdLower.includes('jahangir') ||
      rulerIdLower.includes('shah_jahan') ||
      rulerIdLower.includes('aurangzeb') ||
      rulerIdLower.includes('muhammad_shah') ||
      rulerIdLower.includes('bahadur_shah') ||
      cardNameLower.includes('babur') ||
      cardNameLower.includes('humayun') ||
      cardNameLower.includes('akbar') ||
      cardNameLower.includes('jahangir') ||
      cardNameLower.includes('shah jahan') ||
      cardNameLower.includes('aurangzeb') ||
      cardNameLower.includes('taj mahal') ||
      cardNameLower.includes('peacock throne') ||
      cardNameLower.includes('mansabdari') ||
      cardNameLower.includes('tulughma') ||
      cardNameLower.includes('pratap') ||
      cardNameLower.includes('sher shah') ||
      cardNameLower.includes('nadir shah')
    ) {
      return 'mughal';
    }

    if (
      rulerIdLower.includes('mangal') ||
      rulerIdLower.includes('jhansi') ||
      rulerIdLower.includes('lakshmibai') ||
      rulerIdLower.includes('tilak') ||
      rulerIdLower.includes('subhas') ||
      rulerIdLower.includes('bose') ||
      rulerIdLower.includes('bhagat') ||
      rulerIdLower.includes('gandhi') ||
      cardNameLower.includes('mangal') ||
      cardNameLower.includes('jhansi') ||
      cardNameLower.includes('lakshmibai') ||
      cardNameLower.includes('tilak') ||
      cardNameLower.includes('subhas') ||
      cardNameLower.includes('bhagat') ||
      cardNameLower.includes('gandhi') ||
      cardNameLower.includes('charkha') ||
      cardNameLower.includes('ina') ||
      cardNameLower.includes('dandi') ||
      cardNameLower.includes('barrackpore') ||
      cardNameLower.includes('inquilab') ||
      cardNameLower.includes('rowlatt') ||
      cardNameLower.includes('jallianwala') ||
      cardNameLower.includes('mountbatten') ||
      cardNameLower.includes('godse')
    ) {
      return 'swaraj';
    }

    return 'mahabharat';
  })();

  // Determine era-specific card archetype
  const getCharacterArchetype = (): string => {
    // ========================================================
    // 1. MUGHAL ERA ARCHETYPES
    // ========================================================
    if (detectedEra === 'mughal') {
      if (isRival) {
        if (cardNameLower.includes('pratap') || card.id.includes('sp1a') || card.id.includes('sp1b')) return 'mughal_rival_pratap';
        return 'mughal_rival_shershah';
      }
      if (isAadesh) return 'mughal_aadesh_farman';
      if (isMouna) return 'mughal_mouna_decree';
      if (isChakra) return 'mughal_chakra_flank';
      if (isCrisis) {
        if (cardNameLower.includes('nadir') || cardNameLower.includes('sack')) return 'mughal_crisis_nadir';
        return 'mughal_crisis_famine';
      }
      if (category === 'C') {
        if (rulerIdLower.includes('babur') || cardNameLower.includes('babur')) return 'mughal_creator_babur';
        if (rulerIdLower.includes('humayun') || cardNameLower.includes('humayun')) return 'mughal_creator_humayun';
        if (rulerIdLower.includes('akbar') || cardNameLower.includes('akbar')) return 'mughal_creator_akbar';
        if (rulerIdLower.includes('jahangir') || cardNameLower.includes('jahangir')) return 'mughal_creator_jahangir';
        if (rulerIdLower.includes('shah_jahan') || cardNameLower.includes('shah jahan')) return 'mughal_creator_shahjahan';
        if (rulerIdLower.includes('aurangzeb') || cardNameLower.includes('aurangzeb')) return 'mughal_creator_aurangzeb';
        return 'mughal_creator_akbar';
      }
      if (category === 'L' || category === 'Le') {
        if (cardNameLower.includes('artillery') || cardNameLower.includes('tulughma')) return 'mughal_law_matchlock';
        if (cardNameLower.includes('mansabdari')) return 'mughal_law_mansabdari';
        if (cardNameLower.includes('justice') || cardNameLower.includes('chain')) return 'mughal_law_justice';
        return 'mughal_law_general';
      }
      if (category === 'M' || category === 'Ma') {
        if (cardNameLower.includes('taj') || cardNameLower.includes('mahal')) return 'mughal_marvel_tajmahal';
        if (cardNameLower.includes('peacock') || cardNameLower.includes('throne')) return 'mughal_marvel_peacock';
        if (cardNameLower.includes('red fort') || cardNameLower.includes('sikri') || cardNameLower.includes('dinpanah')) return 'mughal_marvel_redfort';
        return 'mughal_marvel_gardens';
      }
      if (category === 'R') {
        if (cardNameLower.includes('delhi') || cardNameLower.includes('shahjahanabad')) return 'mughal_region_delhi';
        if (cardNameLower.includes('agra') || cardNameLower.includes('akbarabad')) return 'mughal_region_agra';
        if (cardNameLower.includes('panipat') || cardNameLower.includes('kabul') || cardNameLower.includes('ferghana')) return 'mughal_region_panipat';
        if (cardNameLower.includes('lahore')) return 'mughal_region_lahore';
        return 'mughal_region_deccan';
      }
      return 'mughal_creator_akbar';
    }

    // ========================================================
    // 2. SWARAJ ERA ARCHETYPES
    // ========================================================
    if (detectedEra === 'swaraj') {
      if (isRival) {
        if (cardNameLower.includes('godse') || card.id.includes('sp1a') || card.id.includes('sp1b')) return 'swaraj_rival_godse';
        return 'swaraj_rival_mountbatten';
      }
      if (isAadesh) return 'swaraj_aadesh_do_or_die';
      if (isMouna) return 'swaraj_mouna_rowlatt';
      if (isChakra) return 'swaraj_chakra_shift';
      if (isCrisis) {
        if (cardNameLower.includes('jallianwala')) return 'swaraj_crisis_jallianwala';
        return 'swaraj_crisis_salt';
      }
      if (category === 'C') {
        if (rulerIdLower.includes('mangal') || cardNameLower.includes('mangal')) return 'swaraj_creator_mangal';
        if (rulerIdLower.includes('jhansi') || rulerIdLower.includes('lakshmibai') || cardNameLower.includes('lakshmibai')) return 'swaraj_creator_lakshmibai';
        if (rulerIdLower.includes('tilak') || cardNameLower.includes('tilak')) return 'swaraj_creator_tilak';
        if (rulerIdLower.includes('subhas') || rulerIdLower.includes('bose') || cardNameLower.includes('subhas')) return 'swaraj_creator_subhas';
        if (rulerIdLower.includes('bhagat') || cardNameLower.includes('bhagat')) return 'swaraj_creator_bhagat';
        if (rulerIdLower.includes('gandhi') || cardNameLower.includes('gandhi')) return 'swaraj_creator_gandhi';
        return 'swaraj_creator_subhas';
      }
      if (category === 'L' || category === 'Le') {
        if (cardNameLower.includes('barrackpore') || cardNameLower.includes('uprising')) return 'swaraj_law_uprising';
        if (cardNameLower.includes('defence') || cardNameLower.includes('revolt of jhansi')) return 'swaraj_law_jhansi';
        if (cardNameLower.includes('swadeshi') || cardNameLower.includes('maratha')) return 'swaraj_law_swadeshi';
        if (cardNameLower.includes('dandi') || cardNameLower.includes('salt march')) return 'swaraj_law_dandi';
        if (cardNameLower.includes('ina') || cardNameLower.includes('fauj')) return 'swaraj_law_ina';
        return 'swaraj_law_inquilab';
      }
      if (category === 'M' || category === 'Ma') {
        if (cardNameLower.includes('charkha') || cardNameLower.includes('spinning')) return 'swaraj_marvel_charkha';
        if (cardNameLower.includes('sword') || cardNameLower.includes('ina')) return 'swaraj_marvel_ina_sword';
        if (cardNameLower.includes('kesari') || cardNameLower.includes('press')) return 'swaraj_marvel_kesari';
        if (cardNameLower.includes('pamphlet') || cardNameLower.includes('assembly')) return 'swaraj_marvel_pamphlet';
        return 'swaraj_marvel_salt';
      }
      if (category === 'R') {
        if (cardNameLower.includes('barrackpore')) return 'swaraj_region_barrackpore';
        if (cardNameLower.includes('jhansi')) return 'swaraj_region_jhansi';
        if (cardNameLower.includes('pune')) return 'swaraj_region_pune';
        if (cardNameLower.includes('singapore') || cardNameLower.includes('burma')) return 'swaraj_region_singapore';
        if (cardNameLower.includes('lahore')) return 'swaraj_region_lahore';
        return 'swaraj_region_sabarmati';
      }
      return 'swaraj_creator_subhas';
    }

    // ========================================================
    // 3. MAHABHARATA ERA ARCHETYPES (Default)
    // ========================================================
    if (isRival) {
      if (cardNameLower.includes('shakuni') || card.id.startsWith('sp1a') || card.id.startsWith('sp1b')) return 'rival_shakuni';
      return 'rival_ashwatthama';
    }
    if (isAadesh) return 'aadesh_krishna';
    if (isMouna) return 'mouna_vrat';
    if (isChakra) return 'chakra_chakravyuha';
    if (isCrisis) {
      if (cardNameLower.includes('kurukshetra') || card.effect === 'force_marvel' || card.id.startsWith('sp5c') || card.id.startsWith('sp5d')) {
        return 'crisis_kurukshetra';
      }
      return 'crisis_lakshagriha';
    }
    if (category === 'C') {
      if (cardNameLower.includes('krishna') || rulerNameLower === 'krishna') return 'creator_krishna';
      if (cardNameLower.includes('yudhishthira') || rulerNameLower === 'yudhishthira') return 'creator_yudhishthira';
      if (cardNameLower.includes('bhima') || rulerNameLower === 'bhima') return 'creator_bhima';
      if (cardNameLower.includes('arjuna') || rulerNameLower === 'arjuna') return 'creator_arjuna';
      if (cardNameLower.includes('karna') || rulerNameLower === 'karna') return 'creator_karna';
      if (cardNameLower.includes('bhishma') || rulerNameLower === 'bhishma') return 'creator_bhishma';
      if (cardNameLower.includes('dronacharya') || rulerNameLower === 'dronacharya') return 'creator_dronacharya';
      if (cardNameLower.includes('duryodhana') || rulerNameLower === 'duryodhana') return 'creator_duryodhana';
      if (cardNameLower.includes('draupadi') || rulerNameLower === 'draupadi') return 'creator_draupadi';
      return 'creator_krishna';
    }
    if (category === 'L' || category === 'Le') {
      if (cardNameLower.includes('counsel') || rulerNameLower === 'krishna') return 'dharma_krishna';
      if (cardNameLower.includes('rajadharma') || rulerNameLower === 'yudhishthira') return 'dharma_yudhishthira';
      if (cardNameLower.includes("bhima's vow") || cardNameLower.includes('vow — bhima') || rulerNameLower === 'bhima') return 'dharma_bhima';
      if (cardNameLower.includes('duty') || rulerNameLower === 'arjuna') return 'dharma_arjuna';
      if (cardNameLower.includes('charity') || rulerNameLower === 'karna') return 'dharma_karna';
      if (cardNameLower.includes("bhishma's vow") || cardNameLower.includes('vow — bhishma')) return 'dharma_bhishma';
      if (cardNameLower.includes('guru') || cardNameLower.includes('dakshina') || rulerNameLower === 'dronacharya') return 'dharma_dronacharya';
      if (cardNameLower.includes('question') || cardNameLower.includes('sabha') || rulerNameLower === 'draupadi') return 'dharma_draupadi';
      return 'dharma_yudhishthira';
    }
    if (category === 'M' || category === 'Ma') {
      if (cardNameLower.includes('gandiva')) return 'marvel_gandiva';
      if (cardNameLower.includes('brahmastra')) return 'marvel_brahmastra';
      if (cardNameLower.includes('sudarshana')) return 'marvel_sudarshana';
      if (cardNameLower.includes('kaumodaki') || cardNameLower.includes('gada')) return 'marvel_kaumodaki';
      if (cardNameLower.includes('pashupatastra')) return 'marvel_pashupatastra';
      if (cardNameLower.includes('akshaya')) return 'marvel_akshaya';
      if (cardNameLower.includes('mayasabha')) return 'marvel_mayasabha';
      return 'marvel_sudarshana';
    }
    if (category === 'R') {
      if (cardNameLower.includes('hastinapura')) return 'region_hastinapura';
      if (cardNameLower.includes('indraprastha')) return 'region_indraprastha';
      if (cardNameLower.includes('kurukshetra')) return 'region_kurukshetra';
      if (cardNameLower.includes('panchala')) return 'region_panchala';
      if (cardNameLower.includes('matsya')) return 'region_matsya';
      if (cardNameLower.includes('dwaraka')) return 'region_dwaraka';
      return 'region_hastinapura';
    }

    return 'creator_krishna';
  };

  const archetype = getCharacterArchetype();

  const breathClass = isWildDramatic ? 'animate-wild-surge' : isSelected ? 'animate-character-focus' : 'animate-character-breathe';
  const auraGlow = isWildDramatic
    ? 'drop-shadow-[0_0_24px_rgba(244,208,63,0.9)] filter brightness-125'
    : isSelected
    ? 'drop-shadow-[0_0_12px_rgba(244,208,63,0.7)]'
    : isHovered
    ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]'
    : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]';

  // Era theme background colors
  const getGradientColors = () => {
    if (detectedEra === 'mughal') {
      if (isRival) return ['#4A0A10', '#250508', '#0F0203'];
      if (isAadesh) return ['#2E1A47', '#170B24', '#08030C'];
      if (isMouna) return ['#1A2E26', '#0C1713', '#050A08'];
      if (category === 'C') return ['#0A2E1F', '#051810', '#020A06'];
      if (category === 'L' || category === 'Le') return ['#3A240A', '#1E1204', '#0D0701'];
      if (category === 'M' || category === 'Ma') return ['#0D2F3F', '#061720', '#020A0E'];
      return ['#1F2B1A', '#0F160C', '#050804'];
    }
    if (detectedEra === 'swaraj') {
      if (isRival) return ['#4A1208', '#260904', '#100301'];
      if (isAadesh) return ['#4A2E08', '#261704', '#100A01'];
      if (isMouna) return ['#1E293B', '#0F172A', '#060910'];
      if (category === 'C') return ['#431E05', '#241002', '#0F0601'];
      if (category === 'L' || category === 'Le') return ['#0E3326', '#071A13', '#030B08'];
      if (category === 'M' || category === 'Ma') return ['#162B4E', '#0B1627', '#040810'];
      return ['#2C220E', '#161107', '#080602'];
    }
    // Mahabharat
    if (isRival) return ['#4A0E17', '#2A080C', '#120305'];
    if (isAadesh) return ['#3B1452', '#200B2E', '#0B0310'];
    if (isMouna) return ['#2C3E50', '#1A252F', '#0E141A'];
    if (category === 'C') return ['#2E2407', '#1A1504', '#0A0802'];
    if (category === 'L' || category === 'Le') return ['#2B1038', '#170720', '#0A020E'];
    if (category === 'M' || category === 'Ma') return ['#0E2F44', '#071926', '#030C12'];
    return ['#0D351E', '#071E11', '#030E08'];
  };

  const gradColors = getGradientColors();

  return (
    <div
      id={`card-art-${card.id}`}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none pointer-events-none"
    >
      {/* 1. LAYER 1: Thematic Background Vignette */}
      <div className="absolute inset-0 bg-radial-gradient flex items-center justify-center opacity-90">
        <svg
          viewBox="0 0 100 65"
          className="w-full h-full absolute inset-0 preserve-3d"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`bg-grad-${card.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={gradColors[0]} />
              <stop offset="60%" stopColor={gradColors[1]} />
              <stop offset="100%" stopColor={gradColors[2]} />
            </linearGradient>

            <radialGradient id={`sunburst-${card.id}`} cx="50%" cy="30%" r="50%">
              <stop
                offset="0%"
                stopColor={detectedEra === 'mughal' ? '#10B981' : detectedEra === 'swaraj' ? '#F97316' : '#D4AF37'}
                stopOpacity={isHovered || isSelected ? '0.45' : '0.22'}
              />
              <stop offset="65%" stopColor="#F4D03F" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Canvas Background */}
          <rect width="100" height="65" fill={`url(#bg-grad-${card.id})`} />
          <circle cx="50" cy="30" r="38" fill={`url(#sunburst-${card.id})`} className="animate-pulse" />

          {/* Era Architectural Arch Pattern */}
          {detectedEra === 'mughal' ? (
            // Mughal Multi-foil Cusped Arch
            <path
              d="M 16,65 L 16,30 Q 20,20 30,16 Q 40,12 50,4 Q 60,12 70,16 Q 80,20 84,30 L 84,65"
              fill="none"
              stroke="#10B981"
              strokeWidth="0.8"
              strokeDasharray="2,2"
              opacity="0.4"
            />
          ) : detectedEra === 'swaraj' ? (
            // Swaraj 24-spoke Ashoka / Sun motif arch
            <path
              d="M 16,65 L 16,28 C 16,12 30,6 50,6 C 70,6 84,12 84,28 L 84,65"
              fill="none"
              stroke="#F97316"
              strokeWidth="0.8"
              strokeDasharray="3,2"
              opacity="0.4"
            />
          ) : (
            // Vedic Prabhavali Arch
            <path
              d="M 14,65 L 14,28 C 14,10 32,5 50,2 C 68,5 86,10 86,28 L 86,65"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.8"
              strokeDasharray="3,2"
              opacity="0.35"
            />
          )}
        </svg>
      </div>

      {/* 2. LAYER 2: Floating Thematic Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute w-1.5 h-1.5 rounded-full blur-[0.5px] top-2 left-6 ${
            detectedEra === 'mughal' ? 'bg-emerald-300' : detectedEra === 'swaraj' ? 'bg-orange-300' : 'bg-amber-300'
          }`}
        />
        <div
          className={`absolute w-1 h-1 rounded-full bottom-3 right-6 ${
            detectedEra === 'mughal' ? 'bg-amber-300' : detectedEra === 'swaraj' ? 'bg-emerald-300' : 'bg-yellow-200'
          }`}
        />
      </div>

      {/* 3. LAYER 3: Dedicated Era Visual Archetype */}
      <div className={`relative z-10 w-full h-full flex items-center justify-center ${breathClass} ${auraGlow}`}>
        <svg viewBox="0 0 100 65" className="w-full h-full preserve-3d" xmlns="http://www.w3.org/2000/svg">
          {/* ========================================================
              MUGHAL ARCHETYPES
             ======================================================== */}
          {archetype === 'mughal_creator_babur' && (
            <g id="mughal-babur">
              <ellipse cx="50" cy="27" rx="8" ry="9" fill="#F4D03F" opacity="0.9" />
              {/* Central Asian Chughtai Turban with plume */}
              <ellipse cx="50" cy="21" rx="9" ry="4.5" fill="#10B981" />
              <path d="M 50,17 Q 54,10 50,6" stroke="#D4AF37" strokeWidth="1.5" fill="none" />
              {/* Robe and Matchlock Artillery Cannon */}
              <path d="M 38,58 L 44,36 L 56,36 L 62,58 Z" fill="#0A2E1F" stroke="#D4AF37" strokeWidth="1" />
              <line x1="30" y1="52" x2="70" y2="42" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
              <circle cx="28" cy="53" r="4" fill="#92400E" stroke="#F59E0B" strokeWidth="1" />
            </g>
          )}

          {archetype === 'mughal_creator_akbar' && (
            <g id="mughal-akbar">
              {/* Radiant Navaratna Solar Halo */}
              <circle cx="50" cy="25" r="18" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3,2" />
              <circle cx="50" cy="25" r="14" fill="#F59E0B" opacity="0.2" />
              <ellipse cx="50" cy="26" rx="8.5" ry="9.5" fill="#F4D03F" />
              {/* Imperial Padishah Diadem & Pearl Plume */}
              <polygon points="42,20 50,14 58,20" fill="#10B981" stroke="#D4AF37" strokeWidth="0.8" />
              <circle cx="50" cy="14" r="2" fill="#EF4444" />
              {/* Imperial Angarkha Robe with Golden Sash */}
              <path d="M 37,58 L 43,35 L 57,35 L 63,58 Z" fill="#064E3B" stroke="#D4AF37" strokeWidth="1.2" />
              <line x1="43" y1="46" x2="57" y2="46" stroke="#F59E0B" strokeWidth="2" />
              {/* Royal Hunting Falcon on fist */}
              <circle cx="66" cy="40" r="3" fill="#D97706" />
              <path d="M 66,40 L 72,46 L 68,48 Z" fill="#92400E" />
            </g>
          )}

          {archetype === 'mughal_creator_shahjahan' && (
            <g id="mughal-shahjahan">
              {/* Marble Arch Silhouette behind Padishah */}
              <path d="M 34,58 L 34,22 Q 50,8 66,22 L 66,58" fill="none" stroke="#E2E8F0" strokeWidth="1.5" opacity="0.6" />
              <ellipse cx="50" cy="26" rx="8" ry="9" fill="#F4D03F" />
              {/* Pearl-encrusted Crown */}
              <path d="M 43,20 Q 50,14 57,20" fill="#D4AF37" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="50" cy="16" r="2" fill="#3B82F6" />
              {/* White Silk Jama */}
              <path d="M 36,58 L 43,35 L 57,35 L 64,58 Z" fill="#1E293B" stroke="#E2E8F0" strokeWidth="1" />
              {/* Glowing Gem of the Taj */}
              <polygon points="50,44 53,49 50,54 47,49" fill="#38BDF8" className="animate-pulse" />
            </g>
          )}

          {archetype === 'mughal_creator_aurangzeb' && (
            <g id="mughal-aurangzeb">
              <ellipse cx="50" cy="25" rx="8" ry="9" fill="#FCD34D" />
              {/* Steel Mail Helmet & Prayer Cap */}
              <path d="M 42,21 Q 50,12 58,21 Z" fill="#475569" stroke="#CBD5E1" strokeWidth="1" />
              <path d="M 36,58 L 43,34 L 57,34 L 64,58 Z" fill="#0F172A" stroke="#94A3B8" strokeWidth="1.2" />
              {/* Alamgir Battle Sword */}
              <line x1="32" y1="58" x2="68" y2="38" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="32" cy="58" r="3" fill="#D4AF37" />
            </g>
          )}

          {archetype === 'mughal_rival_pratap' && (
            <g id="mughal-pratap">
              {/* Fierce Saffron Turban & War Lance of Mewar */}
              <circle cx="50" cy="25" r="16" fill="#7F1D1D" opacity="0.5" />
              <ellipse cx="50" cy="25" rx="8" ry="9" fill="#F97316" />
              <ellipse cx="50" cy="19" rx="10" ry="4" fill="#DC2626" />
              {/* Rajput Steel Cuirass & Tilak */}
              <path d="M 36,58 L 43,34 L 57,34 L 64,58 Z" fill="#450A0A" stroke="#F59E0B" strokeWidth="1.5" />
              <line x1="50" y1="21" x2="50" y2="27" stroke="#FEF08A" strokeWidth="1.2" />
              {/* Chetak's Warrior Spear */}
              <line x1="24" y1="60" x2="76" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              <polygon points="76,12 73,18 79,15" fill="#EF4444" />
            </g>
          )}

          {archetype === 'mughal_rival_shershah' && (
            <g id="mughal-shershah">
              <ellipse cx="50" cy="25" rx="8.5" ry="9" fill="#FBBF24" />
              <circle cx="50" cy="25" r="15" fill="#92400E" opacity="0.4" />
              {/* Silver Rupiya Coin & Afghan Armor */}
              <path d="M 36,58 L 43,34 L 57,34 L 64,58 Z" fill="#1C1917" stroke="#CBD5E1" strokeWidth="1.2" />
              <circle cx="50" cy="46" r="6" fill="#94A3B8" stroke="#F8FAFC" strokeWidth="1" />
              <text x="50" y="48" fontSize="4" textAnchor="middle" fill="#0F172A" fontWeight="bold">₨</text>
            </g>
          )}

          {archetype === 'mughal_marvel_tajmahal' && (
            <g id="mughal-tajmahal">
              {/* Central Symmetrical Dome */}
              <path d="M 40,36 C 40,24 50,14 50,14 C 50,14 60,24 60,36 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
              <rect x="36" y="36" width="28" height="22" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
              {/* Arched Portals */}
              <path d="M 44,58 L 44,44 Q 50,38 56,44 L 56,58 Z" fill="#0F172A" />
              {/* Twin Elegant Minarets */}
              <rect x="22" y="18" width="3" height="40" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
              <rect x="75" y="18" width="3" height="40" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.5" />
              <polygon points="21,18 23.5,13 26,18" fill="#F8FAFC" />
              <polygon points="74,18 76.5,13 79,18" fill="#F8FAFC" />
            </g>
          )}

          {archetype === 'mughal_marvel_peacock' && (
            <g id="mughal-peacock">
              {/* Fan of Emerald Peacock Feathers */}
              <path d="M 50,46 Q 30,22 50,12 Q 70,22 50,46 Z" fill="#047857" opacity="0.8" />
              <circle cx="50" cy="20" r="4" fill="#0284C7" />
              <circle cx="42" cy="24" r="3.5" fill="#0284C7" />
              <circle cx="58" cy="24" r="3.5" fill="#0284C7" />
              {/* Koh-i-Noor Diamond Starburst */}
              <polygon points="50,42 54,46 50,50 46,46" fill="#38BDF8" className="animate-pulse" />
              <rect x="36" y="50" width="28" height="8" fill="#D97706" stroke="#FDE047" strokeWidth="1" />
            </g>
          )}

          {archetype === 'mughal_aadesh_farman' && (
            <g id="mughal-farman">
              {/* Golden Farman Scroll with Imperial Tughra */}
              <rect x="32" y="14" width="36" height="40" rx="3" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
              <line x1="38" y1="22" x2="62" y2="22" stroke="#92400E" strokeWidth="1" />
              <line x1="38" y1="28" x2="62" y2="28" stroke="#92400E" strokeWidth="1" />
              <line x1="38" y1="34" x2="56" y2="34" stroke="#92400E" strokeWidth="1" />
              {/* Imperial Red Wax Seal */}
              <circle cx="50" cy="44" r="6" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1" />
              <circle cx="50" cy="44" r="3.5" fill="#EF4444" />
            </g>
          )}

          {/* ========================================================
              SWARAJ ARCHETYPES
             ======================================================== */}
          {archetype === 'swaraj_creator_subhas' && (
            <g id="swaraj-subhas">
              {/* Netaji Military Cap & Round Wire Spectacles */}
              <ellipse cx="50" cy="26" rx="8" ry="9" fill="#FED7AA" />
              {/* Azad Hind Fauj Field Cap */}
              <path d="M 40,21 L 50,14 L 60,21 L 63,22 L 37,22 Z" fill="#365314" stroke="#65A30D" strokeWidth="1" />
              <rect x="38" y="21" width="24" height="2.5" fill="#14532D" />
              {/* Wire Spectacles */}
              <circle cx="46" cy="25" r="2.5" fill="none" stroke="#D97706" strokeWidth="0.8" />
              <circle cx="54" cy="25" r="2.5" fill="none" stroke="#D97706" strokeWidth="0.8" />
              <line x1="48.5" y1="25" x2="51.5" y2="25" stroke="#D97706" strokeWidth="0.8" />
              {/* Military Tunic with Shoulder Epaulets */}
              <path d="M 36,58 L 43,35 L 57,35 L 64,58 Z" fill="#1E3A18" stroke="#84CC16" strokeWidth="1.2" />
              <rect x="40" y="35" width="6" height="2" fill="#EAB308" />
              <rect x="54" y="35" width="6" height="2" fill="#EAB308" />
              {/* Roaring Tiger Emblem / Flag */}
              <circle cx="50" cy="46" r="5" fill="#EA580C" />
              <text x="50" y="48" fontSize="4" textAnchor="middle" fill="#FFFFFF" fontWeight="black">INA</text>
            </g>
          )}

          {archetype === 'swaraj_creator_lakshmibai' && (
            <g id="swaraj-lakshmibai">
              {/* The Fearless Queen of Jhansi with Raised Talwar */}
              <circle cx="50" cy="25" r="16" fill="#C2410C" opacity="0.4" />
              <ellipse cx="50" cy="25" rx="7.5" ry="8.5" fill="#FED7AA" />
              {/* Maratha Battle Turban / Nauvari Dupatta */}
              <path d="M 42,20 Q 50,12 58,20" fill="#EA580C" stroke="#F97316" strokeWidth="1" />
              {/* Raised Curved Talwar */}
              <path d="M 64,36 Q 78,16 68,8" fill="none" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="64" cy="36" r="2.5" fill="#D97706" />
              {/* Round Steel Dhal Shield */}
              <circle cx="36" cy="40" r="9" fill="#334155" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="36" cy="40" r="2.5" fill="#F59E0B" />
              {/* Warrior Tunic */}
              <path d="M 42,58 L 45,34 L 55,34 L 58,58 Z" fill="#9A3412" stroke="#FDBA74" strokeWidth="1" />
            </g>
          )}

          {archetype === 'swaraj_creator_bhagat' && (
            <g id="swaraj-bhagat">
              {/* The Iconic Fedora & Yellow Basanti Scarf */}
              <ellipse cx="50" cy="27" rx="8" ry="9" fill="#FED7AA" />
              {/* Dark Western Fedora Hat */}
              <ellipse cx="50" cy="21" rx="14" ry="3.5" fill="#1E293B" />
              <path d="M 42,21 Q 50,12 58,21 Z" fill="#0F172A" />
              {/* Resolute Moustache */}
              <path d="M 46,29 Q 50,30 54,29" stroke="#0F172A" strokeWidth="1.2" fill="none" />
              {/* Basanti Yellow Scarf & Coat */}
              <path d="M 38,58 L 44,36 L 56,36 L 62,58 Z" fill="#1E293B" stroke="#E2E8F0" strokeWidth="1" />
              <path d="M 44,36 L 50,48 L 56,36 Z" fill="#EAB308" />
            </g>
          )}

          {archetype === 'swaraj_creator_gandhi' && (
            <g id="swaraj-gandhi">
              {/* Round Spectacles, Khadi Shawl, Dandi Walking Staff */}
              <ellipse cx="50" cy="26" rx="8" ry="9" fill="#FED7AA" />
              <circle cx="46" cy="25" r="2.5" fill="none" stroke="#0F172A" strokeWidth="0.8" />
              <circle cx="54" cy="25" r="2.5" fill="none" stroke="#0F172A" strokeWidth="0.8" />
              <line x1="48.5" y1="25" x2="51.5" y2="25" stroke="#0F172A" strokeWidth="0.8" />
              {/* White Khadi Wrap */}
              <path d="M 38,58 L 44,35 L 56,35 L 62,58 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              {/* Bamboo Walking Staff */}
              <line x1="32" y1="12" x2="32" y2="60" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {archetype === 'swaraj_creator_mangal' && (
            <g id="swaraj-mangal">
              {/* 1857 Sepoy Uniform & Enfield Musket */}
              <ellipse cx="50" cy="25" rx="8" ry="9" fill="#FED7AA" />
              {/* British Indian Army Redcoat Sepoy Jacket */}
              <path d="M 37,58 L 43,34 L 57,34 L 63,58 Z" fill="#991B1B" stroke="#FDE047" strokeWidth="1.2" />
              <line x1="43" y1="34" x2="57" y2="58" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="57" y1="34" x2="43" y2="58" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Flaming Torch of Rebellion */}
              <line x1="68" y1="34" x2="68" y2="54" stroke="#78350F" strokeWidth="2" />
              <polygon points="68,26 64,34 72,34" fill="#EA580C" className="animate-pulse" />
              <circle cx="68" cy="28" r="2" fill="#FDE047" />
            </g>
          )}

          {archetype === 'swaraj_creator_tilak' && (
            <g id="swaraj-tilak">
              {/* Red Pagadi Turban & Kesari Quill */}
              <ellipse cx="50" cy="26" rx="8" ry="9" fill="#FED7AA" />
              {/* Traditional Red Puneri Pagadi */}
              <path d="M 40,21 Q 50,11 60,21 L 62,23 L 38,23 Z" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1" />
              {/* White Angavastram */}
              <path d="M 37,58 L 44,35 L 56,35 L 63,58 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
              <path d="M 44,35 L 50,46 L 56,35 Z" fill="#EA580C" />
            </g>
          )}

          {archetype === 'swaraj_rival_mountbatten' && (
            <g id="swaraj-mountbatten">
              <circle cx="50" cy="25" r="16" fill="#1E3A8A" opacity="0.4" />
              <ellipse cx="50" cy="26" rx="8" ry="9" fill="#FED7AA" />
              {/* British Viceroy Bicorne Cocked Hat with Plume */}
              <path d="M 36,22 Q 50,14 64,22 L 50,16 Z" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="50" y1="14" x2="50" y2="8" stroke="#FDE047" strokeWidth="1.5" />
              {/* Navy Uniform with Medals */}
              <path d="M 37,58 L 43,35 L 57,35 L 63,58 Z" fill="#172554" stroke="#FDE047" strokeWidth="1.2" />
              <circle cx="46" cy="42" r="1.5" fill="#EF4444" />
              <circle cx="50" cy="42" r="1.5" fill="#3B82F6" />
              <circle cx="54" cy="42" r="1.5" fill="#EAB308" />
            </g>
          )}

          {archetype === 'swaraj_rival_godse' && (
            <g id="swaraj-godse">
              <circle cx="50" cy="28" r="18" fill="#450A0A" opacity="0.6" />
              {/* Dark Cloaked Silhouette */}
              <ellipse cx="50" cy="26" rx="8" ry="9" fill="#334155" />
              <path d="M 36,58 L 42,35 L 58,35 L 64,58 Z" fill="#0F172A" stroke="#7F1D1D" strokeWidth="1" />
              {/* Crosshair Target */}
              <circle cx="50" cy="28" r="10" fill="none" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,2" />
              <line x1="38" y1="28" x2="62" y2="28" stroke="#EF4444" strokeWidth="1" />
              <line x1="50" y1="16" x2="50" y2="40" stroke="#EF4444" strokeWidth="1" />
            </g>
          )}

          {archetype === 'swaraj_marvel_charkha' && (
            <g id="swaraj-charkha">
              {/* Traditional Wooden Charkha Spinning Wheel */}
              <line x1="24" y1="52" x2="76" y2="52" stroke="#78350F" strokeWidth="3" />
              {/* Large Drive Wheel */}
              <circle cx="38" cy="34" r="16" fill="none" stroke="#B45309" strokeWidth="1.5" className="animate-spin-slow" />
              <line x1="38" y1="18" x2="38" y2="50" stroke="#B45309" strokeWidth="1" />
              <line x1="22" y1="34" x2="54" y2="34" stroke="#B45309" strokeWidth="1" />
              <circle cx="38" cy="34" r="3" fill="#D97706" />
              {/* Spindle on the right */}
              <line x1="66" y1="32" x2="66" y2="52" stroke="#78350F" strokeWidth="2" />
              <line x1="38" y1="34" x2="66" y2="36" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="2,1" />
            </g>
          )}

          {archetype === 'swaraj_aadesh_do_or_die' && (
            <g id="swaraj-do-or-die">
              {/* Tricolor Clarion Banner */}
              <rect x="25" y="16" width="50" height="10" fill="#EA580C" />
              <rect x="25" y="26" width="50" height="10" fill="#F8FAFC" />
              <rect x="25" y="36" width="50" height="10" fill="#15803D" />
              {/* Navy Blue Ashoka Chakra in Center */}
              <circle cx="50" cy="31" r="4" fill="none" stroke="#1E3A8A" strokeWidth="1" />
              <text x="50" y="54" fontSize="4.5" textAnchor="middle" fill="#FDE047" fontWeight="black" letterSpacing="0.1em">
                DO OR DIE
              </text>
            </g>
          )}

          {/* ========================================================
              MAHABHARATA ARCHETYPES (Classic Complete Suite)
             ======================================================== */}
          {archetype === 'creator_krishna' && (
            <g id="char-krishna">
              <ellipse cx="50" cy="27" rx="8" ry="9" fill="#1C3D5A" />
              {/* Divine Bansuri Flute */}
              <line x1="32" y1="35" x2="66" y2="27" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" />
              {/* Peacock Feather (Mayur Pankh) */}
              <ellipse cx="53" cy="12" rx="3.5" ry="6" fill="#0D4B32" transform="rotate(15 53 12)" />
              <ellipse cx="53" cy="12" rx="1.8" ry="3.5" fill="#3B82F6" transform="rotate(15 53 12)" />
              <circle cx="53" cy="12" r="1" fill="#F4D03F" />
            </g>
          )}

          {archetype === 'creator_arjuna' && (
            <g id="char-arjuna">
              <ellipse cx="50" cy="27" rx="8" ry="9" fill="#4A3B18" />
              {/* Gandiva Bow Silhouette */}
              <path d="M 28,12 Q 20,32 28,52" fill="none" stroke="#F4D03F" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="28" y1="12" x2="28" y2="52" stroke="#E2E8F0" strokeWidth="0.8" />
              {/* Golden Warrior Diadem */}
              <polygon points="42,20 50,14 58,20" fill="#F4D03F" />
            </g>
          )}

          {archetype === 'creator_bhima' && (
            <g id="char-bhima">
              <ellipse cx="50" cy="27" rx="9" ry="9.5" fill="#3D1A24" />
              {/* Kaumodaki Heavy Gada / Mace */}
              <line x1="68" y1="14" x2="48" y2="50" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="68" cy="14" rx="7" ry="6" fill="#D4AF37" stroke="#92400E" strokeWidth="1" />
            </g>
          )}

          {archetype === 'creator_karna' && (
            <g id="char-karna">
              {/* Radiant Sun God Surya Halo */}
              <circle cx="50" cy="25" r="16" fill="none" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3,2" />
              <ellipse cx="50" cy="26" rx="8" ry="9" fill="#6B21A8" />
              {/* Golden Solar Kavacha (Armor) & Kundala Earrings */}
              <circle cx="41" cy="27" r="2.5" fill="#FDE047" />
              <circle cx="59" cy="27" r="2.5" fill="#FDE047" />
              <polygon points="42,37 50,47 58,37" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" />
            </g>
          )}

          {archetype === 'marvel_sudarshana' && (
            <g id="char-sudarshana" className="origin-center animate-spin-slow">
              <circle cx="50" cy="32" r="15" fill="#1E3A8A" opacity="0.4" />
              <circle cx="50" cy="32" r="14" stroke="#F59E0B" strokeWidth="1.8" fill="none" />
              <circle cx="50" cy="32" r="5" fill="#F59E0B" />
              {/* 8 Divine Serrated Blades */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <polygon
                  key={angle}
                  points="50,14 47,20 53,20"
                  fill="#FDE047"
                  transform={`rotate(${angle} 50 32)`}
                />
              ))}
            </g>
          )}

          {archetype === 'rival_shakuni' && (
            <g id="char-shakuni">
              <circle cx="50" cy="28" r="16" fill="#450A0A" opacity="0.5" />
              {/* Shakuni's Cursed Dice */}
              <rect x="34" y="24" width="12" height="12" rx="2" fill="#FEF2F2" stroke="#991B1B" strokeWidth="1.2" transform="rotate(15 40 30)" />
              <rect x="52" y="24" width="12" height="12" rx="2" fill="#FEF2F2" stroke="#991B1B" strokeWidth="1.2" transform="rotate(-15 58 30)" />
              <circle cx="40" cy="30" r="1.5" fill="#DC2626" />
              <circle cx="58" cy="30" r="1.5" fill="#DC2626" />
            </g>
          )}

          {archetype === 'rival_ashwatthama' && (
            <g id="char-ashwatthama">
              <circle cx="50" cy="28" r="16" fill="#2E1065" opacity="0.5" />
              <ellipse cx="50" cy="27" rx="8" ry="9" fill="#18181B" />
              {/* Glowing Mani Gem on Forehead */}
              <polygon points="50,18 53,22 50,26 47,22" fill="#EF4444" className="animate-pulse" />
            </g>
          )}

          {archetype === 'aadesh_krishna' && (
            <g id="char-aadesh">
              <circle cx="50" cy="28" r="18" fill="#4C1D95" opacity="0.4" />
              {/* Golden Royal Decree Scroll */}
              <rect x="32" y="16" width="36" height="28" rx="2" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
              <line x1="38" y1="22" x2="62" y2="22" stroke="#B45309" strokeWidth="1" />
              <line x1="38" y1="28" x2="62" y2="28" stroke="#B45309" strokeWidth="1" />
              <line x1="38" y1="34" x2="54" y2="34" stroke="#B45309" strokeWidth="1" />
              <circle cx="50" cy="38" r="3" fill="#D97706" />
            </g>
          )}

          {archetype === 'mouna_vrat' && (
            <g id="char-mouna">
              <circle cx="50" cy="30" r="22" fill="#334155" opacity="0.4" />
              <ellipse cx="50" cy="28" rx="7.5" ry="8.5" fill="#CBD5E1" />
              {/* Finger Raised in Sacred Silence */}
              <rect x="48.5" y="27" width="3" height="10" fill="#94A3B8" rx="1.5" />
            </g>
          )}

          {archetype === 'chakra_chakravyuha' && (
            <g id="char-chakra" className="origin-center animate-spin-slow">
              <circle cx="50" cy="31" r="24" stroke="#0D9488" strokeWidth="1.2" strokeDasharray="4,2" fill="none" />
              <circle cx="50" cy="31" r="18" stroke="#14B8A6" strokeWidth="1" strokeDasharray="3,2" fill="none" />
              <circle cx="50" cy="31" r="12" stroke="#5EEAD4" strokeWidth="0.8" strokeDasharray="2,2" fill="none" />
              <circle cx="50" cy="31" r="3" fill="#EF4444" className="animate-ping" />
            </g>
          )}

          {archetype === 'crisis_kurukshetra' && (
            <g id="crisis-kurukshetra">
              <circle cx="50" cy="30" r="22" fill="#7F1D1D" opacity="0.5" />
              <line x1="28" y1="18" x2="72" y2="48" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="72" y1="18" x2="28" y2="48" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="50" cy="33" r="13" stroke="#D4AF37" strokeWidth="1.5" fill="none" className="animate-spin-slow" />
            </g>
          )}

          {archetype === 'crisis_lakshagriha' && (
            <g id="crisis-lakshagriha">
              <polygon points="50,14 32,36 68,36" fill="#1C1917" stroke="#DC2626" strokeWidth="1" />
              <rect x="36" y="36" width="28" height="18" fill="#292524" stroke="#DC2626" strokeWidth="1" />
              <path d="M 40,36 Q 50,18 60,36 Z" fill="#F97316" className="animate-pulse" />
            </g>
          )}

          {/* Generic fallback for remaining regions/marvels */}
          {(archetype.startsWith('region_') || archetype.startsWith('mughal_region_') || archetype.startsWith('swaraj_region_')) && (
            <g id="region-realm">
              <circle cx="50" cy="30" r="20" fill="#065F46" opacity="0.3" />
              {/* Fort Citadel Battlements */}
              <rect x="32" y="32" width="36" height="20" fill="#1E293B" stroke="#D4AF37" strokeWidth="1" />
              <polygon points="32,32 36,26 40,32 44,26 48,32 52,26 56,32 60,26 64,32 68,26 68,32" fill="#334155" stroke="#D4AF37" strokeWidth="0.8" />
              <circle cx="50" cy="22" r="3" fill="#F59E0B" className="animate-pulse" />
            </g>
          )}

          {(archetype.startsWith('marvel_') || archetype.startsWith('mughal_marvel_') || archetype.startsWith('swaraj_marvel_') || archetype.startsWith('dharma_') || archetype.startsWith('mughal_law_') || archetype.startsWith('swaraj_law_')) && !archetype.includes('taj') && !archetype.includes('peacock') && !archetype.includes('charkha') && !archetype.includes('sudarshana') && (
            <g id="marvel-law-crest">
              <circle cx="50" cy="30" r="18" fill="#1E1B4B" opacity="0.4" />
              {/* Radiant Geometric Star Crest */}
              <polygon points="50,16 54,26 64,30 54,34 50,44 46,34 36,30 46,26" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1" className="animate-pulse" />
              <circle cx="50" cy="30" r="4" fill="#3B82F6" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
