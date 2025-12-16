import {
  ICategorySourceAdapter,
  NormalizedCategory
} from 'src/core/adapters/repositories/categories/MatchCategoriesEngine/ICategorySourceAdapter';
import { IMegatoneMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/megatone/IMegatoneMatchCategoriesRepository';

export class MegatoneCategorySourceAdapter implements ICategorySourceAdapter {
  constructor(private readonly megatoneRepo: IMegatoneMatchCategoriesRepository) {}

  async getCategories(): Promise<NormalizedCategory[]> {
    const rows = await this.megatoneRepo.findAllCategoriesOfMegatone(0, 9999);

    return rows.map((c: any) => ({
      id: c.external_id,
      name: c.name,
      fullPath: c.name
    }));
  }

  getSheetName(): string {
    return process.env.SHEET_MEGATONE_MAP_NAME ?? 'megatone_map_tree';
  }
}
