
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [polygon],
  transports: {
    // [mainnet.id]: http(),
    // [sepolia.id]: http(),
    [polygon.id]: http(),
  },
})