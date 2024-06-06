import { RainbowKitApp, config } from "../components/Rainbowkit"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import abi from './abi.json';
import { Button } from "@chakra-ui/react";
import { useWriteContract } from "wagmi";
import { writeContract } from "wagmi/actions";
import { baseSepolia, zetachainAthensTestnet } from "viem/chains";


const Content = () => {
    // const { writeContract } = useWriteContract();

    console.log(zetachainAthensTestnet)


    const deploy = async () => {
        console.log('deploy')
        try {
            await writeContract(config, {
                abi: abi.abi,
                address: '0xE237C8FF82D040d98d42E237EF6Ea678eddD9A35',
                functionName: 'deployTTSuite',
                args: ['0x807a0f499b521A90d21E1641FdB37BeeB66BE89d', 'TT_Q9uw383ZjLdL', false, false, true, true, true]
            })
        } catch (e) {
            console.log(e)
        }
    }

    const withdraw = async () => {
        const abi = [
            {
                inputs: [
                    {
                        internalType: 'bytes',
                        name: '',
                        type: 'bytes',
                    },
                ],
                name: 'withdraw',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ]
        try {
            await writeContract(config, {
                abi: abi,
                address: '0x6b40E523C17756932A80EBcb1A5b959F540e6354',
                functionName: 'withdraw',
                chainId: baseSepolia.id,
                args: ['0x807a0f499b521A90d21E1641FdB37BeeB66BE89d']
            })
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div>
            <h1>Content</h1>
            <div className="flex">
                <Button onClick={deploy}>Deploy</Button>
                <Button onClick={withdraw}>Withdraw</Button>
            </div>
            <div>
                {JSON.stringify(window.ethereum.isMetaMask)}
            </div>
        </div>
    )

}


export const RainbowAppPage = () => {
    return (
        <RainbowKitApp>
            <div>
                <h1>RainbowKit</h1>
                <ConnectButton />
            </div>
            <Content />
        </RainbowKitApp>
    )
}