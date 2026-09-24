import { CardData } from './types';
import { OFFICIAL_52_CARDS } from './cardsList';

// Authentic Mughal art miniatures
const CARD_ART_MAP: Record<string, string> = {
  // Babur
  c1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNySI9sGEb3xecl4q4rFfl0vJOGU_Vf9htj2-NUlE-gFSeVR9vxGk8RefLA_nnxFFE1_zZReCViwIi2l468aPW3qLLLQKLfHdf4MYTBocwK4AsufKRpUxe-zp5Pdnip5pTGErF0GxzzUrNadRO9G5Gy0Mu_240TRMkqxnSN5_JwexGw70UIMuiGPjBBZTJhNBwN-eZ2l95HFX-u7Wl-SIb4d094l4OSoVoevgouhIGEnU5FnDGecg9N2Cwu4ZO5auGfA',
  le1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdn9hFAP4XyJTgnHcBZCKI2Est44b4NaTWLJGChb929N3-VOReI2kHkYNUHe0xcrjk81Ve4p5RX2O4Obw39T4ELwcSCl9QQBvxMWzsSRxTU38hlnYBd_xp_7VTWdd18Uw40cnW9Spgd9X4LvGGt-raE74-y9Oe-1LqotHOfuICYLuExQ5WSQ5DaWYHP8DgnnT5LZb498gCkgWxs-T8MMFQeucDUFvd1MrjvSjIxhjnASEWYz1PUlyRKDNdIuKGUCuGw',
  ma1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdDzI8K0pS-CQJ850URG3QWa_G-dA2uB8psAqA_eC3XuCJL-He_t-iAia8-92PCuUd4enSFmMw0laVj-g9Ex_8QaJ-RXsWmBi8pWoOgdlY8dJRc7fUCcPVFJj4Hl5fBMJV35XnBBib2YZG9JpU_AQzTl3F62oZwxJbQ6CdzrnMkxJwUuj524GX1n_lX7dVB47dlxC1KJV9q1ky2hY0v24UkCYrcIBF45opSdVrEKcX3FfQT18oUukGIdFSMYFK-i-CtA',
  r1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhc3VsXXQdfc7rmoLtnIGDtgxcQrpHVCRN4pP7uwvtZHGHdloSbxF17e6TgYUZeLT_iQU5SWzmDgDtzRq6aJcCknmL4vqTbSotU94TlQC_9pdKPXDH9qDuJyM_9ObntZEyPtenS4CTb9UuJwre7EEVCf7kkjQxZ_6fSg2mLUHbzmaQyjckavmmoR_stOmcfpTdHWmlCp6oQpWElk1PbUvRBtoiQmvxwlMHk_ghx7WNSsXFrhzl_TFwk1UgzYPMekthfQ',

  // Humayun
  c2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2_-slpiw4IVnlex-IDo_Em0DtOyhzjfenGvRQanUXyjdNQLsgHJtHGY-YPEoF-UoCsP5XzFzW2aw4BSnZt8zrAwkOuk6dhEKZPH9pozwN2kp8yE5KEOKFHIBAksnOF30TGf8afu20lMcQWESpodzqStOPQCdBmJFgXgBzDDBGygtpejnp121wjECK1Ze8_bSgNBHXexN0aML0klqhDVytHMcwUirb-39L0cxL1yg1gG5F1bqm6K1FImgnGKby6EHOWw',
  // Akbar
  c3: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdDzI8K0pS-CQJ850URG3QWa_G-dA2uB8psAqA_eC3XuCJL-He_t-iAia8-92PCuUd4enSFmMw0laVj-g9Ex_8QaJ-RXsWmBi8pWoOgdlY8dJRc7fUCcPVFJj4Hl5fBMJV35XnBBib2YZG9JpU_AQzTl3F62oZwxJbQ6CdzrnMkxJwUuj524GX1n_lX7dVB47dlxC1KJV9q1ky2hY0v24UkCYrcIBF45opSdVrEKcX3FfQT18oUukGIdFSMYFK-i-CtA',
  // Jahangir
  c4: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyPIzJqnEc1hwIVqBvderQUP1o9WWGal_E51IrTEa12KHOLUYBfU49RGWpQ1ItNp-oIwnGRYZMN8Et4qsXakC348l4sMk6S0p8jvYFH2CuNZ9Lf1_xDM52U9Nv5mzwaVZID3B7Ek8lq_nUTeo860hnMg3gOrx1LIWjgd5T32-SHpH3H9UycHoyyVplqfHFUeK9Sb-MFrWBjkpxfegUtVgVAFY4aRMqr8yn5-8AlGfihgyd2QsOtNjBdg7wbd4CCKUWuQ',
  // Shah Jahan
  c5: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBakLoUrnWdmpFHIxhugdOQ8G3spz1n89MDTOxAFSuI2vVGPXLXFsnTJmJQwAtGqL4-BfgR4tHo2Yl_VV9agFdLYttb0JfbaUtHN2eZq2bWI9LelyH-PyQNAZluGcPQIH6BMdOacUF_whg-rgScrxo2TWp-68uSkO3i2WvUSkbMOPOZqN8g9dLExGK0sgpTrG-shUyBHU0uGlYGVIQUeKf0_rrh1Xrxfs5m8iRPTMM35__pYxmjP13YTKbTIXc2NjM2jQ',
  // Aurangzeb
  c6: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWPrwrI-0gZ_BzSZ4uGXmVxISiKOyRzt4ftCXRxtmjHmP7aGrzWBt8FP6e-lESupZPEZ3OxWGf2D3fN8P1nhPIQDE2fB1TkZ9xRskfgqYTHDKhUoH4g-PNQoiwGczyuS2YftEhJUKXNSHwcM444FGTjuDP7R9KCaK3w11SzCCuE-4x6f7KVSiDvcZG8OLsGz1mT_2ubmXX4gqMzNt8r-NEj-gYspEIbe-1_Pk3wU6N-N2XweYm99IvN0uJozTgtPolaw',

  // Specials
  sp1a: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4-dlOcXngmNAOZjok3iuYuyP8Tn62J8F4XzrV0w6rE_Tka4TGUqnUWEdj12ZC-3K6WsJOrgf6w2BzPWIoE1dkch6TJqyUHB4xrtWnhdr78FAw3r8vRwE6c4Ofya8m1GOdmhHhU3iNvWDUv4LzPnCqyRU0vaouSniKeHhw39zNmYFcAOYxN4a7VwCSCo0hQsXoZjR7priUtwtXTyfvUepHwRKZ9Tk1cGfs-3iecasjmOc-BAIBDP_j-SzoQzsEDiZisQ',
  sp1b: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4-dlOcXngmNAOZjok3iuYuyP8Tn62J8F4XzrV0w6rE_Tka4TGUqnUWEdj12ZC-3K6WsJOrgf6w2BzPWIoE1dkch6TJqyUHB4xrtWnhdr78FAw3r8vRwE6c4Ofya8m1GOdmhHhU3iNvWDUv4LzPnCqyRU0vaouSniKeHhw39zNmYFcAOYxN4a7VwCSCo0hQsXoZjR7priUtwtXTyfvUepHwRKZ9Tk1cGfs-3iecasjmOc-BAIBDP_j-SzoQzsEDiZisQ',
  sp2a: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyq3bOtzGkgwdAIOySHzi1mpwWx1Gr_sp6-eL1ull61jjo-VFg7-8tkPo8VZAApqbqrdVO4F4125KRQyFqZdA6kbZ30QoGcn5T7wE5DCe8QkE2y-2F29nJ1oEA4ST0VHI_FTPKxAFYZEPnSJ975i7YhFJfVqlS24iuI-n8TMCphh-2WezuonqwYyPIAirIVHlxed5Vp9UKTGpHXxP-1taPmMLcep20go9_Ki90FBDlgfyeWHxjzZvJnCYoyKfY0MyQNg',
  sp2b: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyq3bOtzGkgwdAIOySHzi1mpwWx1Gr_sp6-eL1ull61jjo-VFg7-8tkPo8VZAApqbqrdVO4F4125KRQyFqZdA6kbZ30QoGcn5T7wE5DCe8QkE2y-2F29nJ1oEA4ST0VHI_FTPKxAFYZEPnSJ975i7YhFJfVqlS24iuI-n8TMCphh-2WezuonqwYyPIAirIVHlxed5Vp9UKTGpHXxP-1taPmMLcep20go9_Ki90FBDlgfyeWHxjzZvJnCYoyKfY0MyQNg',
  sp3a: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKWJYzODuZhFX3k2x_SyF__hQu51QRwfMCFt3n60KwV3i5xj4x_0f7GPAonkS4VZJo5xUkZ5DIr_V0n64JcisrMByi7yFMLdWGEZFk4gZbZdwKNqCAEL__yOCmsk13_d1D3hI5pvkC5rU7T8K7eODhGtgSwpxVZq-mKrgP3oT_HZlSY6OtkjPZhIg884Y-cE3tPQ5G1EhfT7-A_eFvqNGMQMBIVsmsiNOjnI10RrTD1lcBe2HQhXPMWOcEa3D5YMbjfg',
  sp3b: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKWJYzODuZhFX3k2x_SyF__hQu51QRwfMCFt3n60KwV3i5xj4x_0f7GPAonkS4VZJo5xUkZ5DIr_V0n64JcisrMByi7yFMLdWGEZFk4gZbZdwKNqCAEL__yOCmsk13_d1D3hI5pvkC5rU7T8K7eODhGtgSwpxVZq-mKrgP3oT_HZlSY6OtkjPZhIg884Y-cE3tPQ5G1EhfT7-A_eFvqNGMQMBIVsmsiNOjnI10RrTD1lcBe2HQhXPMWOcEa3D5YMbjfg'
};

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  C: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNySI9sGEb3xecl4q4rFfl0vJOGU_Vf9htj2-NUlE-gFSeVR9vxGk8RefLA_nnxFFE1_zZReCViwIi2l468aPW3qLLLQKLfHdf4MYTBocwK4AsufKRpUxe-zp5Pdnip5pTGErF0GxzzUrNadRO9G5Gy0Mu_240TRMkqxnSN5_JwexGw70UIMuiGPjBBZTJhNBwN-eZ2l95HFX-u7Wl-SIb4d094l4OSoVoevgouhIGEnU5FnDGecg9N2Cwu4ZO5auGfA',
  L: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdn9hFAP4XyJTgnHcBZCKI2Est44b4NaTWLJGChb929N3-VOReI2kHkYNUHe0xcrjk81Ve4p5RX2O4Obw39T4ELwcSCl9QQBvxMWzsSRxTU38hlnYBd_xp_7VTWdd18Uw40cnW9Spgd9X4LvGGt-raE74-y9Oe-1LqotHOfuICYLuExQ5WSQ5DaWYHP8DgnnT5LZb498gCkgWxs-T8MMFQeucDUFvd1MrjvSjIxhjnASEWYz1PUlyRKDNdIuKGUCuGw',
  Le: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdn9hFAP4XyJTgnHcBZCKI2Est44b4NaTWLJGChb929N3-VOReI2kHkYNUHe0xcrjk81Ve4p5RX2O4Obw39T4ELwcSCl9QQBvxMWzsSRxTU38hlnYBd_xp_7VTWdd18Uw40cnW9Spgd9X4LvGGt-raE74-y9Oe-1LqotHOfuICYLuExQ5WSQ5DaWYHP8DgnnT5LZb498gCkgWxs-T8MMFQeucDUFvd1MrjvSjIxhjnASEWYz1PUlyRKDNdIuKGUCuGw',
  M: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdDzI8K0pS-CQJ850URG3QWa_G-dA2uB8psAqA_eC3XuCJL-He_t-iAia8-92PCuUd4enSFmMw0laVj-g9Ex_8QaJ-RXsWmBi8pWoOgdlY8dJRc7fUCcPVFJj4Hl5fBMJV35XnBBib2YZG9JpU_AQzTl3F62oZwxJbQ6CdzrnMkxJwUuj524GX1n_lX7dVB47dlxC1KJV9q1ky2hY0v24UkCYrcIBF45opSdVrEKcX3FfQT18oUukGIdFSMYFK-i-CtA',
  Ma: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdDzI8K0pS-CQJ850URG3QWa_G-dA2uB8psAqA_eC3XuCJL-He_t-iAia8-92PCuUd4enSFmMw0laVj-g9Ex_8QaJ-RXsWmBi8pWoOgdlY8dJRc7fUCcPVFJj4Hl5fBMJV35XnBBib2YZG9JpU_AQzTl3F62oZwxJbQ6CdzrnMkxJwUuj524GX1n_lX7dVB47dlxC1KJV9q1ky2hY0v24UkCYrcIBF45opSdVrEKcX3FfQT18oUukGIdFSMYFK-i-CtA',
  R: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhc3VsXXQdfc7rmoLtnIGDtgxcQrpHVCRN4pP7uwvtZHGHdloSbxF17e6TgYUZeLT_iQU5SWzmDgDtzRq6aJcCknmL4vqTbSotU94TlQC_9pdKPXDH9qDuJyM_9ObntZEyPtenS4CTb9UuJwre7EEVCf7kkjQxZ_6fSg2mLUHbzmaQyjckavmmoR_stOmcfpTdHWmlCp6oQpWElk1PbUvRBtoiQmvxwlMHk_ghx7WNSsXFrhzl_TFwk1UgzYPMekthfQ',
  Rival: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4-dlOcXngmNAOZjok3iuYuyP8Tn62J8F4XzrV0w6rE_Tka4TGUqnUWEdj12ZC-3K6WsJOrgf6w2BzPWIoE1dkch6TJqyUHB4xrtWnhdr78FAw3r8vRwE6c4Ofya8m1GOdmhHhU3iNvWDUv4LzPnCqyRU0vaouSniKeHhw39zNmYFcAOYxN4a7VwCSCo0hQsXoZjR7priUtwtXTyfvUepHwRKZ9Tk1cGfs-3iecasjmOc-BAIBDP_j-SzoQzsEDiZisQ',
  Special: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKWJYzODuZhFX3k2x_SyF__hQu51QRwfMCFt3n60KwV3i5xj4x_0f7GPAonkS4VZJo5xUkZ5DIr_V0n64JcisrMByi7yFMLdWGEZFk4gZbZdwKNqCAEL__yOCmsk13_d1D3hI5pvkC5rU7T8K7eODhGtgSwpxVZq-mKrgP3oT_HZlSY6OtkjPZhIg884Y-cE3tPQ5G1EhfT7-A_eFvqNGMQMBIVsmsiNOjnI10RrTD1lcBe2HQhXPMWOcEa3D5YMbjfg'
};

export function getCardImageUrl(card: CardData): string {
  if (CARD_ART_MAP[card.id]) return CARD_ART_MAP[card.id];
  if (card.id.startsWith('sp1')) return CARD_ART_MAP['sp1a'];
  if (card.id.startsWith('sp2')) return CARD_ART_MAP['sp2a'];
  if (card.id.startsWith('sp3')) return CARD_ART_MAP['sp3a'];
  return DEFAULT_CATEGORY_IMAGES[card.category] || DEFAULT_CATEGORY_IMAGES['C'];
}

export function buildComplete52Deck(): CardData[] {
  return OFFICIAL_52_CARDS.map((card) => ({
    ...card,
    image: getCardImageUrl(card)
  }));
}

// Fisher-Yates shuffle
export function fisherYatesShuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
