import { Injectable } from '@nestjs/common';
import { SyncStatus } from 'src/core/interactors/megatone/update-status/SyncStatus';

@Injectable()
export class SyncStatusService {
  constructor(private readonly interactor: SyncStatus) {}

  async execute() {
    return this.interactor.execute();
  }
}
