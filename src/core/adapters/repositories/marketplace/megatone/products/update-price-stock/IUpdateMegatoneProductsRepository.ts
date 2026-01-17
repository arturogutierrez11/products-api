import { UpdateMegatoneProductsPayload } from '../../../../../../entitis/marketplace-api/megatone/products/update-price-stock/UpdateMegatoneProductsPayload';
import { UpdateMegatoneProductsResponse } from '../../../../../../entitis/marketplace-api/megatone/products/update-price-stock/UpdateMegatoneProductsResponse';

export interface IUpdateMegatoneProductsRepository {
  update(payload: UpdateMegatoneProductsPayload): Promise<UpdateMegatoneProductsResponse>;
}
