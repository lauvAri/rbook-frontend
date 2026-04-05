import type { ReactNode } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface AppSkeletonThemeProps {
  children: ReactNode;
}

export function AppSkeletonTheme({ children }: AppSkeletonThemeProps) {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
    >
      {children}
    </SkeletonTheme>
  );
}
