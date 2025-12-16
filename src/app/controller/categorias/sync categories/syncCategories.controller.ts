import { Controller, Post, Query, BadRequestException, Inject } from '@nestjs/common';
import {
  CategoryMappingFactory,
  MappingSource
} from 'src/core/interactors/categories/MatchCategories/CategoryMappingFactory';

import { IOncityCategoriesRepository } from 'src/core/adapters/repositories/categories/oncity/IOncityCategoriesRepository';
import { IMegatoneMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/megatone/IMegatoneMatchCategoriesRepository';
import { IOpenAIRepository } from 'src/core/adapters/repositories/openai/IOpenAIRepository';
import { ISqlProductsRepository } from 'src/core/adapters/repositories/products/ISqlProductsRepository';
import { IMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class SyncCategoriesController {
  constructor(
    @Inject('IOncityCategoriesRepository')
    private readonly oncityRepo: IOncityCategoriesRepository,

    @Inject('IMegatoneMatchCategoriesRepository')
    private readonly megatoneRepo: IMegatoneMatchCategoriesRepository,

    @Inject('IOpenAIRepository')
    private readonly openAiRepo: IOpenAIRepository,

    @Inject('ISqlProductsRepository')
    private readonly productsRepo: ISqlProductsRepository,

    @Inject('IMatchCategoriesRepository')
    private readonly sheetRepo: IMatchCategoriesRepository
  ) {}

  @Post('sync')
  async run(
    @Query('source') source: string = 'oncity',
    @Query('limit') limit: number = 50,
    @Query('offset') offset?: number
  ) {
    const normalized = source.toUpperCase();

    if (!Object.values(MappingSource).includes(normalized as MappingSource)) {
      throw new BadRequestException(`Invalid source. Allowed: ${Object.values(MappingSource).join(', ')}`);
    }

    const mapper = CategoryMappingFactory.create(normalized as MappingSource, {
      oncityRepo: this.oncityRepo,
      megatoneRepo: this.megatoneRepo,
      openAiRepo: this.openAiRepo,
      productsRepo: this.productsRepo,
      sheetRepo: this.sheetRepo
    });

    mapper.run(limit, offset);

    return {
      status: 'processing',
      type: 'initial_match',
      source,
      batchSize: limit,
      offset,
      message: `Categorization started for ${source} — check logs or Sheets.`
    };
  }

  @Post('sync/retry')
  async retry(@Query('source') source: string = 'megatone', @Query('limit') limit: number = 50) {
    const normalized = source.toUpperCase();

    if (!Object.values(MappingSource).includes(normalized as MappingSource)) {
      throw new BadRequestException(`Invalid source. Allowed: ${Object.values(MappingSource).join(', ')}`);
    }

    const mapper = CategoryMappingFactory.createRetry(normalized as MappingSource, {
      oncityRepo: this.oncityRepo,
      megatoneRepo: this.megatoneRepo,
      openAiRepo: this.openAiRepo,
      productsRepo: this.productsRepo,
      sheetRepo: this.sheetRepo
    });

    mapper.run(limit);

    return {
      status: 'processing',
      type: 'retry_match',
      source,
      batchSize: limit,
      message: `Retry started for ${source} — check logs or Sheets.`
    };
  }
}
