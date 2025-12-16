import { InjectEntityManager } from '@nestjs/typeorm';
import { IBrandsMadreRepository } from 'src/core/adapters/repositories/categories/madredb/IBrandsMadreRepository';
import { EntityManager } from 'typeorm';

export class SQLBrandsRepository implements IBrandsMadreRepository {
  constructor(
    @InjectEntityManager()
    private readonly productosMadreEntityManager: EntityManager
  ) {}

  async findAllBrandsFromMadreDB(offset: number, limit: number) {
    const result = await this.productosMadreEntityManager.query(
      `
      SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(atributos, '$.marca')) AS marca
      FROM defaultdb.productos_madre
      WHERE JSON_EXTRACT(atributos, '$.marca') IS NOT NULL
        AND JSON_UNQUOTE(JSON_EXTRACT(atributos, '$.marca')) <> ''
      ORDER BY marca ASC
      LIMIT ? OFFSET ?;
    `,
      [limit, offset]
    );

    return result.map(r => r.marca);
  }

  async countBrandsFromMadreDB() {
    const result = await this.productosMadreEntityManager.query(`
      SELECT COUNT(*) AS total
      FROM (
        SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(atributos, '$.marca')) AS marca
        FROM defaultdb.productos_madre
        WHERE JSON_EXTRACT(atributos, '$.marca') IS NOT NULL
          AND JSON_UNQUOTE(JSON_EXTRACT(atributos, '$.marca')) <> ''
      ) AS subquery;
    `);

    return result[0].total;
  }
}
