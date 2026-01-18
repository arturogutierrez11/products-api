import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatePriceAndStockService } from 'src/app/services/update-price-stock/UpdatePriceAndStockService';

@ApiTags('Product Sync · Madre vs Marketplace')
@Controller('internal/product-sync')
export class SyncMadreVsMarketplaceController {
  constructor(private readonly service: UpdatePriceAndStockService) {}

  @Post('update')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Sincronización FULL Madre → Marketplace',
    description:
      'Compara productos existentes en product_sync_items contra Madre. ' +
      'Si detecta diferencias de precio o stock, actualiza Megatone y ' +
      'registra el cambio en Madre (sync_item + history).'
  })
  @ApiResponse({
    status: 202,
    description: 'Proceso de sincronización iniciado'
  })
  async run() {
    return this.service.execute();
  }
}
