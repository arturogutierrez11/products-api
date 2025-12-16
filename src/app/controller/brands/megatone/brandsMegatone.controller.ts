import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandMegatoneService } from 'src/app/services/brands/megatone/BrandsMegatoneService';

@ApiTags('brands')
@Controller('/api/brands')
export class BrandsMegatoneController {
  constructor(private readonly brandMegatoneService: BrandMegatoneService) {}

  @Get('megatone')
  async listAllBrands(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const { brands, total } = await this.brandMegatoneService.listAllBrandsofMegatone(page, limit);

    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
      data: brands
    };
  }
}
