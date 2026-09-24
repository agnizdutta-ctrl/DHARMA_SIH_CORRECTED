import { EraId } from '../types/era';
import { ERA_PALETTES } from './palettes';

export function applyTheme(eraId: EraId): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const palette = ERA_PALETTES[eraId] || ERA_PALETTES.mahabharat;

  Object.entries(palette.cssVariables).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });
  root.setAttribute('data-era', eraId);
}
