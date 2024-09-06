
import { SiweMessage } from 'siwe';
import { Button, useToast } from '@chakra-ui/react';
import {useAccount, useChainId, useConfig, useWalletClient} from 'wagmi';
import { Web3Provider } from '../components/Web3Modal';
import {writeContract} from "wagmi/actions";
import abi from './airdropABI.json';
import {zkSync} from "wagmi/chains";
import { airdropData } from './data.ts';


const domain = window.location.host;
const origin = window.location.origin;


function createSiweMessage(address: string, statement: string) {
    const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1
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
    const { address } = useAccount();
    const toast = useToast();
    const wc = useWalletClient();
    const config = useConfig();


    const data = airdropData[address]?.allocations?.[0];

    const claim = async () => {
        try {
            const hash = await writeContract(config, {
                abi: abi,
                address: '0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4',
                chainId: zkSync.id,
                functionName: 'claim',
                args: [
                    data?.merkleIndex,
                    data?.tokenAmount,
                    data?.merkleProof
                ],
            });
            console.log(hash, 'hash');
        } catch(e) {
            console.log(e);
        }
    }


    async function signInWithEthereum() {
        try {
            const message = createSiweMessage(
                address!,
                'Sign in with Ethereum to the app.'
            );
            console.log(message, 'msg')
            console.log(wc, 'wc');
            const res = await wc.data?.signMessage({
                message,
            })
            console.log(res)
            toast({
                title: 'Sign Success',
                description: res,
                status: 'success',
            })
        } catch (error: any) {
            console.error(error);
            toast({
                title: 'Failed',
                description: error.message,
                status: 'error',
            })
        }
    }
    return (
        <div className='p-6 space-y-6'>
            <div className='flex justify-end mb-6'>
                <w3m-button />
            </div>
            <div>
                <Button onClick={signInWithEthereum}>Sign Message</Button>
            </div>
            <div>
                <Button onClick={claim}>Claim</Button>
            </div>
            <div>
                <AccountInfo />
                <div>
                    {JSON.stringify(data)}
                </div>
            </div>
        </div>
    )
}

export const Web3ModalPage = () => {
    return (
        <Web3Provider >
            <ETHWalletContainer />
        </Web3Provider>
    )
}