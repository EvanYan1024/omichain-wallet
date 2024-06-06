import { Button } from '@chakra-ui/react';

import { BtcWallet } from '@okxweb3/coin-bitcoin';

const w = new BtcWallet();

export const OKXWallet = () => {
    const connect = async () => {
        console.log('connect')
        const result = await window.okxwallet.bitcoin.connect()
        console.log(result)
        const signStr = 'need sign string';
        const res = await window.okxwallet.bitcoin.signMessage(
            signStr,
            {
                from: result.address
            }
        )
        console.log(res);
        const r0 = await w.verifyMessage({
            signature: res,
            data: {
                message: signStr,
                address: result.address,
                publicKey: result.compressedPublicKey,
                type: 0,
            },
        });

        console.log('r0', r0);

    }
    return (
        <div>
            <div>
                <Button onClick={connect}>Connect OKX</Button>
                <button >Sign OKX</button>
            </div>
        </div>
    )
}