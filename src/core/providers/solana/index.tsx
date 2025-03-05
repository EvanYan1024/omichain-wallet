import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { WalletBase } from "../../WalletBase";
import {
  useWalletModal,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { ISignResult } from "../../types";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import bs58 from "bs58";
import { get4361Message, prepareSignMessage } from "../../utils";

interface SolStoreType {
  connectModal: ReturnType<typeof useWalletModal> | null;
  account: ReturnType<typeof useWallet> | null;
}

const solStore: SolStoreType = {
  connectModal: null,
  account: null,
};

export class SolWallet extends WalletBase {
  get isConnected() {
    return !!solStore.account?.connected;
  }
  connect(_?: string): void {
    solStore.connectModal?.setVisible(true);
  }

  disconnect() {
    solStore.account?.disconnect();
  }

  async sign(message: string): Promise<ISignResult> {
    const provider = solStore.account!;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await provider.signMessage?.(encodedMessage);

    console.log(signedMessage, "signedMessage");

    return {
      message,
      signature: bs58.encode(signedMessage!),
    };
  }

  signin(statement?: string): Promise<ISignResult> {
    return new Promise((resolve) => {
      const signCallback = (data: ReturnType<typeof useWallet>) => {
        this.publicKey = data.publicKey?.toString();
        this.address = this.publicKey;
        this.chainId = 1;
        const msg = prepareSignMessage({
          statement,
          chainId: "1",
          address: this.address!,
        });
        const fullMessage = get4361Message(msg);

        const res = this.sign(fullMessage);

        resolve(res);
      };

      // const account = getAccount(evmStore.config!);
      // this.provider = evmStore.walletClient;

      if (this.isConnected) {
        console.log(solStore);
        signCallback(solStore.account!);
        return;
      }
      this.connect();
    });
  }
}

export const SolConnector = () => {
  const walletModal = useWalletModal();
  const wallet = useWallet();

  console.log(wallet, "wallet");

  useEffect(() => {
    if (wallet.wallet) {
      wallet.connect();
    }
  }, [wallet]);

  solStore.connectModal = walletModal;
  solStore.account = wallet;
  return null;
};

export const SolanaProvider = ({ children }: { children: ReactNode }) => {
  const endpoint = clusterApiUrl("devnet");

  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], []);

  const onError = useCallback((error: any) => {
    console.error(error);
  }, []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError}>
        <WalletModalProvider>
          <SolConnector />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
