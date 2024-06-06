export const getTokenInfo1 = async (address: string, chainId: number, account: string): Promise<any> => {
    const ERC20Contract = {
      address: address,
      abi: ERC20ABI.abi,
      chainId,
    };
    const calls = [
      {
        ...ERC20Contract,
        functionName: 'balanceOf',
        args: [account]
      },
      {
        ...ERC20Contract,
        functionName: 'totalSupply'
      },
      {
        ...ERC20Contract,
        functionName: 'decimals'
      },
      {
        ...ERC20Contract,
        functionName: 'symbol'
      },
      {
        ...ERC20Contract,
        functionName: 'name'
      }
    ];
  
    const multicallResult = await readContracts({
      contracts: calls as any
    });
  
    const balance = multicallResult[0].result as unknown as bigint;
  
    const totalSupply = multicallResult[1].result as unknown as bigint;
    const decimals = multicallResult[2].result as unknown as bigint;
  
    const totalSupplyInEther = new BN(BigIntToNumber(totalSupply)).div(10 ** BigIntToNumber(decimals)).toNumber();
  
    const symbol = multicallResult[3].result as unknown as string;
    const name = multicallResult[4].result as unknown as string;
  
    return {
      symbol,
      name,
      balance: String(BigIntToNumber(balance)),
      totalSupply: totalSupplyInEther,
      decimals: BigIntToNumber(decimals)
    };
  };