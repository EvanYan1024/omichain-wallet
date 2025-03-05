import { getAirdropProject, getAirdropProjectId, getAirdropQuery } from './services';
import {
  AirdropConstructorOptions,
  ChainId,
  ChainType,
  ContractWrapperOptions,
  IAirdropClaim,
  IAirdropService,
  IProject,
  IWalletClient
} from './types';
import { AirdropService as TonAirdropService } from './core/ton/AirdropService';
import { AirdropService as EvmAirdropService } from './core/evm/AirdropService';
import { TonClient } from '@ton/ton';
import { WalletClient as ViemWalletClient } from 'viem';
import { TonConnectUI } from '@tonconnect/ui-react';

export class AirdropClient {
  private baseURL?: string;
  private tonClient?: TonClient;

  private projectId?: string;
  private slug?: string;
  private claims?: IAirdropClaim[];
  private projects?: IProject[];

  constructor(params: AirdropConstructorOptions) {
    const { baseURL } = params;
    if (params.chainType === ChainType.Ton) {
      // 类型守卫
      if ('slug' in params) {
        this.slug = params.slug;
      } else {
        this.projectId = params.projectId;
      }
    } else {
      this.projectId = params.projectId;
    }
    this.baseURL = baseURL;
  }

  async fetchAirdropProjectIds(data: { recipient: string; slug: string }) {
    const res = await getAirdropProjectId(data, this.baseURL);
    return res;
  }

  private async initializeProjects(address: string) {
    let projectIds: string[] = this.projectId ? [this.projectId] : [];
    if (this.slug) {
      // airdrop-pro
      const res = await this.fetchAirdropProjectIds({
        recipient: address,
        slug: this.slug
      });
      projectIds = [...projectIds, ...res.projectIds];
    }

    // 项目映射 todo
    this.projects = await Promise.all(projectIds.map(async (projectId) => getAirdropProject(projectId, this.baseURL)));
  }

  async fetchAirdropClaims(data: { address: string }) {
    if (!this.projects) {
      await this.initializeProjects(data.address);
    }

    if (!this.projects?.length) {
      return [];
    }

    const claimsRes = await Promise.all(
      this.projects.map(async (project) => {
        const res = await getAirdropQuery(
          {
            recipient: data.address,
            projectId: project.id,
            recipientType: project.recipientType
          },
          this.baseURL
        );
        return res.claims?.map((it) => ({
          ...it,
          project: project,
          claimId: `${project.id}:${it.index}`
        }));
      })
    );
    const claims = claimsRes.flat();
    this.claims = claims;
    return claims;
  }

  getProjectList() {
    return this.projects;
  }

  // factory
  private getAirdropContractWrapper({
    chainId,
    contractAddress,
    ...options
  }: ContractWrapperOptions): IAirdropService | undefined {
    if (options.chainType === ChainType.Ton) {
      return new TonAirdropService({
        chainId: chainId.toString(),
        address: contractAddress,
        walletClient: options.walletClient as TonConnectUI,
        tonClient: options.tonClient
      });
    }
    if (options.chainType === ChainType.Evm) {
      return new EvmAirdropService({
        contractAddress: contractAddress,
        chainId: Number(chainId) as ChainId,
        walletClient: options.walletClient as ViemWalletClient
      });
    }
    throw new Error('Unsupported chain type');
  }

  claimAirdrop(
    { claimId, walletClient }: { claimId: string; walletClient: IWalletClient },
    options: { onLoading?: () => void }
  ) {
    const claimData = this.claims?.find((it) => it.claimId === claimId);
    if (!claimData) {
      throw new Error('Claim data not found');
    }
    const project = claimData.project;
    // 单例
    const contractWrapper = this.getAirdropContractWrapper({
      chainId: project.chainId as ChainId,
      contractAddress: project.contractAddress,
      walletClient: walletClient as any,
      chainType: project.chainType as any
    });
    if (!contractWrapper) {
      throw new Error('Contract wrapper not found');
    }
    return contractWrapper.claim(claimData, options);
  }

  checkClaimed(claimId: string) {
    const claimData = this.claims?.find((it) => it.claimId === claimId);
    if (!claimData) {
      throw new Error('Claim data not found');
    }
    const project = claimData.project;
    const contractWrapper = this.getAirdropContractWrapper({
      chainId: project.chainId as ChainId,
      contractAddress: project.contractAddress,
      chainType: project.chainType,
      tonClient: this.tonClient
    });
    if (!contractWrapper) {
      throw new Error('Contract wrapper not found');
    }
    if (project.chainType === ChainType.Ton) {
      return (contractWrapper as TonAirdropService).checkClaimed(claimData);
    } else if (project.chainType === ChainType.Evm) {
      return (contractWrapper as EvmAirdropService).isLeafUsed(claimData.leaf);
    }
    throw new Error('Unsupported chain type');
  }

  getPausedForTon({ contractAddress, chainId }: { contractAddress: string; chainId: string }) {
    // 前置校验
    // this.chainType === evm
    if (this.chainType === ChainType.Evm) {
      throw new Error('Unsupported chain type');
    }
    const contractWrapper = this.getAirdropContractWrapper({
      chainId: chainId as ChainId,
      contractAddress: contractAddress,
      chainType: ChainType.Ton,
      tonClient: this.tonClient
    });
    if (!contractWrapper) {
      throw new Error('Contract wrapper not found');
    }
    return (contractWrapper as TonAirdropService).getPaused();
  }
}


// const client = new AirdropClient({
//   projectId: 'AD_TEV94wvkxkvn',
//   endpoint: 'http://ec2-3-89-178-45.compute-1.amazonaws.com:3030/api'
// });

// const project = await client.getProjectInfo();
// console.log(project);

// const claims = await client.getAirdropClaims({
//   address: '0xDfc4FbbDd9C47c7976fEBb14B1D37C7f85FE299D'
// });

// console.log(claims);

// const isClaimable = await client.checkClaimed(claims[0].claimId as string);

// console.log(isClaimable);