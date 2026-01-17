import { Injectable } from '@nestjs/common';
import { MadreHttpClient } from '../../http/MadreHttpClient';
import { MadreProductsPaginatedResponse } from 'src/core/entitis/madre-api/products/get/MadreProductsPaginatedResponse';
import { MadreProductDto } from 'src/core/entitis/madre-api/products/get/dto/MadreProductDto';
import { IGetMadreProductsRepository } from 'src/core/adapters/repositories/madre/products/get/IGetMadreProductsRepository';

@Injectable()
export class GetMadreProductsRepository implements IGetMadreProductsRepository {
  constructor(private readonly httpClient: MadreHttpClient) {}

  async listAll(limit = 50, offset = 0): Promise<MadreProductsPaginatedResponse> {
    return this.httpClient.get<MadreProductsPaginatedResponse>('/products/madre', {
      limit,
      offset
    });
  }

  async getBySku(sku: string): Promise<MadreProductDto | null> {
    if (!sku) {
      throw new Error('sku is required');
    }

    const response = await this.httpClient.get<MadreProductsPaginatedResponse>('/products/madre', {
      sku,
      limit: 1,
      offset: 0
    });

    return response.items?.[0] ?? null;
  }
}
