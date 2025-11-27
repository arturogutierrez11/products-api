import { NestFactory } from '@nestjs/core';
import { CategoriesModule } from './app/module/Categories.module';

async function bootstrap() {
  const app = await NestFactory.create(CategoriesModule);
  app.enableCors();

  await app.listen(3300, '0.0.0.0'); // puerto dedicado para este servicio

  console.log('Categories classification service running on port 3300 🚀');
}
bootstrap();
