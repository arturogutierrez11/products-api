import { Inject, Injectable, Logger } from '@nestjs/common';
import { SQLCategoriesMegatoneRepository } from 'src/app/drivers/repositories/SQLQuerys/megatone/categories/SQLCategoriesMegatoneRepository';
import { MegatoneCategory } from 'src/core/entities/megatone/categories/MegatoneCategories';

@Injectable()
export class CategoriesMegatoneService {
  private readonly logger = new Logger(CategoriesMegatoneService.name);
  constructor(
    @Inject('ICategoriesMegatoneRepository')
    private readonly categoriesMegatoneRepository: SQLCategoriesMegatoneRepository,
  ) {}

  async listAllCategoriesOfMegatone(
    page = 1,
    limit = 20,
  ): Promise<{ categories: MegatoneCategory; total: number }> {
    const offset = (page - 1) * limit;

    const categories =
      await this.categoriesMegatoneRepository.findAllCategoriesOfMegatone(
        offset,
        limit,
      );

    const total =
      await this.categoriesMegatoneRepository.countMegatoneCategories();

    return { categories, total };
  }
}
