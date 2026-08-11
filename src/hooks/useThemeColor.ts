import { useEffect } from 'react';

export const THEME_COLORS = {
  onboarding: '#F3F3F3',
  camera: '#242424',
} as const;

export function useThemeColor(color: (typeof THEME_COLORS)[keyof typeof THEME_COLORS]) {
  useEffect(() => {
    const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    themeColorMeta?.setAttribute('content', color);
  }, [color]);
}
