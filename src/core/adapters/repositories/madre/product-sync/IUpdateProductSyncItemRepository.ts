import { UpdateProductSyncItemPayload } from 'src/core/drivers/repositories/madre-api/product-sync/UpdateProductSyncItemRepository';

export interface IUpdateProductSyncItemRepository {
  updateBySellerSku(
    sellerSku: string,
    payload: UpdateProductSyncItemPayload
  ): Promise<{ status: string; sellerSku: string }>;
}
