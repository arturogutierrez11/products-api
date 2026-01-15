import { BulkMarketplaceProductsDto } from 'src/core/entitis/madre-api/product-sync/dto/BulkMarketplaceProductsDto';
import { MadreHttpClient } from '../http/MadreHttpClient';

export class SendBulkProductSyncRepository {
  constructor(private readonly httpClient: MadreHttpClient) {}

  async execute(payload: BulkMarketplaceProductsDto): Promise<void> {
    await this.httpClient.post<void>('/api/internal/marketplace/products/bulk', payload);
  }
}
