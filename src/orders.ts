import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './app/module/Orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.enableCors();

  const port = process.env.ORDERS_PORT || 3400;

  await app.listen(port, '0.0.0.0');

  console.log(`Orders service running on port ${port}`);
}

bootstrap();
