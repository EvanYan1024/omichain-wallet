import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Cluster,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { customAlphabet } from "nanoid";
import { Umi, Signer, TransactionBuilder } from "@metaplex-foundation/umi";
import { WalletAdapter } from "@solana/wallet-adapter-base";

export const getCustomNaNoId = (): string => {
  const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
  return nanoid();
};

const encodeURL = (baseUrl: string, searchParams: Record<string, string>) => {
  // This was a little new to me, but it's the
  // recommended way to build URLs with query params
  // (and also means you don't have to do any encoding)
  // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  const url = new URL(baseUrl);
  url.search = new URLSearchParams(searchParams).toString();
  return url.toString();
};

export const getExplorerLink = (
  linkType: "transaction" | "tx" | "address" | "block",
  id: string,
  cluster: Cluster | "localnet" = "mainnet-beta"
): string => {
  const searchParams: Record<string, string> = {};
  if (cluster !== "mainnet-beta") {
    if (cluster === "localnet") {
      // localnet technically isn't a cluster, so requires special handling
      searchParams["cluster"] = "custom";
      searchParams["customUrl"] = "http://localhost:8899";
    } else {
      searchParams["cluster"] = cluster;
    }
  }
  let baseUrl: string = "";
  if (linkType === "address") {
    baseUrl = `https://explorer.solana.com/address/${id}`;
  }
  if (linkType === "transaction" || linkType === "tx") {
    baseUrl = `https://explorer.solana.com/tx/${id}`;
  }
  if (linkType === "block") {
    baseUrl = `https://explorer.solana.com/block/${id}`;
  }
  return encodeURL(baseUrl, searchParams);
};

export const createMint = async ({
  connection,
  wallet,
}: {
  connection: any;
  wallet: any;
}) => {
  const { publicKey, sendTransaction } = wallet;
  const mint = Keypair.generate();

  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  const transaction = new Transaction();

  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mint.publicKey,
      0,
      publicKey,
      publicKey,
      TOKEN_PROGRAM_ID
    )
  );

  await sendTransaction(transaction, connection, {
    signers: [mint],
  });
  return mint.publicKey;
};

export function createSignerFromWallet(
  umi: Umi,
  wallet: WalletAdapter
): Signer {
  return {
    publicKey: new PublicKey(wallet.publicKey),
    signMessage: async (message) => {
      const signature = await wallet.signMessage!(message);
      return { signature };
    },
    signTransaction: async (transaction) => {
      const serializedTransaction = transaction.serializedTransaction;
      const signedTransaction = await wallet.signTransaction!(
        umi.transactions.deserializeTransaction(serializedTransaction)
      );
      return {
        ...transaction,
        serializedTransaction:
          umi.transactions.serializeTransaction(signedTransaction),
      };
    },
    signAllTransactions: async (transactions) => {
      return Promise.all(transactions.map((tx) => this.signTransaction(tx)));
    },
  };
}
