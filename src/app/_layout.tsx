import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CallAlertHost } from '@/components/helpers/CalllAlert';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

export default function AppTabs() {
  const scheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
    <Stack
      screenOptions={
        {
          headerShown:false
        }
      }
    />
    <CallAlertHost />
    </QueryClientProvider>
  );
}
