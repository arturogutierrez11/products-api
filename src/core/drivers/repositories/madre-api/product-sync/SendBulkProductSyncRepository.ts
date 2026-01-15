import { BulkMarketplaceProductsDto } from 'src/core/entitis/madre-api/product-sync/dto/BulkMarketplaceProductsDto';
import { MadreHttpClient } from '../http/MadreHttpClient';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendBulkProductSyncRepository {
  constructor(private readonly httpClient: MadreHttpClient) {}

  async execute(payload: BulkMarketplaceProductsDto): Promise<void> {
    await this.httpClient.post<void>('/internal/marketplace/products/bulk', payload);
  }
}
