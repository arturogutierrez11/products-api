import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesMegatoneService } from 'src/app/services/categories/megatone/CategoriesMegatoneService';

@Controller('/api/categories')
export class CategoriesMegatoneController {
  constructor(
    private readonly categoriesMeatoneService: CategoriesMegatoneService,
  ) {}

  @Get('megatone')
  async listAllCategories(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const { categories, total } =
      await this.categoriesMeatoneService.listAllCategoriesOfMegatone(
        page,
        limit,
      );

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: categories,
    };
  }
}
