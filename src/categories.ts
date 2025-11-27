import { NestFactory } from '@nestjs/core';
import { CategoriesModule } from './app/module/Categories.module';

async function bootstrap() {
  const app = await NestFactory.create(CategoriesModule);

  app.enableCors();

  const PORT = process.env.PORT ?? 3001;

  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Categories service running on http://0.0.0.0:${PORT}`);
}

bootstrap();
