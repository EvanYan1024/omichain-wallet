import { useEffect, useState } from "react";
import { ArgentTMA, SessionAccountInterface } from "@argent/tma-wallet";
import { Account } from "starknet";
import { Button } from "@chakra-ui/react";

const argentTMA = ArgentTMA.init({
    environment: "sepolia", // "sepolia" | "mainnet" (not supperted yet)
    appName: "My TG Mini Test Dapp", // Your Telegram app name
    appTelegramUrl: "https://t.me/norvos_bot/norvos", // Your Telegram app URL
    sessionParams: {
        allowedMethods: [
            // List of contracts/methods allowed to be called by the session key
            {
                contract:
                    "0x036133c88c1954413150db74c26243e2af77170a4032934b275708d84ec5452f",
                selector: "increment",
            }
        ],
        validityDays: 90 // session validity (in days) - default: 90
    },
});

export function TmaWalletApp() {
    const [account, setAccount] = useState<SessionAccountInterface | undefined>();
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        // Call connect() as soon as the app is loaded
        argentTMA
            .connect()
            .then((res) => {
                if (!res) {
                    // Not connected
                    setIsConnected(false);
                    return;
                }

                if (account.getSessionStatus() !== "VALID") {
                    // Session has expired or scope (allowed methods) has changed
                    // A new connection request should be triggered

                    // The account object is still available to get access to user's address
                    // but transactions can't be executed
                    const { account } = res;

                    setAccount(account);
                    setIsConnected(false);
                    return;
                }

                // Connected
                const { account, callbackData } = res;
                // The session account is returned and can be used to submit transactions
                setAccount(account);
                setIsConnected(true);
                // Custom data passed to the requestConnection() method is available here
                console.log("callback data:", callbackData);
            })
            .catch((err) => {
                console.error("Failed to connect", err);
            });
    }, []);

    const handleConnectButton = async () => {
        // If not connected, trigger a connection request
        // It will open the wallet and ask the user to approve the connection
        // The wallet will redirect back to the app and the account will be available
        // from the connect() method -- see above
        await argentTMA.requestConnection("custom_callback_data");
    };

    // useful for debugging
    const handleClearSessionButton = async () => {
        await argentTMA.clearSession();
        setAccount(undefined);
    };

    return (
        <>
            <div>
                {!isConnected && <Button onClick={handleConnectButton}>Connect</Button>}

                {isConnected && (
                    <>
                        <p>
                            Account address: <code>{account.address}</code>
                        </p>
                        <Button onClick={handleClearSessionButton}>Clear Session</Button>
                    </>
                )}
            </div>
        </>
    );
}
