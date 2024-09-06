import {CoinbaseWalletSDK} from "@coinbase/wallet-sdk";
import {Button} from "@chakra-ui/react";


export default function Home() {
    const sdk = new CoinbaseWalletSDK({
        appName: 'My App Name',
        appChainIds: [8453]
    });

    const connect = async () => {
        const provider = sdk.makeWeb3Provider({options: 'all'});
// Use provider
        const addresses = await provider.request({method: 'eth_requestAccounts'});
        console.log(addresses)
    }

    return (
        <div>
            <h1>Home</h1>
            <Button onClick={connect}>Connect Coinbase</Button>
        </div>
    )
}