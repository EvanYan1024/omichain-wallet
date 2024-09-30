import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { Terminal } from "@xterm/xterm";
import '@xterm/xterm/css/xterm.css';
import { useAuthCore, useConnect, useEthereum } from "@particle-network/authkit";
import { mainnet } from "@particle-network/authkit/chains";
import { AuthType, UserInfo } from "@particle-network/auth-core";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";


export default function Home() {
    // const { connect, disconnect, connectionStatus, setSocialConnectCallback } = useConnect();
    // const { address, provider, chainInfo, signMessage } = useEthereum();
    // const { userInfo } = useAuthCore();

    // useEffect(() => {
    //     setSocialConnectCallback({
    //         onError: (error: any) => {
    //             console.log('SocialConnectCallback onError', error);
    //         },
    //         onSuccess: (info: UserInfo) => {
    //             console.log('SocialConnectCallback onSuccess', info);
    //         },
    //     });
    //     return () => {
    //         setSocialConnectCallback(undefined);
    //     };
    // }, []);
    const sdk = new CoinbaseWalletSDK({
        appName: 'My App Name',
        appChainIds: [8453]
    });

    const connectCb = async () => {
        const provider = sdk.makeWeb3Provider({ options: 'all' });
        // Use provider
        const addresses = await provider.request({ method: 'eth_requestAccounts' });
        console.log(addresses)
    }

    // useEffect(() => {
    //     var term = new Terminal();
    //     term.open(document.getElementById('terminal'));
    //     term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    // }, [])

    const connectSocial = async (type: string) => {
        // await connect({
        //     socialType: type,
        //     chain: mainnet,
        //     authorization: {
        //         uniq: true
        //     }
        // });
    }

    return (
        <div className="mt-6">
            {/* <h1>Home</h1>
            <Button onClick={connectCb}>Connect Coinbase</Button>

            <div className="space-y-6">
                <Button onClick={() => connectSocial(AuthType.google)}>Connect Google</Button>
                <Button onClick={() => connectSocial(AuthType.twitter)}>Connect Twitter</Button>
            </div> */}

            {/* <div id="terminal" className="w-full"></div> */}
            <BackgroundGradientAnimation containerClassName="w-[1500px] h-[500px]">
                <img src="./norvos.png" alt="" className="absolute left-5 top-5 h-12" />
                <div className="absolute w-full z-50 inset-0 flex items-center justify-center text-white font-bold pointer-events-none text-xl text-center md:text-4xl lg:text-5xl">

                    <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
                        Building the Future
                        of OnChain Gaming
                    </p>
                </div>
            </BackgroundGradientAnimation>
        </div>
    )
}