import { InjectEntityManager } from '@nestjs/typeorm';
import { IBrandsMegatoneRepository } from 'src/core/adapters/repositories/categories/megatone/IBrandsMegatoneRepository';
import { EntityManager } from 'typeorm';

export class SQLBrandsMegatoneRepository implements IBrandsMegatoneRepository {
  constructor(
    @InjectEntityManager()
    private readonly productosMadreEntityManager: EntityManager
  ) {}

  async findAllBrandsOfMegatone(offset: number, limit: number) {
    return await this.productosMadreEntityManager.query(
      `
      SELECT brand_id, brand_name
      FROM defaultdb.megatone_brands
      ORDER BY brand_name ASC
      LIMIT ? OFFSET ?;
      `,
      [limit, offset]
    );
  }

  async countMegatoneBrands() {
    const result = await this.productosMadreEntityManager.query(
      `SELECT COUNT(*) AS total FROM defaultdb.megatone_brands;`
    );

    return result[0].total;
  }
}
