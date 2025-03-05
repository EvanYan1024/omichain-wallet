import { TonClient } from '@ton/ton';
import { BaseAirdropClient } from './BaseAirdropClient';
import { TonConnectUI } from '@tonconnect/ui-react';
import { AirdropService as TonAirdropService } from './core/ton/AirdropService';
import { getAirdropPro, getAirdropProject } from './services';
import { ChainId, TonAirdropOptions, TonContractWrapperOptions } from './types';
import { getTonProjectIdByAddress } from './common';

export class TonAirdropClient extends BaseAirdropClient {
  private tonClient?: TonClient;
  private slug?: string;
  private contractInstances = new Map<string, TonAirdropService>();

  constructor(params: TonAirdropOptions) {
    super(params);
    if ('slug' in params) {
      this.slug = params.slug;
    }
    this.tonClient = params.tonClient;
  }

  protected async initializeProjects(address?: string) {
    let projectIds: string[] = this.projectId ? [this.projectId] : [];
    if (this.slug) {
      const res = await getAirdropPro(this.slug, this.endpoint);
      const projectMap = res?.childProjectMapping;

      let legacyProjectId: string | undefined;
      if (!address) {
        legacyProjectId = Object.values(projectMap)[0];
      } else {
        legacyProjectId = getTonProjectIdByAddress({ address, slug: this.slug, data: projectMap });
      }

      if (legacyProjectId) {
        projectIds = [...projectIds, legacyProjectId];
      }
    }
    this.projects = await Promise.all(projectIds.map(async (projectId) => getAirdropProject(projectId, this.endpoint)));
  }

  getAirdropContractWrapper(options: TonContractWrapperOptions): TonAirdropService {
    const instanceKey = `${options.chainId}:${options.contractAddress}`;

    if (!this.contractInstances.has(instanceKey)) {
      const instance = new TonAirdropService({
        chainId: options.chainId.toString(),
        address: options.contractAddress,
        walletClient: options.walletClient as TonConnectUI,
        tonClient: this.tonClient
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

  async claimAirdrop(
    { claimId, walletClient }: { claimId: string; walletClient: TonConnectUI },
    options: { onLoading?: () => void }
  ) {
    const claimData = this.getClaimDataById(claimId);

    const contractWrapper = this.getAirdropContractWrapper({
      chainId: claimData.project.chainId as ChainId,
      contractAddress: claimData.project.contractAddress,
      walletClient
    });

    return contractWrapper.claim(claimData, options);
  }

  async checkClaimed(claimId: string): Promise<boolean> {
    const claimData = this.getClaimDataById(claimId);

    const contractWrapper = this.getAirdropContractWrapper({
      chainId: claimData.project.chainId as ChainId,
      contractAddress: claimData.project.contractAddress,
      tonClient: this.tonClient
    });

    return contractWrapper.checkClaimed(claimData);
  }

  async getPaused() {
    const project = this.getProjectInfo();
    const contractWrapper = this.getAirdropContractWrapper({
      chainId: project.chainId as ChainId,
      contractAddress: project.contractAddress,
      tonClient: this.tonClient
    });
    return contractWrapper.getPaused();
  }

  async getVersion() {
    const project = this.getProjectInfo();
    return project?.version;
  }
}
