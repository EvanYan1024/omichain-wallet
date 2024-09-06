import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider, http, createConfig } from 'wagmi'
import { arbitrum, baseSepolia, mainnet, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {zkSync} from "viem/chains";

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '70547224c970709296535f0d14fd43a3'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [zkSync,] as const
const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
})

const wagmiConfig = createConfig({
  chains: [zkSync],
  transports: {
    [zkSync.id]: http('https://zksync-mainnet.blastapi.io/98c434a6-dc37-4c53-811b-8cb19efd1bdc'),
  },
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false,
  // includeWalletIds: ['5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489']
})

export function Web3Provider({ children }: any) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}