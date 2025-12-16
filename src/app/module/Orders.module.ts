import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrdersController } from '../controller/orders/orders.controller';
import { OncityOrdersRepository } from 'src/core/drivers/repositories/oncity/orders/OncityOrdersRepository';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],

  controllers: [OrdersController],

  providers: [
    {
      provide: 'IOncityOrdersRepository',
      useClass: OncityOrdersRepository
    }
  ],

  exports: ['IOncityOrdersRepository']
})
export class OrdersModule {}
