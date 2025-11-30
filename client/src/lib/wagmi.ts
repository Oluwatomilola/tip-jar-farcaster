import { createConfig, http } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('VITE_WALLETCONNECT_PROJECT_ID is not set. Wallet connections may not work properly.');
}

export const wagmiConfig = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({
      projectId: projectId || '',
      metadata: {
        name: 'Tip Jar',
        description: 'Send crypto tips to your favorite creators',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://tipjar.app',
        icons: ['https://tipjar.app/favicon.png'],
      },
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: 'Tip Jar',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
