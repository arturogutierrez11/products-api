import { Injectable } from '@nestjs/common';
import { MadreHttpClient } from '../http/MadreHttpClient';
import { IGetProductSyncItemsRepository } from 'src/core/adapters/repositories/madre/product-sync/IGetProductSyncItemsRepository';

export interface ProductSyncItemDto {
  id: string;
  seller_sku: string;
  external_id: string;
  price: number;
  stock: number;
  status: string;
  last_seen_at: string;
}

export interface PaginatedSyncItemsResponse {
  items: ProductSyncItemDto[];
  limit: number;
  offset: number;
  count: number;
  total: number;
  hasNext: boolean;
  nextOffset: number | null;
}

@Injectable()
export class GetProductSyncItemsRepository implements IGetProductSyncItemsRepository {
  constructor(private readonly httpClient: MadreHttpClient) {}

  async listAll(limit = 100, offset = 0): Promise<PaginatedSyncItemsResponse> {
    return this.httpClient.get<PaginatedSyncItemsResponse>('/internal/marketplace/products/items/all', {
      limit,
      offset
    });
  }

  async getBySellerSku(sellerSku: string): Promise<any> {
    if (!sellerSku) {
      throw new Error('sellerSku is required');
    }

    return this.httpClient.get<any>(`/internal/marketplace/products/${sellerSku}`);
  }
}
