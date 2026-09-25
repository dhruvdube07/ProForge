import { useState, useEffect } from 'react';
import { UI_FONT_MODES, getStoredUiFont, setUiFont } from '../lib/dynamicTypography';

export function useDynamicUI() {
  const [uiFontMode, setUiFontModeState] = useState(getStoredUiFont());

  useEffect(() => {
    const handleFontChange = (e) => {
      setUiFontModeState(e.detail?.mode || getStoredUiFont());
    };

    window.addEventListener('pfUiFontChanged', handleFontChange);
    return () => window.removeEventListener('pfUiFontChanged', handleFontChange);
  }, []);

  const changeUiFont = (mode) => {
    const next = setUiFont(mode);
    setUiFontModeState(next);
  };

  const activeFontMode = UI_FONT_MODES.find(m => m.id === uiFontMode) || UI_FONT_MODES[0];

  return {
    uiFontMode,
    activeFontMode,
    fontModes: UI_FONT_MODES,
    changeUiFont,
  };
}
