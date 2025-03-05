import { BaseAirdropClient } from './BaseAirdropClient';
import { ChainId, EvmContractWrapperOptions } from './types';
import { AirdropService as EvmAirdropService } from './core/evm/AirdropService';
import { WalletClient as ViemWalletClient } from 'viem';

export class EvmAirdropClient extends BaseAirdropClient {
  private contractInstances = new Map<string, EvmAirdropService>();
  getAirdropContractWrapper(options: EvmContractWrapperOptions): EvmAirdropService {
    const instanceKey = `${options.chainId}:${options.contractAddress}`;
    if (!this.contractInstances.has(instanceKey)) {
      const instance = new EvmAirdropService({
        contractAddress: options.contractAddress,
        chainId: Number(options.chainId) as ChainId,
        walletClient: options.walletClient as ViemWalletClient
      });
      this.contractInstances.set(instanceKey, instance);
    }

    return this.contractInstances.get(instanceKey)!;
  }

  private getClaimDataById(claimId: string) {
    const claimData = this.claims?.find((it) => it.claimId === claimId);
    if (!claimData) throw new Error('Claim data not found');
    return claimData;
  }

  async claimAirdrop({ claimId, walletClient }: { claimId: string; walletClient: ViemWalletClient }) {
    const claimData = this.getClaimDataById(claimId);

    const contractWrapper = this.getAirdropContractWrapper({
      chainId: claimData.project.chainId as ChainId,
      contractAddress: claimData.project.contractAddress,
      walletClient
    });

    return contractWrapper.claim(claimData);
  }

  async checkClaimed(claimId: string): Promise<boolean> {
    const claimData = this.getClaimDataById(claimId);

    const contractWrapper = this.getAirdropContractWrapper({
      chainId: Number(claimData.project.chainId) as ChainId,
      contractAddress: claimData.project.contractAddress
    });

    return contractWrapper.isLeafUsed(claimData.leaf);
  }

  async batchFetchClaimed(leafs: string[]) {
    const claimData = this.claims?.[0];
    if (!claimData) throw new Error('Claim data not found');

    const contractWrapper = this.getAirdropContractWrapper({
      chainId: Number(claimData.project.chainId) as ChainId,
      contractAddress: claimData.project.contractAddress
    });

    return contractWrapper.batchFetchClaimed(leafs);
  }

  async getClaimFee(amount: bigint) {
    const claimData = this.claims?.[0];
    if (!claimData) throw new Error('Claim data not found');

    const contractWrapper = this.getAirdropContractWrapper({
      chainId: Number(claimData.project.chainId) as ChainId,
      contractAddress: claimData.project.contractAddress
    });

    return contractWrapper.getClaimFee(claimData.project.contractAddress, amount);
  }
}
