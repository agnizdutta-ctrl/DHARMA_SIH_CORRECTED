import { CardData, CardNode, PlayedCard, Ruler, ValidationResult } from './types';
import cardsData from '../data/cards.json';

export function isWildCard(card?: CardData | PlayedCard | null): boolean {
  if (!card) return false;
  if (card.category === 'Special' || card.category === 'Rival') return true;
  const wildTypes = ['rival', 'aadesh', 'mouna', 'chakravyuha', 'crisis', 'mahaKarma'];
  if (wildTypes.includes(card.type) || wildTypes.includes(card.variant || '')) return true;
  if (card.points === 0 && !card.rulerId && !card.ruler) return true;
  return false;
}

export function normalizeCategory(category?: string | null): 'C' | 'L' | 'M' | 'R' | string {
  if (!category) return '';
  if (category === 'Le' || category === 'L') return 'L';
  if (category === 'Ma' || category === 'M') return 'M';
  return category;
}

export function normalizeRulerStr(str?: string | null): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class DharmaEngine {
  private rulers: Map<string, Ruler>;

  constructor() {
    this.rulers = new Map<string, Ruler>();
    for (const r of cardsData.rulers) {
      this.rulers.set(r.id, r as unknown as Ruler);
    }
  }

  getRuler(rulerId?: string): Ruler | undefined {
    if (!rulerId) return undefined;
    return this.rulers.get(rulerId);
  }

  /**
   * THE COMPLETE MATCH LOGIC (ONE FUNCTION)
   *
   * MATCH(card, topCard):
   * 1. If card is Wild → VALID
   * 2. If topCard is Aadesh → check if card.category == Aadesh.declaredCategory
   * 3. If topCard is Crisis: Famine → check if card.category == 'R'
   * 4. If topCard is Crisis: Nadir Shah → check if card.category == 'M'
   * 5. If topCard is other Wild → any card can be played next
   * 6. If card.rulerId == topCard.rulerId → VALID
   * 7. If card.category == topCard.category → VALID
   * 8. Otherwise → INVALID
   */
  isValidMove(
    playedCard: CardData,
    targetCard: PlayedCard,
    chain?: CardNode[]
  ): ValidationResult {
    if (!playedCard || !targetCard) {
      return { valid: false, reason: 'Invalid card reference' };
    }

    // Match 3 — Wild Card: If you play any Wild card, it is always legal regardless of what is on the table
    if (isWildCard(playedCard)) {
      return {
        valid: true,
        reason: 'Wild cards match anything',
        matchType: 'wild'
      };
    }

    const playedCat = normalizeCategory(playedCard.category);
    const targetCat = normalizeCategory(targetCard.category);

    const isTopAadesh =
      targetCard.type === 'aadesh' ||
      targetCard.variant === 'aadesh' ||
      (targetCard.name && targetCard.name.toLowerCase().includes('aadesh'));

    // If topCard is Aadesh → check if card.category == Aadesh.declaredCategory
    if (isTopAadesh) {
      const declared = normalizeCategory(targetCard.declaredCategory || 'C');
      if (playedCat === declared) {
        return {
          valid: true,
          reason: `Imperial Decree fulfilled: Declared category is ${declared}`,
          matchType: 'aadesh_match'
        };
      }
      return {
        valid: false,
        reason: `Aadesh Farman requires a ${declared} category card or a Wild card`
      };
    }

    // If topCard is Crisis: Famine → forces next player to play Region (R) or Wild
    const isCrisisFamine =
      targetCard.type === 'crisis' &&
      (targetCard.effect === 'force_region' ||
        targetCard.name.toLowerCase().includes('famine'));

    if (isCrisisFamine) {
      if (playedCat === 'R') {
        return {
          valid: true,
          reason: 'Region (R) card satisfies the Famine Crisis',
          matchType: 'crisis_match'
        };
      }
      return {
        valid: false,
        reason: 'Crisis: Famine requires a Region (R) card or a Wild card'
      };
    }

    // If topCard is Crisis: Nadir Shah → forces next player to play Marvel (M) or Wild
    const isCrisisNadir =
      targetCard.type === 'crisis' &&
      (targetCard.effect === 'force_marvel' ||
        targetCard.name.toLowerCase().includes('nadir'));

    if (isCrisisNadir) {
      if (playedCat === 'M') {
        return {
          valid: true,
          reason: 'Marvel (M) card satisfies the Nadir Shah Crisis',
          matchType: 'crisis_match'
        };
      }
      return {
        valid: false,
        reason: 'Crisis: Nadir Shah requires a Marvel (M) card or a Wild card'
      };
    }

    // If topCard is other Wild (Shivaji, Maharana Pratap, Mouna, Chakravyuha) → any card can be played next
    if (isWildCard(targetCard)) {
      return {
        valid: true,
        reason: 'Any card can be played on an open Wild card',
        matchType: 'other_wild'
      };
    }

    // Match 1 — Same Ruler
    const pRulerId = normalizeRulerStr(playedCard.rulerId || playedCard.ruler || playedCard.rulerName);
    const tRulerId = normalizeRulerStr(targetCard.rulerId || targetCard.ruler || targetCard.rulerName);

    if (pRulerId && tRulerId && pRulerId === tRulerId) {
      return {
        valid: true,
        reason: `Match 1: Same Ruler (${targetCard.ruler || targetCard.rulerName || 'Dynasty'})`,
        matchType: 'ruler'
      };
    }

    // Match 2 — Same Category (C on C, L on L, M on M, R on R)
    if (playedCat && targetCat && playedCat === targetCat) {
      return {
        valid: true,
        reason: `Match 2: Same Category (${targetCat})`,
        matchType: 'category'
      };
    }

    return {
      valid: false,
      reason: `${playedCard.name} (${playedCat}) cannot play on ${targetCard.name} (${targetCat}). Must match Ruler, Category, or play Wild.`
    };
  }

  /**
   * Returns legal target nodes for handCard in the current chain.
   * In standard play, the primary target is the top card (last card in chain).
   */
  getLegalTargets(handCard: CardData, chain: CardNode[]): CardNode[] {
    if (!chain || chain.length === 0) return [];
    const topNode = chain[chain.length - 1];
    if (topNode && this.isValidMove(handCard, topNode.card, chain).valid) {
      return [topNode];
    }
    return [];
  }
}

export const defaultEngine = new DharmaEngine();

