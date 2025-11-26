import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { SpreadSheetReader } from 'src/app/drivers/spreadsheets/SpreadSheetReader';
import { CategoriesService } from 'src/app/services/categories/CategoriesService';
import { IVtexCategoriesRepository } from 'src/core/adapters/repositories/vtex/categories/IVtexCategoriesRepository';

@Controller('/api/categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,

    @Inject('IVtexCategoriesRepository')
    private readonly vtexCategoriesRepository: IVtexCategoriesRepository,
  ) {}

  @Get('madre')
  async listAllCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const { categories, total } =
      await this.categoriesService.listAllCategoriesOfMadreDb(page, limit);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: categories,
    };
  }

  @Get('vtex')
  async getVtexCategoriesTree() {
    return await this.vtexCategoriesRepository.getTree();
  }
}
