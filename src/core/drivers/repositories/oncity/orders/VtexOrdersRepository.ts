import axios from 'axios';
import {
  OncityOrderResponse,
  OncityOrderDetail,
} from '../../../../entities/oncity/orders/OncityOrders';
import { buildOncityHeaders } from '../header/OncityHeaders';
import { mapVtexOrderDetail } from './mapper/mapVtexOrderDetail';
import { IOncityOrdersRepository } from 'src/core/adapters/repositories/oncity/orders/IOncityOrdersRepository';

export class OncityOrdersRepository implements IOncityOrdersRepository {
  private readonly baseUrl: string;
  private readonly appKey: string;
  private readonly appToken: string;

  constructor() {
    this.baseUrl = `https://${process.env.VTEX_ACCOUNT}.myvtex.com/api/oms/pvt/orders`;
    this.appKey = process.env.ONCITY_APP_KEY!;
    this.appToken = process.env.ONCITY_APP_TOKEN!;
  }

  async getAll(
    page: number = 1,
    perPage: number = 15,
  ): Promise<OncityOrderResponse> {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: buildOncityHeaders(this.appKey, this.appToken),
        params: { page, per_page: perPage },
      });

      const raw = response.data;

      return {
        list: raw.list.map((o: any) => ({
          orderId: o.orderId,
          creationDate: o.creationDate,
          clientName: o.clientName,
          totalValue: o.totalValue,
          statusDescription: o.statusDescription,
          totalItems: o.totalItems,
        })),
        paging: raw.paging,
      } as OncityOrderResponse;
    } catch (error: any) {
      console.error(
        'Error fetching On city orders:',
        error.response?.data || error.message,
      );
      throw new Error('On city Orders fetch failed');
    }
  }

  async getById(orderId: string): Promise<OncityOrderDetail> {
    try {
      const url = `${this.baseUrl}/${orderId}`;

      const response = await axios.get(url, {
        headers: buildOncityHeaders(this.appKey, this.appToken),
      });

      return mapVtexOrderDetail(response.data);
    } catch (error: any) {
      console.error(
        `Error fetching On city order ${orderId}:`,
        error.response?.data || error.message,
      );
      throw new Error('On city Order detail fetch failed');
    }
  }
}
