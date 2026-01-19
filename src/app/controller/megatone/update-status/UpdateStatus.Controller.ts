import { Controller, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateStatusService } from 'src/app/services/megatone/update-status/UpdateStatusService';

@ApiTags('Megatone')
@Controller('internal/product-sync/status')
export class UpdateStatusController {
  constructor(private readonly service: UpdateStatusService) {}

  @Post(':mode')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Activar o pausar productos en Megatone',
    description: `
Proceso manual para cambiar estado de publicaciones:

- activate → activa productos PENDING / PAUSED
- pause → pausa productos ACTIVE

⚠️ Si Megatone falla (ej: En_revision), el producto NO se actualiza en sync_items.
    `
  })
  @ApiParam({
    name: 'mode',
    required: true,
    example: 'activate',
    description: 'activate | pause'
  })
  @ApiResponse({
    status: 202,
    description: 'Proceso ejecutado'
  })
  async run(@Param('mode') mode: 'activate' | 'pause') {
    return this.service.execute(mode);
  }
}
