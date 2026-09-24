import { create } from 'zustand';
import {
  BattleLogEntry,
  CardData,
  CardNode,
  FinalScore,
  GameStateSnapshot,
  PlayedCard,
  Player
} from '../../engine/types';
import { buildComplete52Deck, fisherYatesShuffle } from '../../engine/deck';
import { DharmaEngine, isWildCard } from '../../engine/validator';
import { EraId } from '../types/era';
import { applyTheme } from '../theme/themeManager';

const engineValidator = new DharmaEngine();

export type PageView = 'universal-landing' | 'menu' | 'era-landing' | 'arena' | 'landing' | 'dashboard';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  particlesEnabled: boolean;
  darkMode: boolean;
}

export interface GameStoreState {
  // Navigation & UI
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;

  // Selected Era
  currentEra: EraId;
  setCurrentEra: (era: EraId) => void;

  // Player session info
  playerName: string;
  setPlayerName: (name: string) => void;
  player2Name: string;
  setPlayer2Name: (name: string) => void;
  mode: '2p' | '4p';
  setMode: (mode: '2p' | '4p') => void;
  rounds: number;
  setRounds: (rounds: number) => void;
  playAgainstAI: boolean;
  setPlayAgainstAI: (againstAI: boolean) => void;

  // Settings
  settings: GameSettings;
  updateSettings: (partial: Partial<GameSettings>) => void;

  // Active game state
  roomId: string | null;
  myPlayerId: string | null;
  players: Player[];
  playerHands: Record<string, CardData[]>;
  activeViewingHandPlayerId: string | null;
  setActiveViewingHandPlayerId: (id: string | null) => void;
  isDealAnimationActive: boolean;
  setIsDealAnimationActive: (active: boolean) => void;
  baseCardData: CardData | null;
  deck: CardData[];
  discardPile: CardData[];
  chain: CardNode[];
  pot: number;
  currentTurnPlayerId: string;
  currentTurnIndex: number;
  roundTurnsCount: number;
  round: number;
  maxRounds: number;
  turnOrder: 'clockwise' | 'anticlockwise';
  gameStatus: 'lobby' | 'active' | 'ended';
  deckCount: number;
  discardCount: number;
  battleLog: BattleLogEntry[];
  lastPlayedCard: PlayedCard | null;
  finalScores: FinalScore[];
  winner?: Player;

  // Local selection in Arena
  selectedCardId: string | null;
  selectedTargetNodeId: string | null;
  setSelectedCard: (cardId: string | null) => void;
  setSelectedTargetNode: (nodeId: string | null) => void;

  // Modals & toasts
  showRulesModal: boolean;
  setShowRulesModal: (show: boolean) => void;
  pendingAadeshCardId: string | null;
  setPendingAadeshCardId: (id: string | null) => void;
  activeToast: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;

  // Wild Card cinematic sequence state
  wildCinematicCard: CardData | PlayedCard | null;
  isWildCinematicActive: boolean;
  isVibrationActive: boolean;
  isLightningActive: boolean;
  triggerWildCardEffect: (card?: CardData | PlayedCard | null) => void;

  // Dual Player MVP Local Engine Actions
  startDualPlayerGame: (customRounds?: number) => void;
  drawCardAction: () => boolean;
  playCardAction: (cardId: string, targetNodeId?: string, declaredCategory?: 'C' | 'L' | 'M' | 'R' | null) => boolean;

  // Network sync actions
  syncSnapshot: (snapshot: GameStateSnapshot, playerId?: string) => void;
  setSession: (roomId: string, myPlayerId: string) => void;
  resetGame: () => void;
}

let cinematicMasterTimer: ReturnType<typeof setTimeout> | null = null;
let vibrationStartTimer: ReturnType<typeof setTimeout> | null = null;
let vibrationEndTimer: ReturnType<typeof setTimeout> | null = null;
let lightningStartTimer: ReturnType<typeof setTimeout> | null = null;
let lightningEndTimer: ReturnType<typeof setTimeout> | null = null;

const clearAllCinematicTimers = () => {
  if (cinematicMasterTimer) clearTimeout(cinematicMasterTimer);
  if (vibrationStartTimer) clearTimeout(vibrationStartTimer);
  if (vibrationEndTimer) clearTimeout(vibrationEndTimer);
  if (lightningStartTimer) clearTimeout(lightningStartTimer);
  if (lightningEndTimer) clearTimeout(lightningEndTimer);
  cinematicMasterTimer = null;
  vibrationStartTimer = null;
  vibrationEndTimer = null;
  lightningStartTimer = null;
  lightningEndTimer = null;
};

export const useGameStore = create<GameStoreState>((set, get) => ({
  currentPage: 'universal-landing',
  setCurrentPage: (page) => set({ currentPage: page }),

  currentEra: 'mahabharat',
  setCurrentEra: (era) => {
    applyTheme(era);
    set({ currentEra: era });
  },

  playerName: 'AD',
  setPlayerName: (name) => set({ playerName: name }),
  player2Name: 'RS',
  setPlayer2Name: (name) => set({ player2Name: name }),
  mode: '2p',
  setMode: (mode) => set({ mode }),
  rounds: 7,
  setRounds: (rounds) => set({ rounds }),
  playAgainstAI: false, // Dual Player MVP without AI
  setPlayAgainstAI: (againstAI) => set({ playAgainstAI: againstAI }),

  settings: {
    soundEnabled: true,
    musicEnabled: true,
    particlesEnabled: true,
    darkMode: false
  },
  updateSettings: (partial) =>
    set((state) => ({ settings: { ...state.settings, ...partial } })),

  roomId: null,
  myPlayerId: 'p1',
  players: [],
  playerHands: {},
  activeViewingHandPlayerId: null,
  setActiveViewingHandPlayerId: (id) => set({ activeViewingHandPlayerId: id }),
  isDealAnimationActive: false,
  setIsDealAnimationActive: (active) => set({ isDealAnimationActive: active }),
  baseCardData: null,
  deck: [],
  discardPile: [],
  chain: [],
  pot: 0,
  currentTurnPlayerId: 'p1',
  currentTurnIndex: 0,
  roundTurnsCount: 0,
  round: 1,
  maxRounds: 7,
  turnOrder: 'clockwise',
  gameStatus: 'lobby',
  deckCount: 52,
  discardCount: 0,
  battleLog: [],
  lastPlayedCard: null,
  finalScores: [],
  winner: undefined,

  selectedCardId: null,
  selectedTargetNodeId: null,
  setSelectedCard: (cardId) => set({ selectedCardId: cardId }),
  setSelectedTargetNode: (nodeId) => set({ selectedTargetNodeId: nodeId }),

  showRulesModal: false,
  setShowRulesModal: (show) => set({ showRulesModal: show }),
  pendingAadeshCardId: null,
  setPendingAadeshCardId: (id) => set({ pendingAadeshCardId: id }),
  activeToast: null,
  showToast: (msg) => {
    set({ activeToast: msg });
    setTimeout(() => {
      if (get().activeToast === msg) {
        set({ activeToast: null });
      }
    }, 4500);
  },
  clearToast: () => set({ activeToast: null }),

  // Wild Card cinematic sequence state & timeline trigger
  wildCinematicCard: null,
  isWildCinematicActive: false,
  isVibrationActive: false,
  isLightningActive: false,

  triggerWildCardEffect: (card) => {
    // Prevent multiple triggers for a single wild card action (guard window: 1850ms)
    if (get().isWildCinematicActive) return;

    clearAllCinematicTimers();

    const wildCard = card || null;

    // 0.0s: Cinematic slow-motion enters + Wild Card dramatic entrance animation starts
    set({
      wildCinematicCard: wildCard,
      isWildCinematicActive: true,
      isVibrationActive: false,
      isLightningActive: false
    });

    // 0.6s: Full interface continuous vibration starts (~1.1s duration, until 1.7s)
    vibrationStartTimer = setTimeout(() => {
      set({ isVibrationActive: true });
    }, 600);

    // 1.0s: Electric lightning flash strikes at peak of vibration (350ms duration, until 1.35s)
    lightningStartTimer = setTimeout(() => {
      set({ isLightningActive: true });
    }, 1000);

    // 1.35s: Lightning overlay fades out smoothly
    lightningEndTimer = setTimeout(() => {
      set({ isLightningActive: false });
    }, 1350);

    // 1.7s: Continuous vibration finishes cleanly after gradual dampening
    vibrationEndTimer = setTimeout(() => {
      set({ isVibrationActive: false });
    }, 1700);

    // 1.85s: Sequence concludes, return smoothly to 100% normal speed and idle state
    cinematicMasterTimer = setTimeout(() => {
      set({
        wildCinematicCard: null,
        isWildCinematicActive: false,
        isVibrationActive: false,
        isLightningActive: false
      });
      clearAllCinematicTimers();
    }, 1850);
  },

  setSession: (roomId, myPlayerId) =>
    set({ roomId, myPlayerId, currentPage: 'arena' }),

  // ==========================================
  // AUTHORITATIVE DUAL PLAYER ENGINE
  // ==========================================
  startDualPlayerGame: (customRounds) => {
    const roundsCount = customRounds || get().rounds || 7;
    const p1Name = get().playerName || 'AD';
    const p2Name = get().player2Name || 'RS';

    // 1. Build complete 52 cards (36 CLeMaR + 16 Wild cards)
    const currentEra = get().currentEra || 'mahabharat';
    const completeDeck = buildComplete52Deck(currentEra);

    // 2. Perform Fisher-Yates Shuffle
    const shuffledDeck = fisherYatesShuffle(completeDeck);

    // 3. Deal exactly 5 cards to each player (10 cards total)
    const p1Hand = shuffledDeck.splice(0, 5);
    const p2Hand = shuffledDeck.splice(0, 5);
    // 52 - 10 = 42 cards remain!

    // 4. Flip the top card of Draw Pile face-up as Base Card.
    // "The Base Card must always be a Main card. If Wild, put it back in deck and flip another."
    const mainCardIndex = shuffledDeck.findIndex((c) => ['C', 'L', 'M', 'R'].includes(c.category) && Boolean(c.rulerId));
    const baseCardRaw = mainCardIndex !== -1 ? shuffledDeck.splice(mainCardIndex, 1)[0] : shuffledDeck.pop()!;
    const baseCard: CardData = {
      ...baseCardRaw,
      id: 'base_anchor_card',
      points: 0, // Base card is worth 0 points!
      type: 'main'
    };
    // Exactly 41 cards remain in the Draw Pile!

    const player1: Player = {
      id: 'p1',
      socketId: 'local_p1',
      name: p1Name,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&h=160&fit=crop&crop=faces',
      title: 'Crown Commander (AD)',
      hand: p1Hand,
      score: 0,
      cardPoints: 0,
      stolenPoints: 0,
      drawPenalties: 0,
      drawCount: 0,
      rivalStealsCount: 0,
      highestSingleCard: 0,
      isHost: true,
      isConnected: true
    };

    const player2: Player = {
      id: 'p2',
      socketId: 'local_p2',
      name: p2Name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
      title: 'Imperial Sovereign (RS)',
      hand: p2Hand,
      score: 0,
      cardPoints: 0,
      stolenPoints: 0,
      drawPenalties: 0,
      drawCount: 0,
      rivalStealsCount: 0,
      highestSingleCard: 0,
      isHost: false,
      isConnected: true
    };

    // 5. Initialize Root Chain with Base Card
    const basePlayedCard: PlayedCard = {
      ...baseCard,
      instanceId: 'base_anchor_instance',
      playedByPlayerId: 'court',
      playedByPlayerName: 'Imperial Table',
      playedAtRound: 1
    };

    const rootNode: CardNode = {
      id: 'chain_node_0',
      card: basePlayedCard,
      parentCardId: null,
      childrenCardIds: [],
      depth: 0,
      branchIndex: 0
    };

    const initialLog: BattleLogEntry = {
      id: 'log_start',
      round: 1,
      turnIndex: 0,
      playerId: 'court',
      playerName: 'Imperial Herald',
      cardName: baseCard.name,
      category: baseCard.category,
      points: 0,
      actionType: 'play',
      message: `The Yuga begins! 5 cards dealt to each player. ${baseCard.name} (${baseCard.category}) placed as Base Anchor (0 pts). 41 cards remain in Draw Pile.`,
      timestamp: Date.now()
    };

    set({
      players: [player1, player2],
      playerHands: {
        p1: p1Hand,
        p2: p2Hand
      },
      activeViewingHandPlayerId: 'p1',
      myPlayerId: 'p1',
      deck: shuffledDeck,
      discardPile: [],
      chain: [rootNode],
      pot: 0,
      currentTurnPlayerId: 'p1',
      currentTurnIndex: 0,
      roundTurnsCount: 0,
      round: 1,
      maxRounds: roundsCount,
      turnOrder: 'clockwise',
      gameStatus: 'active',
      deckCount: shuffledDeck.length, // 41
      discardCount: 0,
      battleLog: [initialLog],
      lastPlayedCard: basePlayedCard,
      finalScores: [],
      winner: undefined,
      selectedCardId: null,
      selectedTargetNodeId: 'chain_node_0',
      pendingAadeshCardId: null,
      currentPage: 'arena',
      isDealAnimationActive: true,
      baseCardData: baseCard
    });

    get().showToast(`⚔ Match started! ${p1Name}'s turn.`);
  },

  // Authoritative Draw Card
  drawCardAction: () => {
    const state = get();
    if (state.gameStatus !== 'active') return false;

    const currentPlayer = state.players[state.currentTurnIndex];
    if (!currentPlayer) return false;

    let currentDeck = [...state.deck];
    let discard = [...state.discardPile];

    // Reshuffle discard pile if deck is exhausted
    if (currentDeck.length === 0) {
      if (discard.length > 0) {
        currentDeck = fisherYatesShuffle(discard);
        discard = [];
        state.showToast('The discard pile was reshuffled back into the Draw Deck!');
      } else {
        state.showToast('No cards remain in the deck or discard pile!');
        return false;
      }
    }

    // Pop 1 card from deck
    const drawnCard = currentDeck.pop();
    if (!drawnCard) return false;

    // Add to active player's hand
    const playerHand = [...(state.playerHands[currentPlayer.id] || []), drawnCard];
    const updatedHands = {
      ...state.playerHands,
      [currentPlayer.id]: playerHand
    };

    // Apply -1 draw penalty as per authoritative rules
    const updatedPlayers = state.players.map((p, idx) => {
      if (idx === state.currentTurnIndex) {
        const penalties = p.drawPenalties + 1;
        const netScore = p.cardPoints + p.stolenPoints - penalties;
        return {
          ...p,
          drawCount: p.drawCount + 1,
          drawPenalties: penalties,
          score: netScore,
          hand: playerHand
        };
      }
      return p;
    });

    // Append log
    const logEntry: BattleLogEntry = {
      id: `log_draw_${Date.now()}`,
      round: state.round,
      turnIndex: state.currentTurnIndex,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      cardName: drawnCard.name,
      category: drawnCard.category,
      points: -1,
      actionType: 'draw',
      message: `${currentPlayer.name} drew a card (-1 penalty). Remaining deck: ${currentDeck.length}.`,
      timestamp: Date.now()
    };

    // Advance turn to next player
    const nextTurnIndex = (state.currentTurnIndex + 1) % state.players.length;
    const nextPlayer = updatedPlayers[nextTurnIndex];
    const turnsCount = state.roundTurnsCount + 1;
    let currentRound = state.round;
    let isGameEnded = false;

    // Check round progression
    if (turnsCount % state.players.length === 0) {
      currentRound++;
      if (currentRound > state.maxRounds) {
        isGameEnded = true;
      }
    }

    set({
      deck: currentDeck,
      discardPile: discard,
      deckCount: currentDeck.length,
      playerHands: updatedHands,
      players: updatedPlayers,
      currentTurnIndex: nextTurnIndex,
      currentTurnPlayerId: nextPlayer.id,
      activeViewingHandPlayerId: nextPlayer.id,
      roundTurnsCount: turnsCount,
      round: currentRound,
      battleLog: [logEntry, ...state.battleLog],
      selectedCardId: null,
      selectedTargetNodeId: null
    });

    state.showToast(`${currentPlayer.name} drew 1 card (-1 pt). It is now ${nextPlayer.name}'s turn.`);

    if (isGameEnded) {
      // Conclude match and compute final rankings
      const sortedScores: FinalScore[] = [...updatedPlayers]
        .map((p, idx) => ({
          player: p,
          rank: idx + 1,
          cardPoints: p.cardPoints,
          stolenPoints: p.stolenPoints,
          drawPenalties: p.drawPenalties,
          totalScore: p.score,
          handCount: (updatedHands[p.id] || []).length,
          rivalStealsCount: p.rivalStealsCount,
          highestCardValue: Math.max(
            0,
            ...(updatedHands[p.id] || []).map((c) => c.points || 0)
          )
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((score, idx) => ({ ...score, rank: idx + 1 }));

      set({
        gameStatus: 'ended',
        finalScores: sortedScores,
        winner: sortedScores[0]?.player
      });
    }

    return true;
  },

  // Authoritative Play Card
  playCardAction: (cardId, targetNodeId, declaredCategory) => {
    const state = get();
    if (state.gameStatus !== 'active') return false;

    const currentPlayer = state.players[state.currentTurnIndex];
    if (!currentPlayer) return false;

    const hand = state.playerHands[currentPlayer.id] || [];
    const cardIndex = hand.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      state.showToast('Card not found in active chronicler hand.');
      return false;
    }

    const card = hand[cardIndex];

    // Check Aadesh card: requires player to declare a category (C, L, M, R)
    const isAadeshCard =
      card.type === 'aadesh' ||
      card.variant === 'aadesh' ||
      card.name.toLowerCase().includes('aadesh');

    if (isAadeshCard && !declaredCategory) {
      // Prompt modal to choose category
      set({ pendingAadeshCardId: cardId });
      return false;
    }

    // Find target node in chain (default to latest node in chain)
    const targetNode = targetNodeId
      ? state.chain.find((node) => node.id === targetNodeId)
      : state.chain[state.chain.length - 1];

    if (!targetNode && state.chain.length > 0) {
      state.showToast('Please select a valid link slot in the chain.');
      return false;
    }

    // Validate legal move via CLeMaR / Wild validator
    if (targetNode) {
      const validation = engineValidator.isValidMove(card, targetNode.card, state.chain);
      if (!validation.valid) {
        state.showToast(`Illegal Move: ${validation.reason}`);
        return false;
      }
    }

    // Trigger visual effect immediately if the accepted card is a Wild Card
    if (isWildCard(card)) {
      get().triggerWildCardEffect(card);
    }

    // Remove from active player's hand
    const updatedHand = hand.filter((_, idx) => idx !== cardIndex);
    const updatedHands = {
      ...state.playerHands,
      [currentPlayer.id]: updatedHand
    };

    // Calculate points and pot
    const awardedPoints = card.points || 0;
    let stolenAmount = 0;
    let newPot = state.pot;
    let customLogMsg = '';
    let rivalStealIncrement = 0;
    let logActionType: BattleLogEntry['actionType'] = 'play';

    if (card.type === 'rival' || card.category === 'Rival' || card.effect === 'steal_pot') {
      stolenAmount = state.pot;
      newPot = 0;
      rivalStealIncrement = 1;
      logActionType = 'rival_steal';
      customLogMsg = `⚔️ RIVAL STRIKE! ${currentPlayer.name} unleashed ${card.name} and stole the entire Imperial Pot (+${stolenAmount} pts)!`;
    } else if (isAadeshCard) {
      logActionType = 'aadesh';
      const cat = declaredCategory || 'C';
      customLogMsg = `📜 AADESH (COMMAND)! ${currentPlayer.name} decreed royal Farman: Next player MUST play category [${cat}] or a Wild card!`;
    } else if (card.type === 'mouna' || card.effect === 'skip_next') {
      logActionType = 'skip';
      customLogMsg = `🤫 MOUNA (SILENCE)! The next player loses their turn entirely and must draw 1 card (-1 pt).`;
    } else if (card.type === 'chakravyuha' || card.effect === 'reverse_order') {
      logActionType = 'reverse';
      customLogMsg = `🌀 CHAKRAVYUHA! Turn order reversed. (No directional shift in 2-Player match).`;
    } else if (card.type === 'crisis') {
      logActionType = 'crisis';
      const defenseReq = card.effect === 'force_region' ? 'Region (R)' : 'Marvel (M)';
      customLogMsg = `⚡ CRISIS! ${card.name} strikes! Next player MUST play a ${defenseReq} card or Wild, or draw 1 card (-1 pt)!`;
    } else {
      // Standard CLeMaR card: Points added to player AND ADDED TO THE POT!
      newPot = state.pot + awardedPoints;
      customLogMsg = `${currentPlayer.name} linked ${card.name} [${card.category}, +${awardedPoints} pts]. Pot is now ${newPot} pts.`;
    }

    // Update player scores
    const updatedPlayers = state.players.map((p, idx) => {
      if (idx === state.currentTurnIndex) {
        const cardPts = p.cardPoints + awardedPoints;
        const stolenPts = p.stolenPoints + stolenAmount;
        const netScore = cardPts + stolenPts - p.drawPenalties - (p.crisisDiscards || 0);
        return {
          ...p,
          cardPoints: cardPts,
          stolenPoints: stolenPts,
          rivalStealsCount: p.rivalStealsCount + rivalStealIncrement,
          highestSingleCard: Math.max(p.highestSingleCard, awardedPoints),
          score: netScore,
          hand: updatedHand
        };
      }
      return p;
    });

    // Create new chain node
    const newNodeId = `chain_node_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    const playedCardObj: PlayedCard = {
      ...card,
      declaredCategory: isAadeshCard ? (declaredCategory || 'C') : undefined,
      instanceId: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      playedByPlayerId: currentPlayer.id,
      playedByPlayerName: currentPlayer.name,
      playedAtRound: state.round
    };

    const newNode: CardNode = {
      id: newNodeId,
      card: playedCardObj,
      parentCardId: targetNode?.id || null,
      childrenCardIds: [],
      depth: (targetNode?.depth || 0) + 1,
      branchIndex: targetNode ? targetNode.childrenCardIds.length : 0
    };

    // Update parent's children list
    const updatedChain = state.chain.map((node) => {
      if (targetNode && node.id === targetNode.id) {
        return {
          ...node,
          childrenCardIds: [...node.childrenCardIds, newNodeId]
        };
      }
      return node;
    });
    updatedChain.push(newNode);

    // Log entry
    const logEntry: BattleLogEntry = {
      id: `log_play_${Date.now()}`,
      round: state.round,
      turnIndex: state.currentTurnIndex,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      cardName: card.name,
      category: isAadeshCard ? (declaredCategory || 'C') : card.category,
      points: awardedPoints,
      actionType: logActionType,
      message: customLogMsg,
      timestamp: Date.now()
    };

    // Check DHARMA empty hand win condition
    if (updatedHand.length === 0) {
      const sortedScores: FinalScore[] = [...updatedPlayers]
        .map((p, idx) => ({
          player: p,
          rank: idx + 1,
          cardPoints: p.cardPoints,
          stolenPoints: p.stolenPoints,
          drawPenalties: p.drawPenalties,
          crisisDiscards: p.crisisDiscards || 0,
          totalScore: p.score,
          handCount: 0,
          rivalStealsCount: p.rivalStealsCount,
          highestCardValue: p.highestSingleCard
        }))
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          if (a.handCount !== b.handCount) return a.handCount - b.handCount;
          if (b.rivalStealsCount !== a.rivalStealsCount) return b.rivalStealsCount - a.rivalStealsCount;
          return b.highestCardValue - a.highestCardValue;
        })
        .map((s, idx) => ({ ...s, rank: idx + 1 }));

      const dharmaLog: BattleLogEntry = {
        id: `log_win_${Date.now()}`,
        round: state.round,
        turnIndex: state.currentTurnIndex,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        cardName: 'DHARMA!',
        category: 'C',
        points: 0,
        actionType: 'play',
        message: `👑 DHARMA DECLARED! ${currentPlayer.name} has emptied their hand and claimed the Imperial Throne!`,
        timestamp: Date.now()
      };

      set({
        chain: updatedChain,
        pot: newPot,
        playerHands: updatedHands,
        players: updatedPlayers,
        lastPlayedCard: playedCardObj,
        battleLog: [dharmaLog, logEntry, ...state.battleLog],
        gameStatus: 'ended',
        finalScores: sortedScores,
        winner: sortedScores[0]?.player,
        pendingAadeshCardId: null
      });
      state.showToast(`👑 DHARMA! ${currentPlayer.name} has won the match!`);
      return true;
    }

    // Advance turn
    let currentDeck = [...state.deck];
    let nextTurnIndex = (state.currentTurnIndex + 1) % state.players.length;
    let extraLog: BattleLogEntry | null = null;

    // Handle Mouna skip
    if (card.type === 'mouna' || card.effect === 'skip_next') {
      const skippedPlayer = updatedPlayers[nextTurnIndex];
      if (currentDeck.length > 0) {
        const penaltyCard = currentDeck.pop();
        if (penaltyCard) {
          updatedHands[skippedPlayer.id] = [...(updatedHands[skippedPlayer.id] || []), penaltyCard];
        }
      }
      skippedPlayer.drawPenalties += 1;
      skippedPlayer.drawCount += 1;
      skippedPlayer.score =
        skippedPlayer.cardPoints +
        skippedPlayer.stolenPoints -
        skippedPlayer.drawPenalties -
        (skippedPlayer.crisisDiscards || 0);

      extraLog = {
        id: `log_skip_${Date.now()}`,
        round: state.round,
        turnIndex: nextTurnIndex,
        playerId: skippedPlayer.id,
        playerName: skippedPlayer.name,
        cardName: 'Mouna (Silence)',
        category: 'Special',
        points: -1,
        actionType: 'skip',
        message: `${skippedPlayer.name} is silenced! Turn lost and drew 1 penalty card (-1 pt).`,
        timestamp: Date.now()
      };
      nextTurnIndex = (nextTurnIndex + 1) % state.players.length;
    }

    const nextPlayer = updatedPlayers[nextTurnIndex];
    const turnsCount = state.roundTurnsCount + 1;
    let currentRound = state.round;
    let isGameEnded = false;

    if (turnsCount % state.players.length === 0) {
      currentRound++;
      if (currentRound > state.maxRounds) {
        isGameEnded = true;
      }
    }

    const combinedLogs = extraLog ? [extraLog, logEntry, ...state.battleLog] : [logEntry, ...state.battleLog];

    set({
      chain: updatedChain,
      pot: newPot,
      deck: currentDeck,
      deckCount: currentDeck.length,
      playerHands: updatedHands,
      players: updatedPlayers,
      lastPlayedCard: playedCardObj,
      currentTurnIndex: nextTurnIndex,
      currentTurnPlayerId: nextPlayer.id,
      activeViewingHandPlayerId: nextPlayer.id,
      roundTurnsCount: turnsCount,
      round: currentRound,
      battleLog: combinedLogs,
      selectedCardId: null,
      selectedTargetNodeId: null,
      pendingAadeshCardId: null
    });

    state.showToast(`Turn flipped to ${nextPlayer.name}! Pot: ${newPot} pts.`);

    if (isGameEnded) {
      const sortedScores: FinalScore[] = [...updatedPlayers]
        .map((p, idx) => ({
          player: p,
          rank: idx + 1,
          cardPoints: p.cardPoints,
          stolenPoints: p.stolenPoints,
          drawPenalties: p.drawPenalties,
          crisisDiscards: p.crisisDiscards || 0,
          totalScore: p.score,
          handCount: (updatedHands[p.id] || []).length,
          rivalStealsCount: p.rivalStealsCount,
          highestCardValue: p.highestSingleCard
        }))
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          if (a.handCount !== b.handCount) return a.handCount - b.handCount;
          if (b.rivalStealsCount !== a.rivalStealsCount) return b.rivalStealsCount - a.rivalStealsCount;
          return b.highestCardValue - a.highestCardValue;
        })
        .map((score, idx) => ({ ...score, rank: idx + 1 }));

      set({
        gameStatus: 'ended',
        finalScores: sortedScores,
        winner: sortedScores[0]?.player
      });
    }

    return true;
  },

  syncSnapshot: (snapshot, playerId) => {
    set((state) => {
      const myPid = playerId || state.myPlayerId;
      const meInSnapshot = snapshot.players.find((p) => p.id === myPid);
      const mappedPlayers: Player[] = snapshot.players.map((sp) => {
        const existing = state.players.find((p) => p.id === sp.id);
        return {
          id: sp.id,
          socketId: existing?.socketId || sp.id,
          name: sp.name,
          avatar: sp.avatar,
          title: sp.title,
          hand: sp.hand || existing?.hand || [],
          score: sp.score,
          cardPoints: sp.cardPoints,
          stolenPoints: sp.stolenPoints,
          drawPenalties: sp.drawPenalties,
          drawCount: existing?.drawCount || 0,
          rivalStealsCount: existing?.rivalStealsCount || 0,
          highestSingleCard: existing?.highestSingleCard || 0,
          isHost: sp.isHost,
          isConnected: sp.isConnected
        };
      });

      return {
        players: mappedPlayers,
        playerHands: {
          ...state.playerHands,
          ...(meInSnapshot?.hand ? { [myPid || 'p1']: meInSnapshot.hand } : {})
        },
        chain: snapshot.chain,
        pot: snapshot.pot,
        currentTurnPlayerId: snapshot.currentTurnPlayerId,
        currentTurnIndex: snapshot.currentTurnIndex,
        round: snapshot.round,
        maxRounds: snapshot.maxRounds,
        turnOrder: snapshot.turnOrder,
        gameStatus: snapshot.gameStatus,
        deckCount: snapshot.deckCount,
        discardCount: snapshot.discardCount,
        battleLog: snapshot.battleLog,
        lastPlayedCard: snapshot.lastPlayedCard,
        finalScores: snapshot.finalScores || state.finalScores,
        winner: snapshot.winner || state.winner
      };
    });
  },

  resetGame: () => {
    clearAllCinematicTimers();
    set({
      chain: [],
      pot: 0,
      round: 1,
      playerHands: {},
      deck: [],
      discardPile: [],
      gameStatus: 'lobby',
      selectedCardId: null,
      selectedTargetNodeId: null,
      battleLog: [],
      finalScores: [],
      winner: undefined,
      wildCinematicCard: null,
      isWildCinematicActive: false,
      isVibrationActive: false,
      isLightningActive: false
    });
  }
}));
