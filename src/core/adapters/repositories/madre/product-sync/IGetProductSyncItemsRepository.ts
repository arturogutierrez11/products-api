import {
  PaginatedSyncItemsResponse,
  ProductSyncItemDto
} from 'src/core/drivers/repositories/madre-api/product-sync/GetProductSyncItemsRepository';

export interface IGetProductSyncItemsRepository {
  listAll(marketplace: string, limit: number, offset: number): Promise<PaginatedSyncItemsResponse>;
  getBySellerSku(sellerSku: string): Promise<ProductSyncItemDto>;
}
