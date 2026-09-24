import {
  BattleLogEntry,
  CardData,
  CardNode,
  FinalScore,
  GameStateSnapshot,
  PlayedCard,
  Player,
  PlayResult
} from './types';
import { DharmaEngine } from './validator';
import { rankPlayers } from './scoring';
import { EraId } from '../src/types/era';
import mahabharatData from '../data/cards-mahabharat.json';
import mughalData from '../data/cards-mughal.json';
import swarajData from '../data/cards-swaraj.json';

export class GameRoom {
  id: string;
  eraId: EraId;
  players: Player[] = [];
  deck: CardData[] = [];
  discardPile: CardData[] = [];
  chain: CardNode[] = [];
  pot: number = 0;
  currentTurnIndex: number = 0;
  round: number = 1;
  maxRounds: number = 7;
  turnOrder: 'clockwise' | 'anticlockwise' = 'clockwise';
  gameStatus: 'lobby' | 'active' | 'ended' = 'lobby';
  skippedPlayers: Set<string> = new Set();
  reshuffleCount: number = 0;
  battleLog: BattleLogEntry[] = [];
  lastPlayedCard: PlayedCard | null = null;
  engine: DharmaEngine;
  turnTimerSeconds: number = 30;
  finalScores: FinalScore[] = [];
  winner?: Player;
  roundTurnsCount: number = 0;

  constructor(id: string, maxRounds: number = 7, eraId: EraId = 'mahabharat') {
    this.id = id;
    this.maxRounds = maxRounds;
    this.eraId = eraId;
    this.engine = new DharmaEngine();
    this.buildDeck();
  }

  buildDeck(): void {
    let dataset: any = mahabharatData;
    if (this.eraId === 'mughal') dataset = mughalData;
    if (this.eraId === 'swaraj') dataset = swarajData;

    const fullDeck: CardData[] = [];

    // 1. Add all 36 Main CLeMaR cards from rulers
    for (const ruler of dataset.rulers) {
      const cards = ruler.cards;
      fullDeck.push({
        ...cards.C,
        type: 'main',
        category: 'C',
        rulerId: ruler.id,
        rulerName: ruler.name
      } as CardData);

      fullDeck.push({
        ...cards.L,
        type: 'main',
        category: 'L',
        rulerId: ruler.id,
        rulerName: ruler.name
      } as CardData);

      fullDeck.push({
        ...cards.M,
        type: 'main',
        category: 'M',
        rulerId: ruler.id,
        rulerName: ruler.name
      } as CardData);

      fullDeck.push({
        ...cards.R,
        type: 'main',
        category: 'R',
        rulerId: ruler.id,
        rulerName: ruler.name
      } as CardData);
    }

    // 2. Add Special Cards according to their counts (16 cards)
    for (const special of dataset.specialCards) {
      for (let i = 0; i < special.count; i++) {
        fullDeck.push({
          id: `${special.id}_${i + 1}`,
          name: special.name,
          type: special.type as any,
          category: special.category as any,
          points: special.points,
          effect: special.effect,
          historicalContext: special.historicalContext
        });
      }
    }

    this.deck = fullDeck;
  }

  addPlayer(
    id: string,
    socketId: string,
    name: string,
    avatar?: string,
    title?: string
  ): Player {
    const existing = this.players.find((p) => p.id === id);
    if (existing) {
      existing.socketId = socketId;
      existing.isConnected = true;
      if (existing.disconnectTimeout) {
        clearTimeout(existing.disconnectTimeout);
        existing.disconnectTimeout = null;
      }
      return existing;
    }

    const defaultAvatars = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDymQwMlQaKPhgvvTwA8VSEI4tWFd3aXNp9ozXymU18gu1MF3LdUD45IHg-DP3xKzgM_oiELxmmshyqJ32GU3lAMsk_sYlurRrBMJx_9XlYePtS2wPgNakd9LalyiY7uEazgJh_DDbp_doXWngenoou1GDlcCOpx7mUGRX178AEBCEnpqn82ZSl28UYcDdd0xr_8qWRXDzObzrdmI6KY-ftamUzsnfFnKMj0-lWr0XKDZU6Mj3AvgIq-bS_0liOcw-ckw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDWPrwrI-0gZ_BzSZ4uGXmVxISiKOyRzt4ftCXRxtmjHmP7aGrzWBt8FP6e-lESupZPEZ3OxWGf2D3fN8P1nhPIQDE2fB1TkZ9xRskfgqYTHDKhUoH4g-PNQoiwGczyuS2YftEhJUKXNSHwcM444FGTjuDP7R9KCaK3w11SzCCuE-4x6f7KVSiDvcZG8OLsGz1mT_2ubmXX4gqMzNt8r-NEj-gYspEIbe-1_Pk3wU6N-N2XweYm99IvN0uJozTgtPolaw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeAHnVvNGmQjBaBdNixyPy_waauSnUsbxX6NU5f4rxVhssem3rQGEYTxKtlTpKf7ernzjU6lV3TDcb2cZ143CV1IaTFV7bHBOjIITKA6tt3bD-O1jU9OVypKTKn6KYO6ql8Tv__XWENGg9hgnS3NkPZ0YsUlKsr8_KjuOYwQgexhQxgeEkXryToCaA2QRC7SqnBsdr82K8whQ4ZDrgAPd6pGvrWg_k_rGexMb9Tcju92Oeux1o2VB9vipEJ8oZN-LY3w',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Hcecxwko7ix2WZvFmIS0VhmxhRuLi3WT5_ChfeKQUflOtWAIJLfMkyJMDFMUznQ7Kh5pfOreJDeJz85jd6Fg0yw-i4g3MxbcqeuL4rmdye41Mr3zgGq_0iXAxki1LN0vGSawL8fOuku_3tBOSw1c5-GcQ-DHMuBxY0BllMZbLMczNh1e0A0y6YucIepRt5BmkJUgKmFJCPmA6s4q8suIVe4fMODBWDSsN-7Fw1zNGp68M8oLU_5ee3ac_RG4QXBaww'
    ];

    const defaultTitles = ['Mughal Wazir', 'Rajput Diwan', 'Deccan Subahdar', 'Imperial Chronicler'];

    const index = this.players.length;
    const player: Player = {
      id,
      socketId,
      name: name.trim() || `Chronicler ${index + 1}`,
      avatar: avatar || defaultAvatars[index % defaultAvatars.length],
      title: title || defaultTitles[index % defaultTitles.length],
      hand: [],
      score: 0,
      cardPoints: 0,
      stolenPoints: 0,
      drawPenalties: 0,
      drawCount: 0,
      rivalStealsCount: 0,
      highestSingleCard: 0,
      isHost: index === 0,
      isConnected: true,
      disconnectTimeout: null
    };

    this.players.push(player);
    return player;
  }

  // Fisher-Yates shuffle
  shuffleDeck(cards: CardData[]): CardData[] {
    const arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  dealCards(): void {
    this.deck = this.shuffleDeck(this.deck);
    this.discardPile = [];
    this.chain = [];
    this.pot = 0;
    this.round = 1;
    this.currentTurnIndex = 0;
    this.turnOrder = 'clockwise';
    this.skippedPlayers.clear();
    this.reshuffleCount = 0;
    this.battleLog = [];
    this.roundTurnsCount = 0;

    // Reset scores
    for (const player of this.players) {
      player.hand = [];
      player.score = 0;
      player.cardPoints = 0;
      player.stolenPoints = 0;
      player.drawPenalties = 0;
      player.drawCount = 0;
      player.rivalStealsCount = 0;
      player.highestSingleCard = 0;
    }

    // Deal 5 cards to each player
    const handSize = 5;
    for (let i = 0; i < handSize; i++) {
      for (const player of this.players) {
        const card = this.deck.pop();
        if (card) player.hand.push(card);
      }
    }

    // Flip top card as Base Card (0 points, serves only as anchor)
    let starterCard: CardData | undefined;
    // Prefer a Creator (C) or Marvel/Region/Legislature card as Base
    const candidateIdx = this.deck.findIndex((c) => c.type === 'main' && c.category === 'C');
    if (candidateIdx !== -1) {
      starterCard = this.deck.splice(candidateIdx, 1)[0];
    } else {
      starterCard = this.deck.pop();
    }

    if (!starterCard) {
      starterCard = {
        id: 'c_akbar',
        name: 'Akbar',
        category: 'C',
        points: 8,
        rulerId: 'akbar',
        rulerName: 'Akbar',
        type: 'main',
        historicalDetail: 'Foundational Base Card (0 pts)'
      };
    }

    const basePlayedCard: PlayedCard = {
      ...starterCard,
      instanceId: `base_${Date.now()}`,
      points: 0, // CRITICAL RULE: Base Card is worth 0 points!
      playedByPlayerId: 'system',
      playedByPlayerName: 'Imperial Court (Base)',
      playedAtRound: 1
    };

    const baseNode: CardNode = {
      id: basePlayedCard.instanceId,
      card: basePlayedCard,
      parentCardId: null,
      childrenCardIds: [],
      depth: 0,
      branchIndex: 0
    };

    this.chain.push(baseNode);
    this.lastPlayedCard = basePlayedCard;
    this.gameStatus = 'active';

    this.logAction({
      actionType: 'play',
      playerId: 'system',
      playerName: 'Court',
      cardName: starterCard.name,
      category: starterCard.category,
      points: 0,
      message: `The Yuga begins! Base Anchor revealed: ${starterCard.name} (${starterCard.category}, 0 pts).`
    });
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentTurnIndex];
  }

  getNextPlayerIndex(): number {
    const total = this.players.length;
    if (this.turnOrder === 'clockwise') {
      return (this.currentTurnIndex + 1) % total;
    } else {
      return (this.currentTurnIndex - 1 + total) % total;
    }
  }

  playCard(playerId: string, cardId: string, targetNodeId: string): PlayResult {
    if (this.gameStatus !== 'active') {
      return { success: false, message: 'Game is not active' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return { success: false, message: `It is not your turn (Current turn: ${currentPlayer.name})` };
    }

    const cardIndex = currentPlayer.hand.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) {
      return { success: false, message: 'Card not found in your hand' };
    }
    const cardToPlay = currentPlayer.hand[cardIndex];

    const targetNode = this.chain.find((node) => node.id === targetNodeId);
    if (!targetNode) {
      return { success: false, message: 'Target node in chain not found' };
    }

    // Validate move against target
    const validation = this.engine.isValidMove(cardToPlay, targetNode.card, this.chain);
    if (!validation.valid) {
      return { success: false, message: validation.reason || 'Invalid connection' };
    }

    // Legal move! Remove from hand
    currentPlayer.hand.splice(cardIndex, 1);

    const playedCard: PlayedCard = {
      ...cardToPlay,
      instanceId: `card_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      playedByPlayerId: currentPlayer.id,
      playedByPlayerName: currentPlayer.name,
      playedAtRound: this.round
    };

    const newNode: CardNode = {
      id: playedCard.instanceId,
      card: playedCard,
      parentCardId: targetNode.id,
      childrenCardIds: [],
      depth: targetNode.depth + 1,
      branchIndex: targetNode.childrenCardIds.length
    };
    targetNode.childrenCardIds.push(newNode.id);
    this.chain.push(newNode);
    this.lastPlayedCard = playedCard;

    const potBefore = this.pot;
    let effectApplied: string | undefined;

    // Standard card points
    if (playedCard.type === 'main') {
      const earned = playedCard.points;
      currentPlayer.cardPoints += earned;
      this.pot += earned;
      if (earned > currentPlayer.highestSingleCard) {
        currentPlayer.highestSingleCard = earned;
      }
      this.logAction({
        actionType: 'play',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        cardName: playedCard.name,
        category: playedCard.category,
        points: earned,
        targetCardName: targetNode.card.name,
        message: `${currentPlayer.name} connected ${playedCard.name} [${playedCard.category}, +${earned}] onto ${targetNode.card.name}. Pot increases to ${this.pot}.`
      });
    }

    // Special card effects
    if (playedCard.type === 'rival') {
      effectApplied = 'steal_pot';
      const stolen = this.pot;
      currentPlayer.stolenPoints += stolen;
      currentPlayer.rivalStealsCount += 1;
      this.pot = 0;
      this.logAction({
        actionType: 'rival_steal',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        cardName: playedCard.name,
        category: 'Rival',
        points: stolen,
        targetCardName: targetNode.card.name,
        effect: 'steal_pot',
        message: `⚡ RIVAL STRIKE! ${currentPlayer.name} played ${playedCard.name} and stole the ENTIRE POT (${stolen} pts)!`
      });
    } else if (playedCard.type === 'mahaKarma') {
      effectApplied = 'steal_last_card';
      // Steals points of the last played card (the immediate previous card on the table)
      const prevNode = this.chain.length >= 2 ? this.chain[this.chain.length - 2] : null;
      const targetPoints = prevNode && !prevNode.card.isNullified ? prevNode.card.points : 0;
      const stolen = Math.min(targetPoints, this.pot);
      currentPlayer.stolenPoints += targetPoints;
      this.pot = Math.max(0, this.pot - stolen);
      this.logAction({
        actionType: 'karma_steal',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        cardName: playedCard.name,
        category: 'Maha-Karma',
        points: targetPoints,
        effect: 'steal_last_card',
        message: `🕉 MAHA-KARMA ACTIVATED! ${currentPlayer.name} struck with cosmic balance, claiming ${targetPoints} pts!`
      });
    } else if (playedCard.type === 'mouna') {
      effectApplied = 'skip_next';
      const nextIdx = this.getNextPlayerIndex();
      const victim = this.players[nextIdx];
      this.skippedPlayers.add(victim.id);
      // Victim draws 1 card with -1 penalty as per Section 5 & Edge Case 8
      if (this.deck.length > 0) {
        const penaltyCard = this.deck.pop()!;
        victim.hand.push(penaltyCard);
      }
      victim.drawPenalties += 1;
      victim.drawCount += 1;
      victim.score = this.calculatePlayerScore(victim);
      this.logAction({
        actionType: 'skip',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        cardName: 'Mouna (Skip)',
        category: 'Action',
        points: 0,
        effect: 'skip_next',
        message: `🤫 MOUNA (SILENCE)! ${victim.name} is silenced, loses their turn, and draws 1 penalty card (-1 pt)!`
      });
    } else if (playedCard.type === 'chakravyuha') {
      effectApplied = 'reverse_order';
      if (this.players.length === 2) {
        // Edge case: In 2-player mode, reverse has no practical sequence change
        this.logAction({
          actionType: 'reverse',
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          cardName: 'Chakravyuha',
          category: 'Action',
          points: 0,
          effect: 'reverse_order',
          message: `🌀 Chakravyuha deployed! (No turn-order shift in 2-Player Duel).`
        });
      } else {
        this.turnOrder = this.turnOrder === 'clockwise' ? 'anticlockwise' : 'clockwise';
        this.logAction({
          actionType: 'reverse',
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          cardName: 'Chakravyuha',
          category: 'Action',
          points: 0,
          effect: 'reverse_order',
          message: `🌀 CHAKRAVYUHA! Turn order reversed to ${this.turnOrder.toUpperCase()}!`
        });
      }
    } else if (playedCard.type === 'crisis') {
      effectApplied = playedCard.effect;
      // Nullify target node if matches
      if (
        (playedCard.effect === 'nullify_region' && targetNode.card.category === 'R') ||
        (playedCard.effect === 'nullify_marvel' && targetNode.card.category === 'M')
      ) {
        targetNode.card.isNullified = true;
        const nullifiedPoints = targetNode.card.points;
        this.pot = Math.max(0, this.pot - nullifiedPoints);

        // Find the owner of that card and penalize
        const originalOwner = this.players.find((p) => p.id === targetNode.card.playedByPlayerId);
        if (originalOwner) {
          originalOwner.cardPoints = Math.max(0, originalOwner.cardPoints - nullifiedPoints);
          if (this.deck.length > 0) {
            const extra = this.deck.pop()!;
            originalOwner.hand.push(extra);
          }
          originalOwner.drawPenalties += 1;
          originalOwner.drawCount += 1;
          originalOwner.score = this.calculatePlayerScore(originalOwner);
        }

        this.logAction({
          actionType: 'crisis',
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          cardName: playedCard.name,
          category: 'Crisis',
          points: 0,
          effect: playedCard.effect,
          message: `⚡ CRISIS! ${playedCard.name} nullified ${targetNode.card.name} (-${nullifiedPoints} pts)!`
        });
      }
    }

    // Update player's cached total score
    currentPlayer.score = this.calculatePlayerScore(currentPlayer);

    // Check WINNING CONDITION 1: Player empties hand completely ("DHARMA!")
    if (currentPlayer.hand.length === 0) {
      this.logAction({
        actionType: 'play',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        cardName: 'DHARMA CALL',
        category: 'DHARMA',
        points: 0,
        message: `👑 DHARMA! ${currentPlayer.name} emptied their hand completely!`
      });
      this.endGame();
      return {
        success: true,
        message: 'DHARMA declared! Game concluded.',
        card: playedCard,
        targetNodeId,
        effectApplied,
        pointsAwarded: playedCard.points,
        potBefore,
        potAfter: this.pot,
        gameEnded: true,
        winner: this.winner
      };
    }

    // Advance turn
    this.advanceTurn();

    return {
      success: true,
      message: 'Card played successfully',
      card: playedCard,
      targetNodeId,
      effectApplied,
      pointsAwarded: playedCard.points,
      potBefore,
      potAfter: this.pot,
      gameEnded: (this.gameStatus as string) === 'ended',
      winner: this.winner
    };
  }

  drawCard(playerId: string): PlayResult {
    if (this.gameStatus !== 'active') {
      return { success: false, message: 'Game is not active' };
    }

    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId) {
      return { success: false, message: 'Not your turn' };
    }

    // If deck empty, reshuffle discard pile
    if (this.deck.length === 0) {
      if (this.discardPile.length > 0) {
        this.deck = this.shuffleDeck(this.discardPile);
        this.discardPile = [];
        this.reshuffleCount += 1;
        this.logAction({
          actionType: 'reshuffle',
          playerId: 'system',
          playerName: 'Court',
          cardName: 'Reshuffle',
          category: 'Deck',
          points: 0,
          message: `Draw pile exhausted! Discard pile reshuffled (${this.reshuffleCount}/3).`
        });

        // WINNING CONDITION 2: Draw pile exhausted & reshuffled 3 times
        if (this.reshuffleCount >= 3) {
          this.logAction({
            actionType: 'reshuffle',
            playerId: 'system',
            playerName: 'Court',
            cardName: 'Endgame',
            category: 'Deck',
            points: 0,
            message: 'Draw pile exhausted 3 times! Imperial Chronicle terminates.'
          });
          this.endGame();
          return { success: true, message: 'Game ended after 3 reshuffles', gameEnded: true, winner: this.winner };
        }
      } else {
        // No cards left to draw at all
        this.advanceTurn();
        return { success: true, message: 'No cards available in deck' };
      }
    }

    const drawnCard = this.deck.pop();
    if (drawnCard) {
      currentPlayer.hand.push(drawnCard);
      // Rule: -1 point penalty per card drawn
      currentPlayer.drawPenalties += 1;
      currentPlayer.drawCount += 1;
      currentPlayer.score = this.calculatePlayerScore(currentPlayer);

      this.logAction({
        actionType: 'draw',
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        cardName: 'Drawn Card',
        category: 'Deck',
        points: -1,
        message: `${currentPlayer.name} drew a card (-1 penalty). Remaining deck: ${this.deck.length}.`
      });
    }

    this.advanceTurn();

    return {
      success: true,
      message: 'Card drawn successfully',
      gameEnded: (this.gameStatus as string) === 'ended',
      winner: this.winner
    };
  }

  advanceTurn(): void {
    this.roundTurnsCount++;

    // Advance index
    this.currentTurnIndex = this.getNextPlayerIndex();

    // Check if the current player is skipped (due to Mouna)
    const nextPlayer = this.getCurrentPlayer();
    if (this.skippedPlayers.has(nextPlayer.id)) {
      this.skippedPlayers.delete(nextPlayer.id);
      this.logAction({
        actionType: 'skip',
        playerId: nextPlayer.id,
        playerName: nextPlayer.name,
        cardName: 'Mouna Skip Effect',
        category: 'Action',
        points: 0,
        message: `${nextPlayer.name}'s turn was skipped by Mouna!`
      });
      // Move past the skipped player
      this.advanceTurn();
      return;
    }

    // Check if round complete (every player took a turn)
    if (this.roundTurnsCount >= this.players.length) {
      this.roundTurnsCount = 0;
      this.round++;
      if (this.round > this.maxRounds) {
        this.endGame();
      }
    }
  }

  calculatePlayerScore(player: Player): number {
    return player.cardPoints + player.stolenPoints - player.drawPenalties;
  }

  endGame(): FinalScore[] {
    this.gameStatus = 'ended';
    for (const p of this.players) {
      p.score = this.calculatePlayerScore(p);
    }
    this.finalScores = rankPlayers(this.players);
    if (this.finalScores.length > 0) {
      this.winner = this.finalScores[0].player;
    }
    this.logAction({
      actionType: 'play',
      playerId: 'system',
      playerName: 'Emperor',
      cardName: 'Chronicle Sealed',
      category: 'Victory',
      points: 0,
      message: `🏆 MATCH CONCLUDED! Winner: ${this.winner?.name} with ${this.finalScores[0]?.totalScore} points!`
    });
    return this.finalScores;
  }

  logAction(entry: Omit<BattleLogEntry, 'id' | 'round' | 'turnIndex' | 'timestamp'>): void {
    const fullEntry: BattleLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      round: this.round,
      turnIndex: this.currentTurnIndex,
      timestamp: Date.now(),
      ...entry
    };
    this.battleLog.unshift(fullEntry);
    if (this.battleLog.length > 50) {
      this.battleLog.pop();
    }
  }

  getSnapshot(forPlayerId?: string): GameStateSnapshot {
    return {
      id: this.id,
      players: this.players.map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        title: p.title,
        cardCount: p.hand.length,
        score: this.calculatePlayerScore(p),
        cardPoints: p.cardPoints,
        stolenPoints: p.stolenPoints,
        drawPenalties: p.drawPenalties,
        isHost: p.isHost,
        isConnected: p.isConnected,
        hand: forPlayerId === p.id ? p.hand : undefined
      })),
      chain: this.chain,
      pot: this.pot,
      currentTurnPlayerId: this.getCurrentPlayer() ? this.getCurrentPlayer().id : '',
      currentTurnIndex: this.currentTurnIndex,
      round: Math.min(this.round, this.maxRounds),
      maxRounds: this.maxRounds,
      turnOrder: this.turnOrder,
      gameStatus: this.gameStatus,
      deckCount: this.deck.length,
      discardCount: this.discardPile.length,
      reshuffleCount: this.reshuffleCount,
      battleLog: this.battleLog,
      lastPlayedCard: this.lastPlayedCard,
      finalScores: this.gameStatus === 'ended' ? this.finalScores : undefined,
      winner: this.winner
    };
  }
}
