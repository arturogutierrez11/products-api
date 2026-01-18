import { Injectable } from '@nestjs/common';
import { MadreHttpClient } from '../http/MadreHttpClient';
import { IUpdateProductSyncItemRepository } from 'src/core/adapters/repositories/madre/product-sync/IUpdateProductSyncItemRepository';

export interface UpdateProductSyncItemPayload {
  price?: number;
  stock?: number;
  status?: 'ACTIVE' | 'PAUSED' | 'PENDING' | 'DELETED' | 'ERROR';
  raw?: Record<string, any>;
}

@Injectable()
export class UpdateProductSyncItemRepository implements IUpdateProductSyncItemRepository {
  constructor(private readonly httpClient: MadreHttpClient) {}

  async updateBySellerSku(
    sellerSku: string,
    payload: UpdateProductSyncItemPayload
  ): Promise<{ status: string; sellerSku: string }> {
    return this.httpClient.put<{ status: string; sellerSku: string }>(
      `/internal/marketplace/products/${sellerSku}`,
      payload
    );
  }
}
