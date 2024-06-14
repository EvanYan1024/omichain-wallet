
import { SiweMessage } from 'siwe';
import { Button, useToast } from '@chakra-ui/react';
import { signMessage } from 'wagmi/actions';
import { useAccount, useChainId } from 'wagmi';
import { wagmiConfig } from '../components/Wagmi';
import { Web3Provider } from '../components/Web3Modal';


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


    async function signInWithEthereum() {
        try {
            const message = createSiweMessage(
                address!,
                'Sign in with Ethereum to the app.'
            );
            console.log(message, 'msg')
            const res = await signMessage(wagmiConfig, {
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
            <div><Button id='siweBtn' onClick={signInWithEthereum}>Sign Message</Button></div>
            <div>
                <AccountInfo />
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