import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class SQLMarketplaceRepository {
  constructor(
    @InjectEntityManager()
    private readonly em: EntityManager,
  ) {}

  async findByCode(code: string) {
    const rows = await this.em.query(
      `
      SELECT id, name, code, type, account_name, api_base_url,
             app_key, app_token, is_active
      FROM marketplace
      WHERE code = ?
      LIMIT 1
      `,
      [code],
    );
    return rows[0] || null;
  }
}
