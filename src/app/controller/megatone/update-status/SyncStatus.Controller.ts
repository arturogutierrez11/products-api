import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncStatusService } from 'src/app/services/megatone/update-status/SyncStatusService';

@ApiTags('Megatone')
@Controller('internal/product-sync/status-sync')
export class SyncStatusController {
  constructor(private readonly service: SyncStatusService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Sincronizar estados Madre → Megatone → Sync_items',
    description: `
Proceso MANUAL que:

• Lee estados desde product_sync_items
• Compara estado Madre vs sync_items
• Activa o pausa productos en Megatone
• Actualiza sync_items SOLO si Megatone respondió OK

⛔ No toca:
- PENDING
- ERROR
- DELETED
    `
  })
  @ApiResponse({
    status: 202,
    description: 'Proceso ejecutado',
    schema: {
      type: 'object',
      properties: {
        processed: { type: 'number', example: 100 },
        updated: { type: 'number', example: 80 },
        errors: { type: 'number', example: 5 }
      }
    }
  })
  async run() {
    return this.service.execute();
  }
}
