import { EraId } from '../types/era';

export interface ThemePalette {
  name: string;
  cssVariables: Record<string, string>;
}

export const ERA_PALETTES: Record<EraId, ThemePalette> = {
  mughal: {
    name: 'Imperial Mughal Gold',
    cssVariables: {
      '--era-primary': '#B45309',
      '--era-primary-rgb': '180, 83, 9',
      '--era-accent': '#D4AF37',
      '--era-accent-rgb': '212, 175, 55',
      '--era-bg': '#FAF6ED',
      '--era-card-bg': '#FFFFFF',
      '--era-border': '#E5D5B8',
      '--era-surface-dark': '#0E2117',
      '--era-text-dark': '#1C2920',
      '--era-glow': 'rgba(212, 175, 55, 0.35)'
    }
  },
  swaraj: {
    name: 'Swaraj Kesariya Saffron',
    cssVariables: {
      '--era-primary': '#C2410C',
      '--era-primary-rgb': '194, 65, 12',
      '--era-accent': '#EA580C',
      '--era-accent-rgb': '234, 88, 12',
      '--era-bg': '#FBF7F2',
      '--era-card-bg': '#FFFFFF',
      '--era-border': '#FED7AA',
      '--era-surface-dark': '#1A120B',
      '--era-text-dark': '#29180E',
      '--era-glow': 'rgba(234, 88, 12, 0.35)'
    }
  },
  mahabharat: {
    name: 'Kurukshetra Royal Indigo',
    cssVariables: {
      '--era-primary': '#1E3A8A',
      '--era-primary-rgb': '30, 58, 138',
      '--era-accent': '#4338CA',
      '--era-accent-rgb': '67, 56, 202',
      '--era-bg': '#EBF0F7',
      '--era-card-bg': '#FFFFFF',
      '--era-border': '#C7D2FE',
      '--era-surface-dark': '#0B1120',
      '--era-text-dark': '#0F172A',
      '--era-glow': 'rgba(67, 56, 202, 0.35)'
    }
  }
};
