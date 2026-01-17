import { Injectable } from '@nestjs/common';
import { SyncMadreVsMarketplaceInteractor } from 'src/core/interactors/product-sync/SyncMadreVsMarketplaceInteractor';

@Injectable()
export class SyncMadreVsMarketplaceService {
  constructor(private readonly interactor: SyncMadreVsMarketplaceInteractor) {}

  execute() {
    return this.interactor.execute();
  }
}
