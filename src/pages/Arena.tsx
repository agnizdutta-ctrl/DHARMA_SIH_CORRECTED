import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import { useAudio } from '../hooks/useAudio';
import { useValidation } from '../hooks/useValidation';
import { Chain } from '../components/Chain';
import { PlayerSidePanel } from '../components/PlayerSidePanel';
import { CenterConsole } from '../components/CenterConsole';
import { PotDisplay } from '../components/PotDisplay';
import { BattleLog } from '../components/BattleLog';
import { Chronicle } from '../components/Chronicle';
import { DealAnimation } from '../components/DealAnimation';
import { AadeshModal } from '../components/AadeshModal';
import { WildCardCinematicOverlay } from '../components/WildCardCinematicOverlay';
import { VictoryOverlay } from '../components/VictoryOverlay';
import { isWildCard } from '../../engine/validator';

export const Arena: React.FC = () => {
  const {
    players,
    playerHands,
    isDealAnimationActive,
    setIsDealAnimationActive,
    baseCardData,
    chain,
    pot,
    deckCount,
    round,
    maxRounds,
    currentTurnPlayerId,
    currentTurnIndex,
    gameStatus,
    battleLog,
    lastPlayedCard,
    selectedCardId,
    selectedTargetNodeId,
    pendingAadeshCardId,
    setSelectedCard,
    setSelectedTargetNode,
    setPendingAadeshCardId,
    showRulesModal,
    setShowRulesModal,
    activeToast,
    showToast,
    settings,
    updateSettings,
    finalScores,
    winner,
    wildCinematicCard,
    isWildCinematicActive,
    isVibrationActive,
    isLightningActive,
    triggerWildCardEffect,
    currentEra,
    setCurrentPage,
    resetGame,
    startDualPlayerGame,
    drawCardAction,
    playCardAction
  } = useGameStore();

  const navigate = useNavigate();
  const { play } = useAudio();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'scoreboard' | 'battlelog' | 'lore'>('scoreboard');
  const [shakingCardId, setShakingCardId] = useState<string | null>(null);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);

  const handleExitToMenu = () => {
    resetGame();
    setCurrentPage('menu');
    navigate('/menu');
  };

  // Auto-initialize Dual Player game if not started
  useEffect(() => {
    if (gameStatus === 'lobby' || chain.length === 0 || players.length === 0) {
      startDualPlayerGame(maxRounds || 7);
    }
  }, [gameStatus, chain.length, players.length, maxRounds, startDualPlayerGame]);

  const p1 = players[0];
  const p2 = players[1];
  const activePlayer = players[currentTurnIndex] || p1;

  // Real dual player hands
  const p1Cards = playerHands['p1'] || [];
  const p2Cards = playerHands['p2'] || [];

  // Validation computed independently for each player's hand
  const p1Validation = useValidation(
    chain,
    p1Cards,
    currentTurnPlayerId === 'p1' ? selectedCardId : null
  );

  const p2Validation = useValidation(
    chain,
    p2Cards,
    currentTurnPlayerId === 'p2' ? selectedCardId : null
  );

  const activeValidation = currentTurnPlayerId === 'p1' ? p1Validation : p2Validation;
  const activeLegalTargetNodeIds = activeValidation.legalTargetNodeIds;

  // Selected card data
  const currentActiveCards = currentTurnPlayerId === 'p1' ? p1Cards : p2Cards;
  const selectedCard = currentActiveCards.find((c) => c.id === selectedCardId);

  // Can play selected card
  const canPlaySelectedCard = Boolean(
    selectedCardId &&
      selectedTargetNodeId &&
      activeLegalTargetNodeIds.includes(selectedTargetNodeId)
  );

  // Execute Play Card to table
  const executePlayCard = (
    cardId: string,
    targetNodeId: string,
    playerId?: 'p1' | 'p2',
    declaredCategory?: 'C' | 'L' | 'M' | 'R'
  ) => {
    const pid = playerId || (currentTurnPlayerId as 'p1' | 'p2');
    const hand = playerHands[pid] || [];
    const card = hand.find((c) => c.id === cardId);
    if (!card) return;

    const isAadeshCard =
      card.type === 'aadesh' ||
      card.variant === 'aadesh' ||
      card.name.toLowerCase().includes('aadesh');

    // If card is Aadesh and no category declared yet, open modal
    if (isAadeshCard && !declaredCategory) {
      setSelectedCard(cardId);
      setSelectedTargetNode(targetNodeId);
      setPendingAadeshCardId(cardId);
      return;
    }

    const success = playCardAction(cardId, targetNodeId, declaredCategory);

    if (success) {
      // Trigger wild card cinematic sequence if played card is wild
      if (isWildCard(card)) {
        triggerWildCardEffect(card);
      }

      if (card.category === 'Rival' || card.type === 'rival') {
        play('rivalSteal');
      } else if (isAadeshCard) {
        play('aadeshCommand');
      } else if (card.effect === 'steal_last_card') {
        play('mahaKarmaStrike');
      } else if (card.effect === 'skip_next') {
        play('mounaSkip');
      } else if (card.effect === 'reverse_order') {
        play('chakravyuhaReverse');
      } else {
        play('cardPlay');
        play('potIncrease');
      }

      setSelectedCard(null);
      setSelectedTargetNode(null);
      setPendingAadeshCardId(null);
    }
  };

  // Handle Play Card via button or table commit
  const handlePlayCard = () => {
    if (!selectedCardId || !selectedTargetNodeId) return;
    executePlayCard(selectedCardId, selectedTargetNodeId, currentTurnPlayerId as 'p1' | 'p2');
  };

  // Handle category chosen for Aadesh card
  const handleAadeshCategorySelect = (category: 'C' | 'L' | 'M' | 'R') => {
    if (!pendingAadeshCardId) return;
    const targetNodeId =
      selectedTargetNodeId ||
      activeLegalTargetNodeIds[activeLegalTargetNodeIds.length - 1] ||
      chain[chain.length - 1]?.id ||
      'chain_node_0';

    executePlayCard(pendingAadeshCardId, targetNodeId, currentTurnPlayerId as 'p1' | 'p2', category);
  };

  // Handle Draw Card
  const handleDrawCard = () => {
    play('cardDraw');
    drawCardAction();
    setSelectedCard(null);
    setSelectedTargetNode(null);
    setPendingAadeshCardId(null);
  };

  // Handle Card Click from Player's Hand
  const handleSelectCard = (cardId: string, playerId: 'p1' | 'p2') => {
    // If player clicked card on the waiting player's side
    if (playerId !== currentTurnPlayerId) {
      const activeName = currentTurnPlayerId === 'p1' ? (p1?.name || 'AD') : (p2?.name || 'RS');
      showToast(`⚔ It is currently ${activeName}'s turn! Select a card from ${activeName}'s hand.`);
      return;
    }

    const hand = playerId === 'p1' ? p1Cards : p2Cards;
    const card = hand.find((c) => c.id === cardId);
    if (!card) return;

    const validation = playerId === 'p1' ? p1Validation : p2Validation;
    const isValid = Boolean(validation.validCardsInHand[cardId]);

    if (!isValid) {
      // Illegal move feedback: vibration + glowing red
      setShakingCardId(cardId);
      play('errorBuzz');

      const lastNode = chain[chain.length - 1];
      const targetCard = lastNode ? lastNode.card : null;
      const targetDesc = targetCard
        ? `${targetCard.name} (${targetCard.category || 'Special'})`
        : 'the Base Card';

      showToast(`⚠️ Illegal Move! ${card.name} (${card.category}) cannot link to ${targetDesc}. Match Category, Ruler, or Succession!`);

      setTimeout(() => {
        setShakingCardId((curr) => (curr === cardId ? null : curr));
      }, 650);
      return;
    }

    // Determine legal target node on the table
    const legalTargets = validation.legalTargetNodeIds;
    const targetNodeId =
      selectedTargetNodeId && legalTargets.includes(selectedTargetNodeId)
        ? selectedTargetNodeId
        : legalTargets[legalTargets.length - 1] || chain[chain.length - 1]?.id || 'chain_node_0';

    // 1. Select card: card gets up from player's section with animation
    setSelectedCard(cardId);
    setSelectedTargetNode(targetNodeId);
    play('cardHover');

    const isAadeshCard =
      card.type === 'aadesh' ||
      card.variant === 'aadesh' ||
      card.name.toLowerCase().includes('aadesh');

    if (isAadeshCard) {
      // Open Aadesh modal to declare category
      setPendingAadeshCardId(cardId);
      return;
    }

    // 2. Animate and transition the card onto the table
    setTimeout(() => {
      executePlayCard(cardId, targetNodeId, playerId);
    }, 280);
  };

  // Trigger celebratory fanfare and confetti on victory
  useEffect(() => {
    if (gameStatus === 'ended') {
      play('victoryFanfare');
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [gameStatus, play]);

  return (
    <div className="relative w-full h-screen bg-[#1A0E06] overflow-hidden">
      {/* Master Cinematic WILD CARD Overlay (Slow-motion card spotlight + electric lightning) */}
      <WildCardCinematicOverlay
        card={wildCinematicCard}
        isCinematicActive={isWildCinematicActive}
        isLightningActive={isLightningActive}
      />

      <div
        id="arena-battlefield"
        className={`relative w-full h-full bg-gradient-to-b from-[#0D1D38] via-[#142345] to-[#0A1224] text-[#FDF6E2] flex flex-col justify-between overflow-hidden select-none ${
          isWildCinematicActive ? 'cinematic-slow-motion' : ''
        } ${isVibrationActive ? 'cinematic-interface-vibration' : ''}`}
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 20%, rgba(255, 215, 0, 0.14) 0%, rgba(26, 77, 142, 0.45) 45%, rgba(128, 0, 128, 0.35) 75%, rgba(10, 18, 36, 0.96) 100%)'
        }}
      >
        {/* 0. UNO-STYLE SHUFFLE & DEAL ANIMATION OVERLAY */}
      <AnimatePresence>
        {isDealAnimationActive && (
          <DealAnimation
            baseCard={baseCardData}
            p1Name={p1?.name || 'AD'}
            p2Name={p2?.name || 'RS'}
            p1Cards={playerHands['p1'] || []}
            p2Cards={playerHands['p2'] || []}
            onComplete={() => setIsDealAnimationActive(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1A4D8E] text-[#FFD700] px-6 py-2.5 rounded-full shadow-[0_0_25px_rgba(255,215,0,0.4)] border-2 border-[#FFD700] text-xs font-bold flex items-center gap-2"
          >
            <span>📜</span>
            <span>{activeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP HEADER NAVIGATION (Mahabharat Palette: Dharma Blue, Mystic Purple, Royal Gold, Warrior Red) */}
      <header
        id="arena-header"
        className="w-full px-4 sm:px-8 py-2.5 bg-gradient-to-r from-[#102347]/95 via-[#1A1838]/95 to-[#1B072B]/95 backdrop-blur-md border-b-2 border-[#FFD700]/60 flex items-center justify-between z-30 shrink-0 shadow-lg"
      >
        {/* Left: Brand & Match info with Functional Back / Exit Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              play('cardPlay');
              setShowExitConfirmModal(true);
            }}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1A4D8E] to-[#800080] border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-[#0A1224] text-[#FFD700] transition flex items-center gap-1.5 text-xs font-kate font-black cursor-pointer shadow-[0_0_12px_rgba(255,215,0,0.3)] hover:scale-105"
            title="Exit to Era Selection"
          >
            <span className="text-sm">←</span>
            <span>Menu</span>
          </button>
          <div>
            <h1 className="font-supremacy text-base sm:text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFD700] to-[#FFD700] leading-none drop-shadow">
              DHARMA: {currentEra === 'mughal' ? 'MUGHAL YUGAM' : currentEra === 'swaraj' ? 'SWARAJ YUG' : 'MAHABHARAT'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9.5px] sm:text-[10px] font-kate uppercase tracking-widest text-[#FFD700] font-bold">
                2-PLAYER DUAL BATTLEFIELD
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono bg-black/50 border border-[#FFD700]/35 px-2 py-0.2 rounded text-amber-200 font-bold">
                Pass &amp; Play Turn-Based
              </span>
            </div>
          </div>
        </div>

        {/* Center: Round & Active Turn Indicators (Dharma Blue & Warrior Red) */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#1A4D8E]/90 text-[#FFD700] px-3.5 py-1 rounded-full font-kate text-xs font-black tracking-widest uppercase shadow flex items-center gap-1.5 border border-[#FFD700]/60">
            <span>ROUND</span>
            <span className="text-white text-sm">{round}</span>
            <span className="opacity-70">/ {maxRounds}</span>
          </div>

          <div className="bg-gradient-to-r from-[#A52A2A] to-[#800000] text-white px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(165,42,42,0.6)] flex items-center gap-1.5 animate-pulse border border-[#FFD700]/60">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50] shadow-[0_0_6px_#4CAF50] animate-ping" />
            <span>Active: {activePlayer ? activePlayer.name : 'AD'}</span>
          </div>
        </div>

        {/* Right: Pot & Utility Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <PotDisplay pot={pot} deckCount={deckCount} />

          <button
            onClick={() => setIsLogOpen(!isLogOpen)}
            className="px-3.5 py-1.5 rounded-full border-2 border-[#FFD700]/60 bg-gradient-to-r from-[#1A4D8E] to-[#800080] hover:bg-[#FFD700] hover:text-[#0A1224] text-xs font-kate font-bold text-[#FFD700] transition cursor-pointer flex items-center gap-1.5 shadow"
          >
            <span>📜</span>
            <span className="hidden sm:inline">Ledger &amp; Scores</span>
            <span className="sm:hidden">Ledger</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BATTLEFIELD: NEW 3-COLUMN RESTRUCTURED LAYOUT
          LEFT: Player 1 Profile/Score → Player 1's Cards
          CENTER: Large Dynastic Chain Arena (Primary & Largest area)
          RIGHT: Player 2 Profile/Score → Player 2's Cards
      */}
      <main
        id="battlefield-main-grid"
        className="flex-1 w-full max-w-[1880px] mx-auto p-2.5 sm:p-3 lg:p-4 flex flex-col md:flex-row items-stretch justify-between gap-3 lg:gap-4 overflow-hidden relative z-10 min-h-0"
      >
        {/* LEFT COLUMN: Player 1 Profile/Score → Player 1's Cards */}
        <PlayerSidePanel
          player={p1 ? { ...p1, cardCount: p1Cards.length, genderLabel: '(Boy)' } : undefined}
          isCurrentTurn={currentTurnPlayerId === 'p1'}
          cards={p1Cards}
          validCardsInHand={p1Validation.validCardsInHand}
          selectedCardId={currentTurnPlayerId === 'p1' ? selectedCardId : null}
          shakingCardId={shakingCardId}
          side="left"
          onSelectCard={(cardId) => handleSelectCard(cardId, 'p1')}
          onDrawCard={handleDrawCard}
        />

        {/* CENTER COLUMN: Large Dynastic Chain Arena (Dominant Centerpiece) + Center Console */}
        <section
          id="center-dynastic-chain-arena"
          className="flex-1 min-w-0 h-full flex flex-col gap-2.5 justify-between overflow-hidden"
        >
          {/* Dominant Dynastic Chain Arena Board */}
          <Chain
            chain={chain}
            legalTargetNodeIds={activeLegalTargetNodeIds}
            selectedTargetNodeId={selectedTargetNodeId}
            selectedCardId={selectedCardId}
            onSelectTargetNode={(nodeId) => {
              setSelectedTargetNode(nodeId);
              if (selectedCardId && nodeId) {
                executePlayCard(selectedCardId, nodeId, currentTurnPlayerId as 'p1' | 'p2');
              }
            }}
            onCommitPlay={handlePlayCard}
          />

          {/* Integrated Center Console: 3D Stacked Royal Deck, Action Play Button, Rules & Guidance */}
          <CenterConsole
            deckCount={deckCount}
            onDrawCard={handleDrawCard}
            canPlayCard={canPlaySelectedCard}
            selectedCardName={selectedCard?.name}
            activePlayerName={activePlayer ? activePlayer.name : 'AD'}
            isMyTurn={true}
            onPlaySelectedCard={handlePlayCard}
            onOpenRules={() => setShowRulesModal(true)}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          />
        </section>

        {/* RIGHT COLUMN: Player 2 Profile/Score → Player 2's Cards */}
        <PlayerSidePanel
          player={p2 ? { ...p2, cardCount: p2Cards.length, genderLabel: '(Girl)' } : undefined}
          isCurrentTurn={currentTurnPlayerId === 'p2'}
          cards={p2Cards}
          validCardsInHand={p2Validation.validCardsInHand}
          selectedCardId={currentTurnPlayerId === 'p2' ? selectedCardId : null}
          shakingCardId={shakingCardId}
          side="right"
          onSelectCard={(cardId) => handleSelectCard(cardId, 'p2')}
          onDrawCard={handleDrawCard}
        />
      </main>

      {/* 3. SLIDE-OVER RIGHT LEDGER DRAWER: 3 Panels (Scoreboard, Battle Log, Chronicle Lore) */}
      <AnimatePresence>
        {isLogOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-84 md:w-96 bg-gradient-to-b from-[#102347] via-[#1A1838] to-[#1B072B] border-l-2 border-[#FFD700]/60 shadow-[0_0_50px_rgba(0,0,0,0.9)] z-40 p-5 flex flex-col justify-between"
          >
            {/* Drawer Header with Tabs */}
            <div className="pb-3 border-b border-[#FFD700]/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-kate font-bold text-sm text-[#FFD700] uppercase tracking-wider">
                  Mahabharat Court Ledger
                </h3>
                <button
                  onClick={() => setIsLogOpen(false)}
                  className="w-7 h-7 rounded-full bg-[#1A4D8E] border border-[#FFD700]/40 text-[#FFD700] flex items-center justify-center font-bold text-xs hover:bg-[#FFD700] hover:text-[#0A1224] transition cursor-pointer shadow"
                >
                  ✕
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex rounded-lg bg-black/40 p-1 border border-[#FFD700]/30 gap-1 text-[11px] font-kate">
                <button
                  onClick={() => setActiveTab('scoreboard')}
                  className={`flex-1 py-1 rounded font-bold transition cursor-pointer ${
                    activeTab === 'scoreboard'
                      ? 'bg-[#FFD700] text-[#0A1224]'
                      : 'text-amber-200/70 hover:text-amber-200'
                  }`}
                >
                  Scoreboard
                </button>
                <button
                  onClick={() => setActiveTab('battlelog')}
                  className={`flex-1 py-1 rounded font-bold transition cursor-pointer ${
                    activeTab === 'battlelog'
                      ? 'bg-[#FFD700] text-[#0A1224]'
                      : 'text-amber-200/70 hover:text-amber-200'
                  }`}
                >
                  Live Log
                </button>
                <button
                  onClick={() => setActiveTab('lore')}
                  className={`flex-1 py-1 rounded font-bold transition cursor-pointer ${
                    activeTab === 'lore'
                      ? 'bg-[#FFD700] text-[#0A1224]'
                      : 'text-amber-200/70 hover:text-amber-200'
                  }`}
                >
                  Chronicle Lore
                </button>
              </div>
            </div>

            {/* Tab 1: Live Scoreboard breakdown according to PDF rules */}
            {activeTab === 'scoreboard' && (
              <div className="flex-1 py-4 overflow-y-auto flex flex-col gap-4 text-xs">
                <div className="rounded-xl bg-[#1A4D8E]/40 p-3 border border-[#FFD700]/30">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700]">
                    Official Scoring Formula (Dharma Rules)
                  </span>
                  <p className="text-amber-100/70 text-[10.5px] mt-1">
                    Total = (Played CLeMaR Card Pts) + (Rival Stolen Pts) - (Draw Penalties: -1 Pt/Card)
                  </p>
                </div>

                {players.map((p) => {
                  const netScore = (p.cardPoints || 0) + (p.stolenPoints || 0) - (p.drawPenalties || 0);
                  const isCurrent = p.id === currentTurnPlayerId;
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl p-3.5 border ${
                        isCurrent
                          ? 'bg-gradient-to-r from-[#1A4D8E]/80 to-[#800080]/60 border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                          : 'bg-black/40 border-[#FFD700]/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-kate font-bold text-sm text-white">
                          {p.name} {isCurrent && '👑 (Turn)'}
                        </span>
                        <span className="font-supremacy text-lg font-black text-[#FFD700]">
                          {netScore} PTS
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-[#FFD700]/20">
                        <div className="flex flex-col">
                          <span className="text-amber-200/60">Card Pts</span>
                          <span className="font-bold text-[#4CAF50]">+{p.cardPoints || 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-amber-200/60">Stolen</span>
                          <span className="font-bold text-[#FFD700]">+{p.stolenPoints || 0}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-amber-200/60">Draw Penalty</span>
                          <span className="font-bold text-[#A52A2A]">-{p.drawPenalties || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pot Status Card */}
                <div className="rounded-xl bg-gradient-to-r from-[#FFD700]/20 via-[#FFE55C]/15 to-[#FFD700]/20 p-3 border border-[#FFD700] text-center mt-auto shadow">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFD700]">
                    Current Imperial Pot
                  </span>
                  <div className="font-supremacy text-2xl font-black text-[#FFD700]">
                    {pot} POINTS
                  </div>
                  <span className="text-[10px] text-amber-200/70 block mt-0.5">
                    Rival cards steal this entire pot!
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Live Battle Log Stream */}
            {activeTab === 'battlelog' && (
              <div className="flex-1 py-3 overflow-hidden">
                <BattleLog logs={battleLog} />
              </div>
            )}

            {/* Tab 3: Chronicle Lore of the Last Played Card */}
            {activeTab === 'lore' && (
              <div className="flex-1 py-4 overflow-y-auto text-xs flex flex-col gap-3">
                {lastPlayedCard ? (
                  <div className="rounded-xl bg-[#163828] p-4 border border-[#D4AF37]/40">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20 mb-2">
                      <span className="font-kate font-bold text-sm text-[#F4D03F]">
                        {lastPlayedCard.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-[#55EFC4]">
                        {lastPlayedCard.points ? `+${lastPlayedCard.points} PTS` : '0 PTS'}
                      </span>
                    </div>

                    <p className="font-editorial italic text-sm text-[#F5EBE6] leading-relaxed">
                      {lastPlayedCard.historicalDetail ||
                        lastPlayedCard.historicalContext ||
                        'Recorded in the Imperial Archives of Bharat.'}
                    </p>

                    {lastPlayedCard.effect && (
                      <div className="mt-3 pt-2 border-t border-[#D4AF37]/20 text-[11px]">
                        <span className="font-bold text-[#55EFC4]">Tactical Effect: </span>
                        <span className="text-amber-100/90">{lastPlayedCard.effect.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-amber-200/60 text-center my-auto">
                    Play a card to view its dynastic historical record here.
                  </p>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-[#D4AF37]/20 text-[10px] text-amber-200/60 text-center font-centrion">
              52 Cards · 7 Dynastic Rounds · CLeMaR Hierarchy
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. POST-MATCH VICTORY & SUMMARY OVERLAY WITH METRICS AND UNLOCKED ACHIEVEMENTS */}
      <AnimatePresence>
        {gameStatus === 'ended' && (
          <VictoryOverlay
            isOpen={gameStatus === 'ended'}
            winner={winner}
            players={players}
            finalScores={finalScores}
            currentEra={currentEra}
            roundsPlayed={round}
            onRematch={() => {
              startDualPlayerGame(maxRounds || 7);
            }}
            onExitToMenu={handleExitToMenu}
            onOpenCodex={() => setShowRulesModal(true)}
          />
        )}
      </AnimatePresence>

      {/* 5. IN-APP EXIT CONFIRMATION MODAL (100% Functional in Iframe) */}
      <AnimatePresence>
        {showExitConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-2xl bg-gradient-to-b from-[#102347] via-[#1A1838] to-[#1B072B] border-2 border-[#FFD700] p-6 text-center shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#FFD700] bg-gradient-to-tr from-[#1A4D8E] to-[#800080] mx-auto flex items-center justify-center text-xl text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.4)] mb-3">
                ☸
              </div>
              <h3 className="font-supremacy text-lg sm:text-xl font-black text-[#FFD700] tracking-wider uppercase">
                Leave Battlefield?
              </h3>
              <p className="font-centrion text-xs sm:text-sm text-amber-100/80 mt-2 leading-relaxed">
                Are you sure you want to exit to the Era Selection menu? Your active duel and scoring progress will be reset.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => {
                    play('cardPlay');
                    setShowExitConfirmModal(false);
                    handleExitToMenu();
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#A52A2A] to-[#800000] border-2 border-[#FFD700] text-white font-kate font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer transition"
                >
                  Exit to Menu
                </button>
                <button
                  onClick={() => setShowExitConfirmModal(false)}
                  className="px-6 py-2.5 rounded-full bg-[#1A4D8E] border-2 border-[#FFD700]/70 text-[#FFD700] font-kate font-bold text-xs uppercase tracking-wider hover:bg-[#FFD700] hover:text-[#0A1224] transition cursor-pointer"
                >
                  Stay in Battle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. RULES & CODEX MODAL */}
      <Chronicle isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />

      {/* 7. AADESH / ROYAL FARMAN COMMAND SELECTION MODAL */}
      <AadeshModal
        isOpen={Boolean(pendingAadeshCardId)}
        playerName={activePlayer ? activePlayer.name : 'Imperial Chronicler'}
        onSelectCategory={handleAadeshCategorySelect}
        onCancel={() => setPendingAadeshCardId(null)}
      />
    </div>
  </div>
  );
};
