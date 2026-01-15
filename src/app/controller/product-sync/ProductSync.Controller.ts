import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SyncMegatoneProductsInteractor } from 'src/core/interactors/product-sync/SyncMegatoneProductsInteractor';

@ApiTags('internal-product-sync')
@Controller('internal/product-sync')
export class ProductSyncController {
  constructor(private readonly syncMegatoneProducts: SyncMegatoneProductsInteractor) {}

  /* =====================================================
     EJECUCIÓN MANUAL (Swagger / Postman)
  ===================================================== */
  @Post('megatone/run')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Ejecutar sincronización de productos Megatone (manual)'
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

  /* =====================================================
     EJECUCIÓN POR CRON
     (GitHub Actions / Cloud Scheduler / k8s cronjob)
  ===================================================== */
  @Post('megatone/cron')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Ejecutar sincronización de productos Megatone (cron)'
  })
  @ApiResponse({
    status: 204,
    description: 'Sincronización disparada por cron'
  })
  runMegatoneCron(): void {
    this.syncMegatoneProducts.execute().catch(() => {});
  }
}
