import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { EraId } from '../types/era';
import { MahabharatLanding } from './eras/MahabharatLanding';
import { MughalLanding } from './eras/MughalLanding';
import { SwarajLanding } from './eras/SwarajLanding';
import { applyTheme } from '../theme/themeManager';

export const EraLandingPage: React.FC = () => {
  const params = useParams<{ eraId: string }>();
  const { currentEra, setCurrentEra } = useGameStore();

  const activeEra: EraId = (params.eraId as EraId) || currentEra || 'mahabharat';

  useEffect(() => {
    if (params.eraId && params.eraId !== currentEra) {
      setCurrentEra(activeEra);
    }
    applyTheme(activeEra);
  }, [params.eraId, activeEra, currentEra, setCurrentEra]);

  if (activeEra === 'mughal') {
    return <MughalLanding />;
  }

  if (activeEra === 'swaraj') {
    return <SwarajLanding />;
  }

  return <MahabharatLanding />;
};
