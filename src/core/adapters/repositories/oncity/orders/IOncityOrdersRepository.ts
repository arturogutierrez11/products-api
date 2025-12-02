import {
  OncityOrderResponse,
  OncityOrderDetail,
} from 'src/core/entities/oncity/orders/OncityOrders';

export interface IOncityOrdersRepository {
  getAll(page: number, perPage: number): Promise<OncityOrderResponse>;
  getById(orderId: string): Promise<OncityOrderDetail>;
}
