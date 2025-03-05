import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider, } from 'wagmi'

import { baseSepolia, mainnet, sepolia, zkSyncSepoliaTestnet } from 'wagmi/chains'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { ReactNode } from 'react'
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

export const projectId = 'c88ecd2e8c3f5593cfea8b86d48f3a7a'
export const configForRainbow = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: 'c88ecd2e8c3f5593cfea8b86d48f3a7a',
    chains: [mainnet, zkSyncSepoliaTestnet, baseSepolia],
    transports: {
        [mainnet.id]: http(),
        [zkSyncSepoliaTestnet.id]: http(),
        [baseSepolia.id]: http(),
    },
})


const queryClient = new QueryClient()

export const RainbowKitApp = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}


const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, zkSyncSepoliaTestnet, baseSepolia, sepolia] as const
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
})

export const Web3ModalApp = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}