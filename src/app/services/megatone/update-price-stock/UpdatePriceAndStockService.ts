import { Injectable } from '@nestjs/common';
import { UpdatePriceAndStock } from 'src/core/interactors/megatone/update-price-stock/UpdatePriceAndStock';

@Injectable()
export class UpdatePriceAndStockService {
  constructor(private readonly interactor: UpdatePriceAndStock) {}

  execute() {
    return this.interactor.execute();
  }
}
