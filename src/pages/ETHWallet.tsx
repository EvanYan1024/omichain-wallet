
import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';
import { getAddress } from 'ethers';
import { Button } from '@chakra-ui/react';
import { fetchToken } from 'wagmi/actions';
import { WagmiProvider, useAccount, useChainId } from 'wagmi';
import { useConnect } from 'wagmi'
// import { injected } from 'wagmi/connectors'
// import { config } from './main';
import { decodeAbiParameters, encodeAbiParameters, parseAbiParameters } from 'viem'
import { wagmiConfig } from '../components/Wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getUserNFTs } from '../components/nft';


const domain = window.location.host;
const origin = window.location.origin;
const provider = new BrowserProvider(window.ethereum);


function createSiweMessage(address, statement) {
    const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1'
    });
    return message.prepareMessage();
}

const AccountInfo = () => {
    const { address } = useAccount();
    const chainId = useChainId();
    return (
        <div>
            <div>Address: {address}</div>
            <div>ChainId: {chainId}</div>
        </div>
    )

}


const ETHWalletContainer = () => {
    const chainId = useChainId();
    const { connect } = useConnect()
    const { address } = useAccount();
    // const { connectors, switchAccount } = useSwitchAccount()
    // const connections = useConnections()

    const sc = [{ "name": "paidCustomer", "type": "bool" }, { "name": "recipient", "type": "address" }, { "name": "contractsSigned", "type": "uint256" }, { "name": "accountId", "type": "bytes32" }]


    const d = encodeAbiParameters(sc,
        [false, "0xDfc4FbbDd9C47c7976fEBb14B1D37C7f85FE299D", 2, "0xb41d46006e8032cb0c3c9dfcfcc7026c3625a1c76c83de1e62c054d639ab8f9e"]
    );
    console.log(d)

    console.log(decodeAbiParameters([{ type: 'tuple', components: sc }], d))

    useEffect(() => {
        if (!address) return;
        getUserNFTs(address)
            .then(tokenIds => {
                console.log('用户持有的NFTs:', tokenIds);
            })
            .catch(error => {
                console.error('发生错误:', error);
            });
    }, [address])

    function connectWallet() {
        // connect({ connector: injected() })
        // provider.send('eth_requestAccounts', [])
        //     .catch(() => console.log('user rejected request'));
    }

    const switchAccountFunc = async () => {
        // console.log(connectors, connections)
        // const result = await switchAccount(config, {
        //     connector: connections[0]?.connector,
        //   })
        //   console.log(result);
    }

    const test = decodeAbiParameters(
        parseAbiParameters('uint, uint, uint, uint, bool'),
        '0x00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000b47350100000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b473500000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002710000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001'
    )

    console.log(test)


    async function signInWithEthereum() {
        // const signer = await provider.getSigner();
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        const address = getAddress(accounts[0]);
        const message = createSiweMessage(
            address,
            'Sign in with Ethereum to the app.'
        );
        console.log(message, 'msg')
        const signature = await window.ethereum?.request({
            method: 'personal_sign',
            params: [message, address],
        });
        console.log(signature)
        // console.log(await signer.signMessage(message));
    }

    const getToken = async () => {
        console.log(chainId)
        const res = await fetchToken({
            address: '0xbAdd10ec008444E2Ee4a1A15b6E658eA63ebC3bf',
            chainId: chainId
        });
        console.log(res);
    }
    return (
        <div>
            <div className='flex'>
                <w3m-button />
            </div>

            <div><Button id='connectWalletBtn' onClick={connectWallet}>{address || 'Connect wallet'}</Button></div>
            <div><button id='siweBtn' onClick={signInWithEthereum}>Sign-in with Ethereum</button></div>

            <Button onClick={getToken}>Fetch token</Button>
            <Button onClick={switchAccountFunc}>Switch Account</Button>
            <AccountInfo />
        </div>
    )
}

const queryClient = new QueryClient()

export const ETHWallet = () => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ETHWalletContainer />
            </QueryClientProvider>
        </WagmiProvider>
    )
}