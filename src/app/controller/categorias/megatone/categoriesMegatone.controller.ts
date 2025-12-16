import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesMegatoneService } from 'src/app/services/categories/megatone/CategoriesMegatoneService';

@ApiTags('categories')
@Controller('/api/categories')
export class CategoriesMegatoneController {
  constructor(private readonly categoriesMeatoneService: CategoriesMegatoneService) {}

  @Get('megatone/tree')
  async listAllCategories(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const { categories, total } = await this.categoriesMeatoneService.listAllCategoriesOfMegatone(page, limit);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: categories
    };
  }

  @Get('megatone/match')
  async getAllCategoriesMatch(@Query('page') page = 1, @Query('limit') limit = 20) {
    const { match, total } = await this.categoriesMeatoneService.listAllCategoriesOfMegatoneMatch(
      Number(page),
      Number(limit)
    );

    return {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      data: match
    };
  }
}
