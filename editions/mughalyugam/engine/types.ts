export type CardCategory = 'C' | 'L' | 'Le' | 'M' | 'Ma' | 'R' | 'Rival' | 'Special';

export type SpecialCardType =
  | 'main'
  | 'rival'
  | 'aadesh'
  | 'mahaKarma'
  | 'karma'
  | 'mouna'
  | 'chakravyuha'
  | 'chakra'
  | 'crisis';

export interface CardData {
  id: string;
  name: string;
  category: CardCategory;
  points: number;
  ruler?: string | null;
  rulerId?: string;
  rulerName?: string;
  symbol?: string;
  immediateFather?: string | null;
  immediateSon?: string | null;
  detail?: string;
  variant?: string;
  type: SpecialCardType;
  effect?: string;
  itemType?: string;
  historicalDetail?: string;
  historicalContext?: string;
  image?: string;
  declaredCategory?: 'C' | 'L' | 'M' | 'R' | null;
}

export interface RulerCardSet {
  C: CardData;
  L: CardData;
  M: CardData;
  R: CardData;
}

export interface Ruler {
  id: string;
  name: string;
  father: string | null;
  son: string | null;
  cards: RulerCardSet;
}

export interface PlayedCard extends CardData {
  instanceId: string;
  playedByPlayerId: string;
  playedByPlayerName: string;
  playedAtRound: number;
  isNullified?: boolean;
  declaredCategory?: 'C' | 'L' | 'M' | 'R' | null;
}

export interface CardNode {
  id: string;
  card: PlayedCard;
  parentCardId: string | null;
  childrenCardIds: string[];
  depth: number;
  branchIndex?: number;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  matchType?: 'ruler' | 'category' | 'wild' | 'aadesh_match' | 'crisis_match' | 'other_wild';
}

export interface Player {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  title: string;
  hand: CardData[];
  score: number;
  cardPoints: number;
  stolenPoints: number;
  drawPenalties: number;
  drawCount: number;
  crisisDiscards?: number;
  rivalStealsCount: number;
  highestSingleCard: number;
  isHost: boolean;
  isConnected: boolean;
  disconnectTimeout?: NodeJS.Timeout | null;
}

export interface PlayResult {
  success: boolean;
  message: string;
  card?: PlayedCard;
  targetNodeId?: string;
  effectApplied?: string;
  pointsAwarded?: number;
  potBefore?: number;
  potAfter?: number;
  gameEnded?: boolean;
  winner?: Player;
}

export interface FinalScore {
  player: Player;
  rank: number;
  totalScore: number;
  cardPoints: number;
  stolenPoints: number;
  drawPenalties: number;
  handCount: number;
  rivalStealsCount: number;
  highestCardValue: number;
  crisisDiscards?: number;
}

export interface BattleLogEntry {
  id: string;
  round: number;
  turnIndex: number;
  playerId: string;
  playerName: string;
  cardName: string;
  category: string;
  points: number;
  effect?: string;
  targetCardName?: string;
  actionType: 'play' | 'draw' | 'rival_steal' | 'aadesh' | 'karma_steal' | 'skip' | 'reverse' | 'crisis' | 'reshuffle';
  message: string;
  timestamp: number;
}

export interface GameStateSnapshot {
  id: string;
  players: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    cardCount: number;
    score: number;
    cardPoints: number;
    stolenPoints: number;
    drawPenalties: number;
    isHost: boolean;
    isConnected: boolean;
    hand?: CardData[]; // sent only to the respective player
  }[];
  chain: CardNode[];
  pot: number;
  currentTurnPlayerId: string;
  currentTurnIndex: number;
  round: number;
  maxRounds: number;
  turnOrder: 'clockwise' | 'anticlockwise';
  gameStatus: 'lobby' | 'active' | 'ended';
  deckCount: number;
  discardCount: number;
  reshuffleCount: number;
  battleLog: BattleLogEntry[];
  lastPlayedCard: PlayedCard | null;
  finalScores?: FinalScore[];
  winner?: Player;
  roundCompleteToast?: string;
}
