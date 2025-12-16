import { Inject } from '@nestjs/common';
import { IBrandsMegatoneRepository } from 'src/core/adapters/repositories/categories/megatone/IBrandsMegatoneRepository';
import { MegatoneBrands } from 'src/core/entities/megatone/brands/MegatoneBrands';

export class BrandMegatoneService {
  constructor(
    @Inject('IBrandsMegatoneRepository')
    private readonly brandsMegatoneRepository: IBrandsMegatoneRepository
  ) {}

  async listAllBrandsofMegatone(page = 1, limit = 20): Promise<{ brands: MegatoneBrands[]; total: number }> {
    const offset = (page - 1) * limit;

    const brands = await this.brandsMegatoneRepository.findAllBrandsOfMegatone(offset, limit);
    const total = await this.brandsMegatoneRepository.countMegatoneBrands();

    return { brands, total };
  }
}
