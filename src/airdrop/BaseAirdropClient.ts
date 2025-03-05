import { getAirdropProject, getAirdropProjectId, getAirdropQuery } from './services';
import {
  BaseAirdropOptions,
  ChainType,
  ContractWrapperOptions,
  IAirdropClaim,
  IAirdropService,
  IProject,
  IWalletClient
} from './types';

export abstract class BaseAirdropClient {
  protected endpoint?: string;
  protected projectId?: string;
  protected claims?: IAirdropClaim[];
  protected projects?: IProject[];

  constructor(params: BaseAirdropOptions) {
    this.endpoint = params.endpoint;
    this.projectId = params.projectId;
    this.initializeProjects();
  }

  abstract getAirdropContractWrapper(options: ContractWrapperOptions): IAirdropService | undefined;

  async fetchAirdropProjectIds(data: { recipient: string; slug: string }) {
    const res = await getAirdropProjectId(data, this.endpoint);
    return res;
  }

  protected async initializeProjects(address?: string) {
    const projectIds: string[] = this.projectId ? [this.projectId] : [];
    this.projects = await Promise.all(projectIds.map(async (projectId) => getAirdropProject(projectId, this.endpoint)));
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
          this.endpoint
        );
        return res.claims?.map((it) => ({
          ...it,
          project: project,
          claimId: project.chainType === ChainType.Evm ? `${project.id}:${it.leaf}` : `${project.id}:${it.index}`
        }));
      })
    );
    this.claims = claimsRes.flat();
    return this.claims;
  }

  getProjectInfo() {
    const project = this.projects?.[0];
    if (!project) throw new Error('Project not found');
    return project;
  }

  abstract claimAirdrop(
    params: { claimId: string; walletClient: IWalletClient },
    options: { onLoading?: () => void }
  ): Promise<unknown>;

  abstract checkClaimed(claimId: string): Promise<boolean>;
}
