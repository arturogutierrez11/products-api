import { Controller, Get, Query } from '@nestjs/common';
import { ProductsListingService } from '../../services/products/ProductsListingService';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsListingController {
  constructor(private readonly listingService: ProductsListingService) {}

  @Get('madre')
  async listProducts(@Query('limit') limit = 500, @Query('offset') offset = 0) {
    return await this.listingService.listProductsBatch(Number(limit), Number(offset));
  }
}
