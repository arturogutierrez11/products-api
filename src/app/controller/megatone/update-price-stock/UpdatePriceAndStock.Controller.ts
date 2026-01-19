import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdatePriceAndStockService } from 'src/app/services/megatone/update-price-stock/UpdatePriceAndStockService';

@ApiTags('Megatone')
@Controller('internal/product-sync')
export class UpdatePriceAndStockController {
  constructor(private readonly service: UpdatePriceAndStockService) {}

  @Post('update')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary:
      'Sincronización de productos Madre vs Sync_items. Compara, encuentra diferencia y modifica precio y stock entre Megatone - Sync_items - Madre',
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
