import { Injectable, BadRequestException } from '@nestjs/common';
import { UpdateStatus } from 'src/core/interactors/megatone/update-status/UpdateStatus';

type UpdateMode = 'activate' | 'pause';

@Injectable()
export class UpdateStatusService {
  constructor(private readonly interactor: UpdateStatus) {}

  async execute(mode: UpdateMode) {
    if (!['activate', 'pause'].includes(mode)) {
      throw new BadRequestException(`Modo inválido: ${mode}. Usar "activate" o "pause".`);
    }

    const mappedMode = mode === 'activate' ? 'ACTIVATE' : 'PAUSE';

    return this.interactor.execute(mappedMode);
  }
}
