
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, zkSync } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [zkSync, polygon, sepolia, mainnet],
  transports: {
    [zkSync.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
  },
})