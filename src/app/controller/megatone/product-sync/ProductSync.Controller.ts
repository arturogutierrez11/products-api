import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SyncMegatoneProductsInteractor } from 'src/core/interactors/megatone/product-sync/SyncMegatoneProductsInteractor';

@ApiTags('Megatone')
@Controller('internal/product-sync')
export class ProductSyncController {
  constructor(private readonly syncMegatoneProducts: SyncMegatoneProductsInteractor) {}

  @Post('megatone/run')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Ejecutar sincronización de productos desde Megatone hacia sync_items'
  })
  @ApiResponse({
    status: 202,
    description: 'Sincronización iniciada'
  })
  runMegatoneManual(): { status: 'STARTED' } {
    this.syncMegatoneProducts.execute().catch(() => {});

    return {
      status: 'STARTED'
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Ejecutar sincronización de productos Megatone (cron) Proceso automatico '
  })
  @ApiResponse({
    status: 204,
    description: 'Sincronización disparada por cron'
  })
  runMegatoneCron(): void {
    this.syncMegatoneProducts.execute().catch(() => {});
  }
}
