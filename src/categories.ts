import { NestFactory } from '@nestjs/core';
import { CategoriesModule } from './app/module/Categories.module';
import { setupSwagger } from './common/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(CategoriesModule);
  app.enableCors();

  setupSwagger(app, 'Categories API', 'Clasificación y matching de categorías', ['categories']);

  await app.listen(3300, '0.0.0.0');
}
bootstrap();
