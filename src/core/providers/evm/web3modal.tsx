import { ResolvedRegister, WagmiProvider, useAccount, useWalletClient } from 'wagmi';
import {ReactNode, useEffect, useState} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletBase } from '../../WalletBase';
import {disconnect, getAccount, signMessage } from 'wagmi/actions';
import { EventEmitter } from 'events';
import { ISignResult } from '../../types';
import { get4361Message, prepareSignMessage } from '../../utils';
import { proxy } from 'valtio';
import {createWeb3Modal, useWeb3Modal} from "@web3modal/wagmi/react";

const queryClient = new QueryClient();

const eventBus = new EventEmitter();

const EVM_EVENT_KEY = 'evm_signin';

interface EVMStoreType {
    account: ReturnType<typeof useAccount> | null;
    web3Modal: ReturnType<typeof useWeb3Modal> | undefined;
    walletClient: ReturnType<typeof useWalletClient> | undefined;
    config: ResolvedRegister['config'] | undefined
}

const evmStore = proxy<EVMStoreType>({
    account: null,
    web3Modal: undefined,
    walletClient: undefined,
    config: undefined
});

export class EvmWallet extends WalletBase {
    get isConnected() {
        return !!(evmStore.account?.address && evmStore.account?.isConnected);
    }

    connect() {
        void evmStore?.web3Modal?.open?.().then(res => {
            console.log('connect success', res);
        });
    }

    async disconnect() {
        await disconnect(evmStore.config!);
    }

    async sign(_message: string) {
        const sign = await signMessage(evmStore.config!, {
            message: _message
        });
        return {
            message: _message,
            signature: sign
        };
    }

    override async signin(statement?: string): Promise<ISignResult> {

        return new Promise((resolve) => {
            const signCallback = (data: ReturnType<typeof useAccount>) => {
                this.address = data.address;
                this.chainId = data.chainId;
                const msg = prepareSignMessage({ statement, chainId: data.chainId!, address: data.address! });
                const fullMessage = get4361Message(msg);

                const res = this.sign(fullMessage);

                resolve(res);
            };

            const account = getAccount(evmStore.config!);
            this.provider = evmStore.walletClient;

            if (this.isConnected) {
                signCallback(account);
                return;
            }

            this.connect();
            eventBus.once(EVM_EVENT_KEY, (data) => {
                console.log('listen event key success, event key = %s, data = %j', EVM_EVENT_KEY, data);
                signCallback(data);
            });
        });
    }
}

export const EVMConnector = () => {
    const web3Modal = useWeb3Modal();
    const walletClient = useWalletClient();
    const account = useAccount();

    evmStore.web3Modal = web3Modal;
    evmStore.walletClient = walletClient;

    useEffect(() => {
        if (account.isConnected) {
            eventBus.emit(EVM_EVENT_KEY, account);
        }
    }, [account]);

    return null;
};

export const EvmProvider = ({ children, config, projectId }: { children: ReactNode; config: ResolvedRegister['config']; projectId: string }) => {
    evmStore.config = config;
    const [modal, setModal] = useState<any>(null);

    useEffect(() => {
        if(!modal) {
            const m = createWeb3Modal({
                wagmiConfig: config,
                projectId,
                enableAnalytics: true, // Optional - defaults to your Cloud configuration
                enableOnramp: true // Optional - false as default
            });
            setModal(m);
        }
    }, [config, modal]);
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
                {modal && <EVMConnector />}
            </QueryClientProvider>
        </WagmiProvider>
    );
};
