import { BaseAirdropClient } from './BaseAirdropClient';
import { EvmAirdropClient } from './EvmAirdropClient';
import { TonAirdropClient } from './TonAirdropClient';
import { getAirdropProject } from './services';

export type CreateAirdropClientParams = {
  endpoint: string;
  projectId?: string;
  slug?: string;
  tonClient?: any;
};

export class AirdropClientFactory {
  static async create(params: CreateAirdropClientParams): Promise<BaseAirdropClient> {
    // 先获取项目信息
    let projectInfo;
    if (params.projectId) {
      projectInfo = await getAirdropProject(params.projectId, params.endpoint);
    } else if (params.slug) {
      // 如果只有 slug，可能需要先通过其他 API 获取项目信息
      // ... 获取项目信息的逻辑
    } else {
      throw new Error('Either projectId or slug must be provided');
    }

    // 根据项目信息创建对应的 client
    switch (projectInfo.chain) {
      case 'TON':
        return new TonAirdropClient({
          ...params,
          projectId: params.projectId
        });
      case 'EVM':
        return new EvmAirdropClient({
          ...params,
          projectId: params.projectId
        });
      default:
        throw new Error(`Unsupported chain type: ${projectInfo.chain}`);
    }
  }
}
