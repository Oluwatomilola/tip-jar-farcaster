import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmi';
import type { ReactNode } from 'react';

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      {children}
    </WagmiProvider>
  );
}
