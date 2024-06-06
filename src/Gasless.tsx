import { Biconomy } from "@biconomy/mexa";
import { Contract, Interface } from "ethers";
import { useEffect } from "react";
// import sigUtil from 'eth-sig-util';
import abi from './contracts/Coffee.json';


const CONTRACT_ADDRESS = '0x7aE63fe6350076bB0a89B346C3AbD3341bE7716a';
const CONTRACT_ABI = abi;
const APIKEY = 'riC3c_VF_.508ed67a-7ce2-4e16-99d6-26ea4579ec99'

export type ExternalProvider = {
    isMetaMask?: boolean;
    isStatus?: boolean;
    host?: string;
    path?: string;
    sendAsync?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
    send?: (request: { method: string, params?: Array<any> }, callback: (error: any, response: any) => void) => void
    request?: (request: { method: string, params?: Array<any> }) => Promise<any>
}

// To create contract instances you can do:
// const contractInstance = new Contract(
//     config.contract.address,
//     config.contract.abi,
//     biconomy.ethersProvider
// );

export const GasLess = () => {
    const userAddress = '';

    const biconomy = new Biconomy(window.ethereum as ExternalProvider, {
    apiKey: APIKEY,
    debug: true,
    contractAddresses: [CONTRACT_ADDRESS], // list of contract address you want to enable gasless on
});

    let contract = new Contract(CONTRACT_ADDRESS, biconomy.getSignerByAddress(userAddress));

    let contractInterface = new Interface(CONTRACT_ABI);

    const init = async () => {
        await biconomy.init();
    }

    useEffect(() => {
        init();
    }, [])

    const sendTransaction = async () => {
        let functionSignature = contractInterface.encodeFunctionData("setQuote", [newQuote]);

        let rawTx = {
            to: CONTRACT_ADDRESS,
            data: functionSignature,
            from: userAddress
        };

        let signedTx = await userSigner.signTransaction(rawTx);
        // should get user message to sign for EIP712 or personal signature types
        const forwardData = await biconomy.getForwardRequestAndMessageToSign(signedTx);
        console.log(forwardData);

        // optionally one can sign using sigUtil
        const signature = sigUtil.signTypedMessage(new Buffer.from(privateKey, 'hex'), { data: forwardData.eip712Format }, 'V3');

        let data = {
            signature: signature,
            forwardRequest: forwardData.request,
            rawTransaction: signedTx,
            signatureType: biconomy.EIP712_SIGN
        };

        let provider = biconomy.getEthersProvider();
        // send signed transaction with ethers
        // promise resolves to transaction hash                  
        let txHash = await provider.send("eth_sendRawTransaction", [data]);

        let receipt = await provider.waitForTransaction(txHash);
        //do somethi
    }

    return (
        <div>
            11
        </div>
    )
}