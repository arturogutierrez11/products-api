import { Controller, Get, Inject } from '@nestjs/common';
import { IOncityCategoriesRepository } from 'src/core/adapters/repositories/oncity/categories/IOncityCategoriesRepository';

@Controller('/api/categories')
export class CategoriesController {
  constructor(
    @Inject('IOncityCategoriesRepository')
    private readonly oncityCategoriesRepository: IOncityCategoriesRepository,
  ) {}

  @Get('oncity')
  async getVtexCategoriesTree() {
    return await this.oncityCategoriesRepository.getTree();
  }
}
