import { soundEngine } from '../hooks/useAudio';

export function playSound(soundName: string) {
  if (soundName === 'roundWin' || soundName === 'victory') {
    soundEngine.play('victoryFanfare');
  } else {
    soundEngine.play(soundName);
  }
}
