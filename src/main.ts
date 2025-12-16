import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from './common/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app, 'Products API', 'API principal', ['products', 'brands', 'categories']);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
