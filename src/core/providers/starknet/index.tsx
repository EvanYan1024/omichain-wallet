import { goerli, mainnet } from '@starknet-react/chains';
import {
  argent,
  braavos,
  publicProvider,
  StarknetConfig,
  starkscan,
  useInjectedConnectors,
  Connector, useAccount, useConnect, useDisconnect, useProvider
} from '@starknet-react/core';
import { Button, Modal } from '@ethsign/ui';
import { DialogHeader } from '@ethsign/ui/dist/Modal/dialog';
import { WalletBase } from '../../WalletBase';
import { useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import { proxy } from 'valtio';
import { prepareSignMessage } from '../../utils';
import { toHex } from 'viem';
import { ISignResult } from '../../types';

const eventBus = new EventEmitter();


interface StarkStoreType {
  account: ReturnType<typeof useAccount> | null;
  disconnect?: ReturnType<typeof useDisconnect>['disconnect'];
  connectModal?: { open: boolean, setOpen: (v: boolean) => void };
  provider?: ReturnType<typeof useProvider>['provider'] | undefined;
  counter: number;
}


const starknetStore = proxy<StarkStoreType>({
  account: null,
  counter: 0
});

const STARK_EVENT_KEY = 'starknet_signin';

const getEventKey = () => {
    return `${STARK_EVENT_KEY}_${starknetStore.counter}`;
}


export class StarknetWallet extends WalletBase {
  get isConnected() {
    return !!(starknetStore.account?.address && starknetStore.account?.isConnected);
  }
  get walletInfo() {
    return {
      address: starknetStore.account?.address,
      publicKey: this.publicKey,
      chainId: starknetStore.account?.chainId,
      chainType: this.chainType,
      provider: starknetStore.provider,
      isConnected: this.isConnected
    }
  }
  connect() {
    if(!this.isConnected) {
      starknetStore?.connectModal?.setOpen(true);
    }
  }

  disconnect() {
    starknetStore.disconnect?.();
  }

  async sign(_message: string) {
    const account = starknetStore.account;
    const res = await account?.account?.signMessage(JSON.parse(_message));

    return { message: _message, signature: (res as string[]).join(',') };
  }

  async signin(statement?: string): Promise<ISignResult> {
    return new Promise((resolve) => {
      const signCallback = (data: ReturnType<typeof useAccount>) => {
        this.address = data.address as string;
        const hexChainId = toHex(data.chainId!);
        this.chainId = hexChainId;
        const msg = prepareSignMessage({
          statement,
          chainId: hexChainId,
          address: data?.address as string,
        });
        const fullMessage = {
          domain: {
            chainId: hexChainId,
            name: statement,
            version: '1'
          },
          message: msg,
          primaryType: 'Sign',
          types: {
            StarkNetDomain: [
              { name: 'name', type: 'string' },
              { name: 'version', type: 'felt' },
              { name: 'chainId', type: 'felt' }
            ],
            Sign: [
              { name: 'statement', type: 'felt' },
              { name: 'chainId', type: 'felt' },
              { name: 'address', type: 'felt' },
              { name: 'issuedAt', type: 'felt' },
              { name: 'version', type: 'felt' },
              { name: 'nonce', type: 'felt' }
            ]
          }
        };
        const res = this.sign(JSON.stringify(fullMessage));
        resolve(res);
      }
      const account = starknetStore.account;
      console.log(account, 'acc');
      this.provider = starknetStore.provider;
      if (this.isConnected) {
        signCallback(account!);
        return;
      }
      starknetStore.counter++;
      this.connect();
      const eventKey = getEventKey();
      eventBus.once(eventKey, (data) => {
        console.log('listen event key success, event key = %s, data = %j', eventKey, data);
        signCallback(data);
      });
    })
  }
}

function ConnectStarkNetModal() {
  const { connect, connectors, connector: current } = useConnect();
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const {provider} = useProvider();
  const [open, setOpen] = useState(false);

  const onConnected = () => {
    starknetStore.account = account;
    const eventKey = getEventKey();
    console.log('emit', eventKey);
    eventBus.emit(eventKey, account);
  }

  useEffect(() => {
    if (account) {
      onConnected();
      setOpen(false);
    }
  }, [account]);

  starknetStore.connectModal = { open, setOpen };
  starknetStore.disconnect = disconnect;
  starknetStore.provider = provider;

  console.log(current, 'current')

  const handleConnect = (connector: Connector) => {
    if(account.address && current?.id === connector.id) {
      onConnected();
    } else {
      connect({ connector });
    }
  }

  return (
    <Modal footer={false} open={open} onOpenChange={setOpen} className={'md:w-[350px]'}>
      <DialogHeader className={'font-bold'}>Connect StarkNet Wallet</DialogHeader>
      <div className="flex flex-col gap-4">
        {connectors.map((connector: Connector) => (
          <Button
            variant={'outline'}
            key={connector.id}
            onClick={() => handleConnect(connector)}
            disabled={!connector.available()}
          >
            <img src={connector.icon.dark} className="w-4 h-4 mr-2" />
            Connect {connector.name}
          </Button>
        ))}
      </div>
    </Modal>
  );
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: 'onlyIfNoConnectors',
    // Randomize the order of the connectors.
    order: 'alphabetical'
  });

  return (
    <StarknetConfig
      autoConnect
      chains={[mainnet, goerli]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={starkscan}
    >
      {children}
      <ConnectStarkNetModal />
    </StarknetConfig>
  );
}