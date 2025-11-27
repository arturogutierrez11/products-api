import { NestFactory } from '@nestjs/core';
import { CategoriesModule } from './app/module/Categories.module';

async function bootstrap() {
  const app = await NestFactory.create(CategoriesModule);
  await app.init();

  console.log('Categories classification service running...');
}

bootstrap();
