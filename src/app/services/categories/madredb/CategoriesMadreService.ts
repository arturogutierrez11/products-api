import { Inject, Injectable, Logger } from '@nestjs/common';
import { SQLCategoriesMadreRepository } from 'src/app/drivers/repositories/SQLQuerys/madredb/categories/SQLCategoriesRepository';
import { Categories } from 'src/core/entities/madredb/categories/Categories';

@Injectable()
export class CategoriesMadreService {
  private readonly logger = new Logger(CategoriesMadreService.name);
  constructor(
    @Inject('ICategoriesMadreRepository')
    private readonly categoriesMadreRepository: SQLCategoriesMadreRepository,
  ) {}

  async listAllCategoriesOfMadreDb(
    page = 1,
    limit = 20,
  ): Promise<{ categories: Categories; total: number }> {
    const offset = (page - 1) * limit;

    const categories =
      await this.categoriesMadreRepository.findAlCategoriesInProductsMadre(
        offset,
        limit,
      );

    const total = await this.categoriesMadreRepository.countMadreCategories();

    return { categories, total };
  }
}
