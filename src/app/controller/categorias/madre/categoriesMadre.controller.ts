import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesMadreService } from 'src/app/services/categories/madredb/CategoriesMadreService';
@ApiTags('categories')
@Controller('categories')
export class CategoriesMadreController {
  constructor(private readonly categoriesMadreService: CategoriesMadreService) {}

  @Get('madre')
  async listAllCategories(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const { categories, total } = await this.categoriesMadreService.listAllCategoriesOfMadreDb(page, limit);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: categories
    };
  }
}
