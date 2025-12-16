import { Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IMegatoneMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/megatone/IMegatoneMatchCategoriesRepository';
import { MegatoneCategoryMatch } from 'src/core/entities/megatone/categories/MegatoneCategories';
import { EntityManager } from 'typeorm';

export class SQLCategoriesMegatoneRepository implements IMegatoneMatchCategoriesRepository {
  private readonly logger = new Logger(SQLCategoriesMegatoneRepository.name);

  constructor(
    @InjectEntityManager()
    private readonly productosMadreEntityManager: EntityManager
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
        [limit, offset]
      );

      return results;
    } catch (error) {
      this.logger.error(`Database query failed while fetching Megatone categories`, error.stack);
      throw new Error('Database error fetching Megatone categories');
    }
  }

  async countMegatoneCategories() {
    const result = await this.productosMadreEntityManager.query(
      `SELECT COUNT(*) AS total FROM defaultdb.categories_megatone;`
    );

    return result[0].total;
  }

  async findAllBrandsOfMegatone() {
    const result = await this.productosMadreEntityManager.query(`
    SELECT brand_id, brand_name
    FROM megatone_brands
    ORDER BY brand_name ASC
  `);

    return result;
  }

  async findAllCategoriesMatch(limit = 20, offset = 0): Promise<MegatoneCategoryMatch[]> {
    try {
      const results = await this.productosMadreEntityManager.query(
        `
      SELECT 
        id,
        sku,
        matched_category,
        matched_category_id,
        matched_category_path,
        created_at,
        updated_at
      FROM defaultdb.categories_match_megatone
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
    FROM defaultdb.categories_match_megatone;
  `);

    return result[0].total;
  }
}
