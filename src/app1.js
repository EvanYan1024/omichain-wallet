// import { ethers } from 'ethers';

// import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
// import { mantle } from 'viem/chains'
// import { privateKeyToAccount } from 'viem/accounts'


// const privateKey = '0xa266dda87427af104448f9d1774d6918622ae780c3bd9cb6c732f61a66901efc';

// const rpc = 'https://rpc.testnet.mantle.xyz';

// const targetAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';

// const transferViem = async () => {
//   const mantleTestnet = {
//     id: 5001,
//     name: "Mantle Testnet",
//     network: "Mantle Testnet",
//     nativeCurrency: {
//       decimals: 18,
//       name: "Mantle",
//       symbol: "MNT",
//     },
//     rpcUrls: {
//       public: { http: ["https://rpc.testnet.mantle.xyz"] },
//       default: { http: ["https://rpc.testnet.mantle.xyz"] },
//     },
//     blockExplorers: {
//       default: {
//         name: "Mantle Explorer",
//         url: "https://explorer.testnet.mantle.xyz/",
//       },
//     },
//     contracts: {
//       multicall3: {
//         address: "0xca11bde05977b3631167028862be2a173976ca11",
//         blockCreated: 56133,
//       },
//     },
//   }

// const client = createPublicClient({
//   chain: mantleTestnet,
//   transport: http()
// })

// const walletClient = createWalletClient({
//   chain: mantleTestnet,
//   transport: http()
// })

// const chainId = await client.getChainId() 

// const account = privateKeyToAccount(privateKey)

// const request = await walletClient.prepareTransactionRequest({ 
//   account,
//   to: targetAddress,
//   value: parseEther('1')
// })

// const signature = await walletClient.signTransaction(request)

// console.log(signature, 'sign')
// const hash = await walletClient.sendRawTransaction({serializedTransaction: signature})

// // const signature = await account.signTransaction({
// //   to: '0x289FDd512EED6A36959639DaE284524E82d71DEb',
// //   value: parseEther('1'),
// //   chainId,
// //   type: 'eip1559' 
// // });

// // console.log(signature);

// // const hash = await client.sendRawTransaction(signature)

// console.log(hash);

// const transaction = await client.getTransaction({
//   hash: hash
// });


// console.log(transaction)

// const amount = await client.getBalance({address: targetAddress});

// console.log(amount)
// }

// const transfer = async () => {

//   const provider = new ethers.JsonRpcProvider(rpc)

//   // 利用私钥和provider创建wallet对象
//   const wallet = new ethers.Wallet(privateKey, provider)

//   const balance = await provider.getBalance(wallet.address);
//   console.log('Wallet Balance:', ethers.formatEther(balance));

//   const tx = {
//       to: targetAddress,
//       value: ethers.parseEther("1")
//   }
//   // iii. 发送交易，获得收据
//   console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
//   const receipt = await wallet.sendTransaction(tx)
//   await receipt.wait() // 等待链上确认交易
//   console.log(receipt) // 打印交易详情

//   const balance2 = await provider.getBalance(targetAddress);
//   console.log('Target Wallet Balance:', ethers.formatEther(balance2));
// }


// const client = createWalletClient({
//   chain: mantleTestnet,
//   transport: http(),
// }).extend(publicActions);

// // type EthHash = `0x${string}`;

// async function watchContract() {
//   const unWatch = client.watchEvent({
//     onLogs: async (logs) => {
//       console.time('t1');
//       const txDetailList = await Promise.all(
//         logs.map((x) =>
//           client.getTransaction({ hash: x.transactionHash as EthHash }),
//         ),
//       );
//       const txList = txDetailList
//         .map((x) => {
//           return {
//             from: x.from,
//             to: x.to,
//             nonce: x.nonce,
//             value: x.value,
//             blockHash: x.blockHash,
//             blockNumber: x.blockNumber,
//             gas: x.gas,
//             gasPrice: x.gasPrice,
//           };
//         })
//         .filter((x) => x.value > BigInt('0'));

//       console.log(
//         'total tx = ',
//         txDetailList.length,
//         'transfer tx = ',
//         txList.length,
//       );

//       const toMeTxList = txList.filter(
//         (x) =>
//           (x.to as string).endsWith('3689') ||
//           x.from === '0x289FDd512EED6A36959639DaE284524E82d71DEb'.toLowerCase(),
//       );

//       console.log('to me', toMeTxList);

//       console.log('\n');

//       console.timeEnd('t1');
//     },
//   });
// }

// !(async function main() {
//   const b = await client.getBalance({
//     address: '0x8C919e14C3A450aba0590D9e24Bb788Ab5183689',
//   });
//   console.log(`${formatEther(b)}`);

//   await watchContract();
// })();

