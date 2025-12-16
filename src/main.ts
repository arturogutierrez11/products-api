import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupSwagger } from './common/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (clave si vas a consumir desde frontend)
  app.enableCors();

  // Prefijo global consistente
  app.setGlobalPrefix('api');

  // Swagger unificado
  setupSwagger(app, 'Products API', 'API principal de productos, marcas, categorías y órdenes', [
    'products',
    'brands',
    'categories',
    'orders'
  ]);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  console.log(`API running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
