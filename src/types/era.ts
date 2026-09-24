export type EraId = 'mahabharat' | 'mughal' | 'swaraj';

export interface EraMetadata {
  id: EraId;
  name: string;
  hindiName: string;
  subtitle: string;
  period: string;
  themeColor: string;
  accentColor: string;
  symbol: string;
  description: string;
  rulerCount: number;
  cardCount: number;
  crisisNames: string[];
  bannerImage: string;
  fallbackImage: string;
}

export const ERA_CATALOG: Record<EraId, EraMetadata> = {
  mughal: {
    id: 'mughal',
    name: 'Mughal Yugam',
    hindiName: 'मुग़ल युगम्',
    subtitle: 'The Imperial Court & Dynastic Branching',
    period: '1526 – 1707 CE',
    themeColor: '#D4AF37',
    accentColor: '#B45309',
    symbol: '👑',
    description: 'Command the grand Peacock Throne. From Babur’s Panipat artillery to Akbar’s Din-i Ilahi, navigate courtiers, Rival pot steals, and imperial crises.',
    rulerCount: 6,
    cardCount: 52,
    crisisNames: ['Crisis: Famine', 'Crisis: Nadir Shah'],
    bannerImage: '/33.jpeg',
    fallbackImage: '/new image 33.jpeg'
  },
  swaraj: {
    id: 'swaraj',
    name: 'Swaraj Yug',
    hindiName: 'स्वराज्य युग',
    subtitle: 'The Indian Freedom Struggle & Clarion of Bharat',
    period: '1857 – 1947 CE',
    themeColor: '#EA580C',
    accentColor: '#C2410C',
    symbol: '🇮🇳',
    description: 'Unite the vanguard of liberty. From Mangal Pandey’s Barrackpore revolt to the Dandi Salt March and INA, forge sovereign chains of national spirit.',
    rulerCount: 6,
    cardCount: 52,
    crisisNames: ['Rowlatt Act Strike', 'Martial Law Siege'],
    bannerImage: '/Mangal Pandey  _Biography_ History, Role in the Revolt of 1857_.jpg',
    fallbackImage: '/Population Density of the British Indian Empire, 1909.jpg'
  },
  mahabharat: {
    id: 'mahabharat',
    name: 'Mahabharata Yugam',
    hindiName: 'महाभारत युगम्',
    subtitle: 'The Cosmic War of Dharma at Kurukshetra',
    period: 'Dvapara Yuga (~3102 BCE)',
    themeColor: '#312E81',
    accentColor: '#4338CA',
    symbol: '🦚',
    description: 'Engage in the definitive conflict of righteousness. Guided by Krishna’s divine chariot, overcome Shakuni’s dice, Chakravyuha formations, and epic astras.',
    rulerCount: 6,
    cardCount: 52,
    crisisNames: ['Lakshagriha (House of Lac)', 'Kurukshetra War Astra'],
    bannerImage: '/download.jpg',
    fallbackImage: '/murakami-drunkruj-kurukshetra.jpg'
  }
};
