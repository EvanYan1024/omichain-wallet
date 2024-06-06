import {
    useAccount,
    useContract, useNetwork,
    useProvider,
} from "@starknet-react/core";
import ABI from "./abi.json";
import { Contract } from "starknet";


export const useSNRC20Contract = () => {
    const {account} = useAccount();
    const {provider} = useProvider();
    const network = useNetwork();
    console.log(network.chain.name)

    // const { contract } = useContract({
    //     abi: ABI.abi,
    //     address: '0x033fa8fd68f18468dd21fd655cc31b6f95cd0175b0068602e364d50f8e9d7868',
    //     provider: provider,
    // });
    const contract = new Contract(ABI.abi, '0x033fa8fd68f18468dd21fd655cc31b6f95cd0175b0068602e364d50f8e9d7868', provider);

    contract?.connect(account!)

    const waitForTransaction = async (hash: any) => {
        console.log("Transaction has been submitted");

        const recipient = await provider.waitForTransaction(hash);

        if ((recipient as any)?.execution_status === "SUCCEEDED") {
            console.log("Transaction has been confirmed");
        } else {
            console.log("Transaction has failed");
        }
    }

    const deploy = async () => {
        console.log(contract)
        const res = await contract?.invoke("deploy_ttsuite", ['0x078f409ec22b7a830cb8ba2c2065725c2071e9ea5cbcc0e46f99f8795fe0239c', 'TT_ZW7l54gQhQEg', false, true, true, true]);
        console.log(res)
        // const call = contract?.populate("deploy_ttsuite", ['0x078f409ec22b7a830cb8ba2c2065725c2071e9ea5cbcc0e46f99f8795fe0239c', 'TT_ZW7l54gQhQEg', false, true, true, true]);
        // console.log(call)
        // const res = await contract?.deploy_ttsuite(call?.calldata);
        // await waitForTransaction(res?.transaction_hash);
    }

    const mint = async (tick: string, amount: number) => {
        const call = contract?.populate("mint", [tick, amount]);
        const res = await contract?.mint(call?.calldata);
        await waitForTransaction(res?.transaction_hash);
    }

    const transfer = async (tick: string, recipient: string, amount: number) => {
        const call = contract?.populate("transfer", [tick, recipient, amount]);
        const res = await contract?.transfer(call?.calldata);
        await waitForTransaction(res?.transaction_hash);
    }

    return {
        mint,
        deploy,
        transfer
    }
}