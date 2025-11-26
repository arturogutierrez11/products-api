import { Injectable, Logger } from '@nestjs/common';
import { SQLCategoriesRepository } from 'src/app/drivers/repositories/SQLQuerys/SQLCategoriesRepository';
import { Categories } from 'src/core/entities/Categories';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    private readonly sqlCategoriesRepository: SQLCategoriesRepository,
  ) {}

  async listAllCategoriesOfMadreDb(
    page = 1,
    limit = 20,
  ): Promise<{ categories: Categories; total: number }> {
    const offset = (page - 1) * limit;

    const categories =
      await this.sqlCategoriesRepository.findAlCategoriesInProductsMadre(
        offset,
        limit,
      );

    const total = await this.sqlCategoriesRepository.countCategories();

    return { categories, total };
  }
}
