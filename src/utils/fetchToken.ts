import { Contract, Provider, RpcProvider, constants, num, shortString } from "starknet";

import balanceABIFragment from './ERC20ABI.json';
import { infuraProvider } from "@starknet-react/core";


export const fetchToken = async (address: string, chainId?: number, account?: string): Promise<any> => {
    // const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.infura.io/v3/a2ab6d6bba0d466cade2c371d55b8134'});
    const provider = new RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io' })
    console.log(provider);
    const contract = new Contract(balanceABIFragment, address, provider);

    const symbolNum = await contract.symbol();
    const name = await contract.name();

    console.log(symbolNum, name, 'ff')

    const symbol = shortString.decodeShortString(num.toHex(symbolNum.symbol));

    const decimalsRes = await contract.decimals();
    const decimals = Number(decimalsRes.decimals);

    const totalSupplyRes = await contract.totalSupply();
    console.log(totalSupplyRes);
    const totalSupply = num.toBigInt(totalSupplyRes.totalSupply.low);


    const banlance = await contract.call('balanceOf', ['0x017FB88033107FfaA2f5dE324C880FDA2f4474531B87bA6790439E2F98315555']);

    console.log(banlance);

    return {
        symbol,
        decimals,
        totalSupply,
        banlance,
    };
}