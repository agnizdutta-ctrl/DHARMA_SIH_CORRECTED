import { FinalScore, Player } from './types';

export function calculatePlayerScore(player: Player): number {
  return player.cardPoints + player.stolenPoints - player.drawPenalties - (player.crisisDiscards || 0);
}

export function rankPlayers(players: Player[]): FinalScore[] {
  const scores: FinalScore[] = players.map((p) => {
    const total = calculatePlayerScore(p);
    return {
      player: p,
      rank: 1,
      totalScore: total,
      cardPoints: p.cardPoints,
      stolenPoints: p.stolenPoints,
      drawPenalties: p.drawPenalties,
      crisisDiscards: p.crisisDiscards || 0,
      handCount: p.hand.length,
      rivalStealsCount: p.rivalStealsCount,
      highestCardValue: p.highestSingleCard,
    };
  });

  scores.sort((a, b) => {
    // 1. Total score descending
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    // 2. Tie-Breaker 1: Fewest cards remaining in hand
    if (a.handCount !== b.handCount) {
      return a.handCount - b.handCount;
    }
    // 3. Tie-Breaker 2: Most successful Rival steals
    if (b.rivalStealsCount !== a.rivalStealsCount) {
      return b.rivalStealsCount - a.rivalStealsCount;
    }
    // 4. Tie-Breaker 3: Highest single-card value in final chain
    return b.highestCardValue - a.highestCardValue;
  });

  scores.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return scores;
}
