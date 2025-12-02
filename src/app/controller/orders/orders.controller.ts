import { Controller, Get, Inject, Query, Param } from '@nestjs/common';
import { IOncityOrdersRepository } from 'src/core/adapters/repositories/oncity/orders/IOncityOrdersRepository';
import {
  OncityOrderResponse,
  OncityOrderDetail,
} from 'src/core/entities/oncity/orders/OncityOrders';

@Controller('/api/orders')
export class OrdersController {
  constructor(
    @Inject('IOncityOrdersRepository')
    private readonly oncityOrdersRepository: IOncityOrdersRepository,
  ) {}

  @Get('oncity')
  async getAllOrders(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 15,
  ): Promise<OncityOrderResponse> {
    return await this.oncityOrdersRepository.getAll(page, perPage);
  }

  @Get('oncity/:orderId')
  async getOrderById(
    @Param('orderId') orderId: string,
  ): Promise<OncityOrderDetail> {
    return await this.oncityOrdersRepository.getById(orderId);
  }
}
