import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandMadreService } from 'src/app/services/brands/madredb/BrandsMadreService';

@ApiTags('brands')
@Controller('/api/brands')
export class BrandsMadreController {
  constructor(private readonly brandsMadreService: BrandMadreService) {}

  @Get('madre')
  async listAllBrands(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const { brands, total } = await this.brandsMadreService.listAllBrandsofMadre(page, limit);

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      data: brands
    };
  }
}
