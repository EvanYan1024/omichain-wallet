import { Button } from "@chakra-ui/react";
import { WalletFactory } from "../core/WalletFactory";
import { ChainType } from "../core/types";
import { EvmProvider } from "../core/providers/evm";
import { config } from "../components/Rainbowkit";
import { StarknetProvider } from "../core/providers/starknet";
import { useState } from "react";
import { TonProvider } from "../core/providers/ton";
import { SolanaProvider } from "../core/providers/solana/index.tsx";

const SigninCore = () => {
  const [walletType, setWalletType] = useState<ChainType>(ChainType.EVM);

  const handleConnect = async (chainType: ChainType) => {
    setWalletType(chainType);
    const wallet = WalletFactory.getWallet(chainType);

    const res = await wallet.signin("Welcome to Wagmi");

    const walletInfo = wallet.getWallet();

    console.log(res, walletInfo);
  };

  const handleDisconnect = () => {
    const wallet = WalletFactory.getWallet(walletType);
    const walletInfo = wallet.getWallet();

    console.log(walletInfo);
    wallet.disconnect();
  };

  const getWallet = () => {
    const wallet = WalletFactory.getWallet(walletType);
    const walletInfo = wallet.getWallet();

    console.log(walletInfo);
  };

  return (
    <div className="space-y-4 flex flex-col w-1/2 m-auto mt-10">
      <div className={"my-4 justify-between items-center"}>
        <h1 className={"font-bold text-lg"}>Connect Wallet</h1>

        <div className="flex gap-2">
          <Button onClick={getWallet}>Info</Button>
          <Button onClick={handleDisconnect}>Disconnect</Button>
        </div>
      </div>
      <Button onClick={() => handleConnect(ChainType.EVM)}>EVM Connect</Button>
      <Button onClick={() => handleConnect(ChainType.StarkNet)}>
        StarkNet Connect
      </Button>
      <Button onClick={() => handleConnect(ChainType.Ton)}>Ton Connect</Button>
      <Button onClick={() => handleConnect(ChainType.Solana)}>
        Solana Connect
      </Button>
    </div>
  );
};

export default function SignIn() {
  return (
    <div>
      <EvmProvider config={config}>
        <StarknetProvider>
          <TonProvider
            config={{
              manifestUrl: "https://app.ethsign.xyz/manifest.json",
            }}
          >
            <SolanaProvider>
              <SigninCore />
            </SolanaProvider>
          </TonProvider>
        </StarknetProvider>
      </EvmProvider>
    </div>
  );
}
