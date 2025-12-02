import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ISqlProductsRepository } from 'src/core/adapters/repositories/products/ISqlProductsRepository';

@Injectable()
export class SQLProductRepository implements ISqlProductsRepository {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async findManyByIds(ids: number[]) {
    if (!ids.length) return [];

    const rows = await this.em.query(
      `
      SELECT
        id,
        sku,
        titulo,
        descripcion,
        categoria,
        precio,
        stock
      FROM productos_madre_copy
      WHERE id IN (?)
      `,
      [ids],
    );

    return rows as any[];
  }

  async findAllProducts(limit: number, offset: number) {
    return await this.em.query(
      `
    SELECT
      id,
      sku,
      titulo,
      descripcion
    FROM productos_madre
    ORDER BY id ASC
    LIMIT ? OFFSET ?
    `,
      [limit, offset],
    );
  }
  async countAllProducts() {
    const result = await this.em.query(`
    SELECT COUNT(*) as total
    FROM productos_madre
  `);

    return Number(result[0].total);
  }

  async findPaginated(limit: number, offset: number) {
    limit = Number(limit);
    offset = Number(offset);

    const products = await this.findAllProducts(limit, offset);
    const total = await this.countAllProducts();

    return {
      items: products.map((p: any) => ({
        id: p.id,
        sku: p.sku,
        title: p.titulo,
        description: p.descripcion,
      })),
      total,
      nextOffset: offset + limit,
      hasNext: offset + limit < total,
    };
  }
}
