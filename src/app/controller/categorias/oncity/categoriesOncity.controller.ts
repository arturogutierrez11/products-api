import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesOncityService } from 'src/app/services/categories/oncity/CategoriesOncityService';
import { IOncityCategoriesRepository } from 'src/core/adapters/repositories/categories/oncity/IOncityCategoriesRepository';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject('IOncityCategoriesRepository')
    private readonly oncityCategoriesRepository: IOncityCategoriesRepository,
    private readonly categoriesOncityService: CategoriesOncityService
  ) {}

  @Get('oncity/tree')
  async getVtexCategoriesTree() {
    return this.oncityCategoriesRepository.getTree();
  }

  @Get('oncity/match')
  async getAllCategoriesMatch(@Query('page') page = 1, @Query('limit') limit = 20) {
    const { match, total } = await this.categoriesOncityService.listAllCategoriesOfOncityMatch(
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
