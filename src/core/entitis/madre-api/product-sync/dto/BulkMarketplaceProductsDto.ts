import { ProductSyncMarketplace } from '../ProductSyncMarketplace';
import { ProductSyncStatus } from '../ProductSyncStatus';

export interface BulkMarketplaceProductsDto {
  marketplace: ProductSyncMarketplace;
  items: {
    externalId: string;
    sellerSku: string;
    marketplaceSku: string | null;
    price: number;
    stock: number;
    status: ProductSyncStatus;
    raw: Record<string, any>;
  }[];
}
