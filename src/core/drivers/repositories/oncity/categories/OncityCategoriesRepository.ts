import axios from 'axios';
import { IOncityCategoriesRepository } from 'src/core/adapters/repositories/categories/oncity/IOncityCategoriesRepository';
import { OncityCategory } from 'src/core/entities/oncity/categories/OncityCategory';
import { ICacheManager } from '../../../../adapters/cache/ICacheManager';

export class OncityCategoriesRepository implements IOncityCategoriesRepository {
  private readonly cacheKey = 'oncity_categories';

  constructor(private cache: ICacheManager) {}

  private readonly account = process.env.ONCITY_ACCOUNT!;
  private readonly appKey = process.env.ONCITY_APP_KEY!;
  private readonly appToken = process.env.ONCITY_APP_TOKEN!;

  async getTree(): Promise<OncityCategory[]> {
    const cached = await this.cache.get(this.cacheKey);

    if (cached && Array.isArray(cached) && cached.length > 0) {
      console.log('📦 Oncity categories loaded from cache');
      return cached;
    }

    console.log('🌍 Fetching Oncity categories from API...');

    const url = `https://${this.account}.vtexcommercestable.com.br/api/catalog_system/pvt/category/tree/125`;

    const { data } = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-VTEX-API-AppKey': this.appKey,
        'X-VTEX-API-AppToken': this.appToken
      }
    });

    const cleaned = this.cleanTree(data);

    await this.cache.save(this.cacheKey, cleaned, 1000 * 60 * 60 * 12); // 12h

    console.log('💾 On city categories cached');

    return cleaned;
  }

  private cleanTree(nodes: any[]): OncityCategory[] {
    return nodes.map(node => ({
      id: node.id,
      name: node.name,
      hasChildren: node.hasChildren,
      children: node.children?.length ? this.cleanTree(node.children) : []
    }));
  }
}
