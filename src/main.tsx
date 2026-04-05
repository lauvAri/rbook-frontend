
import { StrictMode } from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from '@/lib/react-query';
import { router } from '@/router';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppSkeletonTheme } from '@/components/Skeleton';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppSkeletonTheme>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AppSkeletonTheme>
    </ThemeProvider>
  </StrictMode>,
)
