import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ICategoriesMadreBDRepository } from '../../../../core/adapters/repositories/categories/ICategoriesMadreBDRepository';

@Injectable()
export class SQLProductsMarketRepository {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async findActiveByMarketplace(
    marketplaceId: number,
    limit: number,
    offset: number,
  ) {
    const rows = await this.em.query(
      `
      SELECT
        pm.id,
        pm.product_id,
        pm.is_active,
        pm.status,
        pm.external_item_id,
        pm.override_price,
        pm.override_title,
        pm.override_category
      FROM products_market pm
      WHERE pm.marketplace_id = ?
        AND pm.is_active = 1
      ORDER BY pm.id
      LIMIT ? OFFSET ?
      `,
      [marketplaceId, limit, offset],
    );
    return rows as any[];
  }
}
