import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { UserProfileProvider } from './user-profile-context';
import { TrackingProvider } from './tracking-context';
import { AppProvider } from './app-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Корневой компонент, объединяющий все провайдеры контекста
 * в правильном порядке зависимостей
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProfileProvider>
          <TrackingProvider>
            <AppProvider>
              {children}
              <Toaster />
            </AppProvider>
          </TrackingProvider>
        </UserProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}