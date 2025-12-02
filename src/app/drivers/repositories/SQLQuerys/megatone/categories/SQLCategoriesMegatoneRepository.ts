import { Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ICategoriesMegatoneRepository } from 'src/core/adapters/repositories/categories/megatone/ICategoriesMegatoneRepository';
import { EntityManager } from 'typeorm';

export class SQLCategoriesMegatoneRepository
  implements ICategoriesMegatoneRepository
{
  private readonly logger = new Logger(SQLCategoriesMegatoneRepository.name);

  constructor(
    @InjectEntityManager()
    private readonly productosMadreEntityManager: EntityManager,
  ) {}

  async findAllCategoriesOfMegatone(offset: number, limit: number) {
    try {
      const results = await this.productosMadreEntityManager.query(
        `
      SELECT external_id, name
      FROM defaultdb.categories_megatone
      ORDER BY external_id ASC
      LIMIT ? OFFSET ?;
      `,
        [limit, offset],
      );

      return results;
    } catch (error) {
      this.logger.error(
        `Database query failed while fetching Megatone categories`,
        error.stack,
      );
      throw new Error('Database error fetching Megatone categories');
    }
  }

  async countMegatoneCategories() {
    const result = await this.productosMadreEntityManager.query(
      `SELECT COUNT(*) AS total FROM defaultdb.categories_megatone;`,
    );

    return result[0].total;
  }
}
