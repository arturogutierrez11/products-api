import {
  ICategorySourceAdapter,
  NormalizedCategory,
} from 'src/core/adapters/repositories/categories/MatchCategoriesEngine/ICategorySourceAdapter';
import { IOncityCategoriesRepository } from 'src/core/adapters/repositories/oncity/categories/IOncityCategoriesRepository';

export class OncityCategorySourceAdapter implements ICategorySourceAdapter {
  constructor(private readonly oncityRepo: IOncityCategoriesRepository) {}

  async getCategories(): Promise<NormalizedCategory[]> {
    const tree = await this.oncityRepo.getTree();
    return this.flatten(tree);
  }

  getSheetName(): string {
    return process.env.SHEET_ONCITY_MAP_NAME ?? 'oncity_map_tree';
  }

  private flatten(tree: any[], parentPath = ''): NormalizedCategory[] {
    return tree.flatMap((node) => {
      const fullPath = parentPath ? `${parentPath} > ${node.name}` : node.name;

      const current: NormalizedCategory = {
        id: node.id,
        name: node.name,
        fullPath,
      };

      const children = node.children?.length
        ? this.flatten(node.children, fullPath)
        : [];

      return [current, ...children];
    });
  }
}
