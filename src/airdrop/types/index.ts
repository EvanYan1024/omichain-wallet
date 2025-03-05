import { TonConnectUI } from '@tonconnect/ui-react';
import { AirdropService as TonAirdropService } from '../core/ton/AirdropService';
import { AirdropService as EvmAirdropService } from '../core/evm/AirdropService';
import { TonClient } from '@ton/ton';
import { ChainConfig } from '../constants';
import { WalletClient as ViemWalletClient } from 'viem';

export type ChainId = keyof typeof ChainConfig;

export interface EvmContractClientOption {
  chainId: ChainId;
  walletClient?: ViemWalletClient;
  contractAddress: string;
  abi?: any;
}

export enum ChainType {
  Evm = 'evm',
  Ton = 'ton'
}

export interface IProject {
  id: string;
  name: string;
  chainId: string;
  chainType: ChainType;
  tokenAddress: string;
  tokenType: string;
  startTime: number;
  endTime: number;
  contractAddress: string;
  recipientType: string;
  merkleRoot: string;
  ownerAddress: string;
  blockCountries: Record<string, string>;
  themeConf: Record<string, any>;
  version: string;
  extra?: {
    kyc: boolean;
    tag: string;
  };
}

export type IAirdropClaim = {
  index: number;
  recipient: string;
  proof: string[];
  amount: string;
  unlockingAt: number;
  group: string;
  data: string;
  leaf: string;
  claimed?: boolean;

  claimId?: string;

  // ton
  claimable?: boolean;
  proofHash: string;
  ownerAddress: string;
  proofBoc: string;
  expiryTimestamp: number;
  expired?: boolean;
  project: IProject;
};

export interface IAirdropData {
  claims: IAirdropClaim[];
}

export enum TonAirdropVersionEnum {
  V1 = '1.0.0',
  V2 = '2.0.0',
  LiteV1 = '11.0.0'
}

export enum EvmAirdropVersionEnum {
  V0 = '0.0.2', // 兼容btc减半 airdrop
  V3 = '0.3.0', // zeta 收费
  V4 = '0.4.0' // zeta kyc、kyc threshold
}

export type IWalletClient = TonConnectUI | ViemWalletClient;

export type IAirdropService = TonAirdropService | EvmAirdropService;

export type BaseAirdropOptions = {
  endpoint?: string;
  projectId?: string;
};

type BaseTonConfig = {
  endpoint?: string;
  tonClient?: TonClient;
};

// 使用 projectId 的配置
type TonProjectIdConfig = BaseTonConfig & {
  projectId: string;
  slug?: never; // 禁用 slug
};

// 使用 slug 的配置
type TonSlugConfig = BaseTonConfig & {
  slug: string;
  projectId?: never; // 禁用 projectId
};

export type TonAirdropOptions = TonProjectIdConfig | TonSlugConfig;

export interface EvmAirdropOptions extends BaseAirdropOptions {
  projectId: string;
}

export interface TonContractWrapperOptions {
  // chainId: ChainId;
  // contractAddress: string;
  walletClient?: TonConnectUI;
  tonClient?: TonClient;
}

export interface EvmContractWrapperOptions {
  // chainId: ChainId;
  // contractAddress: string;
  walletClient?: ViemWalletClient;
}

export type ContractWrapperOptions = TonContractWrapperOptions | EvmContractWrapperOptions;

interface IAirdropOptions {
  endpoint?: string;
  tonClient?: TonClient;
  projectId?: string;
  slug?: string;
}
