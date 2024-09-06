import { StarknetWallet } from "./providers/starknet";
import { WalletBase } from "./WalletBase";
import { EvmWallet } from "./providers/evm";
import { ChainType } from "./types";
import { TonWallet } from "./providers/ton";
import { SolWallet } from "./providers/solana";

export abstract class WalletFactory {
    private static instances: Record<string, WalletBase> = {};
    static getWallet(type: ChainType, userAddress?: string): WalletBase {
        if (!this.instances[type]) {
            let WalletClass;
            switch (type) {
                case ChainType.EVM:
                    WalletClass = EvmWallet;
                    break;
                case ChainType.StarkNet:
                    WalletClass = StarknetWallet;
                    break;
                case ChainType.Ton:
                    WalletClass = TonWallet;
                    break;
                case ChainType.Solana:
                    WalletClass = SolWallet;
                    break;
                default:
                    throw new Error('Unsupported wallet type');
            }

            if (!WalletClass) {
                throw new Error('Unsupported wallet type');
            }
            this.instances[type] = new WalletClass(type, userAddress);
        }
        return this.instances[type];
    }
}
