import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncCategoriesController } from '../controller/categorias/sync categories/syncCategories.controller';
import { SQLProductRepository } from '../drivers/repositories/SQLQuerys/SQLProductRepository';
import { SpreadSheetReader } from '../drivers/spreadsheets/SpreadSheetReader';
import { SheetsMatchCategoriesRepository } from '../drivers/repositories/categories/SheetsMatchCategoriesRepository';
import { OpenaiMatchCategoriesRepository } from '../../core/drivers/repositories/openai/OpenaiMatchCategoriesReository';
import { VtexCategoriesRepository } from '../../core/drivers/repositories/vtex/categories/VtexCategoriesRepository';
import { GoogleSheetsConfigService } from '../drivers/config/GoogleSheetsConfigService';
import { MatchMadreToVtex } from '../../core/interactors/categories/MatchMadreToVtex';
import { RetryMatchMadreToVtex } from '../../core/interactors/categories/RetryMatchMadreToVtex';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: false,
    }),
  ],

  controllers: [SyncCategoriesController],

  providers: [
    { provide: 'IGoogleSheetsConfig', useClass: GoogleSheetsConfigService },
    SpreadSheetReader,

    { provide: 'ISqlProductsRepository', useClass: SQLProductRepository },
    {
      provide: 'IMatchCategoriesRepository',
      useClass: SheetsMatchCategoriesRepository,
    },
    {
      provide: 'IVtexCategoriesRepository',
      useClass: VtexCategoriesRepository,
    },
    { provide: 'IOpenAIRepository', useClass: OpenaiMatchCategoriesRepository },

    {
      provide: MatchMadreToVtex,
      useFactory: (vtex, openai, products, sheet) =>
        new MatchMadreToVtex({
          categoriesVtexRepository: vtex,
          openAiRepository: openai,
          productsRepository: products,
          matchSheetRepository: sheet,
        }),
      inject: [
        'IVtexCategoriesRepository',
        'IOpenAIRepository',
        'ISqlProductsRepository',
        'IMatchCategoriesRepository',
      ],
    },

    {
      provide: RetryMatchMadreToVtex,
      useFactory: (sheet, openai, vtex) =>
        new RetryMatchMadreToVtex(sheet, openai, vtex),
      inject: [
        'IMatchCategoriesRepository',
        'IOpenAIRepository',
        'IVtexCategoriesRepository',
      ],
    },
  ],
})
export class CategoriesModule {}
