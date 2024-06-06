import { TonConnectUI, toUserFriendlyAddress } from "@tonconnect/ui";
import { useEffect, useRef, useState } from "react";


export const TonWallet = () => {
    const ref = useRef(null);
    const [account, setAccount] = useState(null);
    useEffect(() => {
        console.log('111')
        const data = window.Telegram.WebApp.initData;
        console.log(data, 'data')
        if (ref.current) return;
        const tonConnectUI = new TonConnectUI({
            manifestUrl: 'https://demo-dapp.walletbot.net/demo-dapp/tonconnect-manifest.json',
            buttonRootId: null,
            actionsConfiguration: {
                returnStrategy: 'https://t.me/ethsigndev_bot/signapp?startapp=contract'
            }
        });

        const unsubscribe = tonConnectUI.onStatusChange(
            walletAndwalletInfo => {
                console.log(walletAndwalletInfo, 'info');
                setAccount(walletAndwalletInfo);
            }
        );


        ref.current = tonConnectUI;

    }, []);

    const connectTG = async () => {
        const tonConnectUI = ref.current!;
        console.log(tonConnectUI.connected, 'connect')
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
        }
        tonConnectUI.setConnectRequestParameters({
            state: 'ready',
            value: {
                tonProof: 'hello'
            }
        });
        tonConnectUI.connectWallet();
    }
    return (
        <div>
            <div>
                {/* {JSON.stringify(window.TelegramWebviewProxy)} */}
            </div>
            <button id='tg' onClick={connectTG}>
                {account ? toUserFriendlyAddress(account.account.address) : 'Connect TG'}
            </button>
            {/* <TonConnectButton /> */}
        </div>
    )
}