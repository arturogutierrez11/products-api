import { Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IOncityMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/oncity/IOncityMatchCategoriesRepository';
import { OncityCategoryMatch } from 'src/core/entities/oncity/categories/OncityCategory';
import { EntityManager } from 'typeorm';

export class SQLCategoryOncityRepository implements IOncityMatchCategoriesRepository {
  private readonly logger = new Logger(SQLCategoryOncityRepository.name);

  constructor(
    @InjectEntityManager()
    private readonly productosMadreEntityManager: EntityManager
  ) {}

  async findAllCategoriesMatch(limit = 20, offset = 0): Promise<OncityCategoryMatch[]> {
    try {
      const results = await this.productosMadreEntityManager.query(
        `
      SELECT 
        id,
        sku,
        matched_category,
        matched_category_id
      FROM defaultdb.categories_match_oncity
      ORDER BY sku ASC
      LIMIT ? OFFSET ?;
      `,
        [limit, offset]
      );

      return results.map(row => ({
        id: row.id,
        sku: row.sku,
        matched_category: row.matched_category,
        id_category: row.matched_category_id
      }));
    } catch (error) {
      this.logger.error('Database query failed while fetching categories marketplace match', error.stack);
      throw new Error('Database error fetching categories match');
    }
  }

  async countCategoriesMatch() {
    const result = await this.productosMadreEntityManager.query(`
    SELECT COUNT(*) AS total
    FROM defaultdb.categories_match_oncity;
  `);

    return result[0].total;
  }
}
