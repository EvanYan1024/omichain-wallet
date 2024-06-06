import { Wallet } from '@cardano-foundation/cardano-connect-with-wallet-core';

const wallets = Wallet.getInstalledWalletExtensions();
console.log(Wallet, wallets);


export const ADAWallet = () => {
    const connectADA = () => {
        //
        Wallet.connect(wallets[0], 'mainnet', async () => {
          const user = await Wallet.getRewardAddresses();
          console.log(user, 'user');
        });
      }
    
      const SignADA = () => {
        const msg = `{
          "statement": "Welcome to EthSign",
          "chainId": 1,
          "address": "stake1uxys9nrkvvj3uuut5ttp7r5xsewnhn3nsehnu0u7jdvmawqemak7k",
          "issuedAt": "2023-12-06T08:04:56.542Z",
          "domain": "localhost:3001",
          "uri": "http://localhost:3001",
          "version": "1",
        }`
        let hexMessage = '';
        for (var i = 0, l = msg.length; i < l; i++) {
          hexMessage += msg.charCodeAt(i).toString(16);
        }
        console.log(hexMessage);
        Wallet.signMessage(msg, (signature, key) => {
          console.log(signature, key);
        })
      }
    
    return (
        <div>
 <div>
          <button id='connectWalletBtn' onClick={connectADA}>Connect ADA</button>
          <button onClick={SignADA}>Sign ADA</button>
        </div>
        </div>
    )
}