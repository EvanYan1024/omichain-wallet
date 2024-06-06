import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bulma/css/bulma.css';
// import App from './App.tsx'
import './index.css'
import { Buffer } from 'buffer';
import { THEME, TonConnectUIProvider, TonConnect } from "@tonconnect/ui-react";
// import { StarknetProvider } from './pages/StarkNet.tsx';
// import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { Router } from './Router.tsx';



// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'c88ecd2e8c3f5593cfea8b86d48f3a7a'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// const chains = [polygonMumbai, zetachainAthensTestnet]
// const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
// createWeb3Modal({ wagmiConfig, projectId, chains })


// export const config = createConfig({
//   chains: chains,
//   transports: {
//     [polygonMumbai.id]: http(),
//     [zetachainAthensTestnet.id]: http(),
//   },
// })


window.Buffer = Buffer;
window.global = window;
console.log(global)

const connector = new TonConnect({
  manifestUrl: "https://demo-dapp.walletbot.net/demo-dapp/tonconnect-manifest.json",
  // walletsListSource: 'https://raw.githubusercontent.com/ton-blockchain/wallets-list/feature/at-wallet/wallets.json'
})

console.log(connector)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <TonConnectUIProvider
      connector={connector}
      uiPreferences={{ theme: THEME.DARK }}
      restoreConnection
      actionsConfiguration={{
        returnStrategy: 'https://t.me/ethsigndev_bot/signapp?startapp=contract'
      }}
    
    >
      
    </TonConnectUIProvider> */}
    <ChakraProvider>
      <Router/>
    </ChakraProvider>
  </React.StrictMode>,
)
