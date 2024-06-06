import { createWalletClient, http, publicActions, formatEther } from 'viem';
import { mantleTestnet } from 'viem/chains';

const client = createWalletClient({
  chain: mantleTestnet,
  transport: http(),
}).extend(publicActions);


async function watchContract() {
  const unWatch = client.watchEvent({
    onLogs: async (logs) => {
      console.time('t1');
      const txDetailList = await Promise.all(
        logs.map((x) =>
          client.getTransaction({ hash: x.transactionHash }),
        ),
      );
      const txList = txDetailList
        .map((x) => {
          return {
            from: x.from,
            to: x.to,
            nonce: x.nonce,
            value: x.value,
            blockHash: x.blockHash,
            blockNumber: x.blockNumber,
            gas: x.gas,
            gasPrice: x.gasPrice,
          };
        })

      console.log(
        'total tx = ',
        txDetailList.length,
        'transfer tx = ',
        txList,
      );

      const toMeTxList = txList.filter(
        (x) =>
          x.from.toLowerCase() === '0xDfc4FbbDd9C47c7976fEBb14B1D37C7f85FE299D'.toLowerCase(),
      );

      console.log('to me', toMeTxList);

      console.log('\n');

      console.timeEnd('t1');
    },
  });
}

!(async function main() {
  const b = await client.getBalance({
    address: '0xDfc4FbbDd9C47c7976fEBb14B1D37C7f85FE299D',
  });
  console.log(`${formatEther(b)}`);

  await watchContract();
})();