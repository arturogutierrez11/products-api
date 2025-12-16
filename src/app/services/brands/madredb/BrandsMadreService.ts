import { Inject } from '@nestjs/common';
import { IBrandsMadreRepository } from 'src/core/adapters/repositories/categories/madredb/IBrandsMadreRepository';
import { MadreBrand } from 'src/core/entities/madredb/brands/MadreBrand';

export class BrandMadreService {
  constructor(
    @Inject('IBrandsMadreRepository')
    private readonly brandsMadreRepository: IBrandsMadreRepository
  ) {}

  async listAllBrandsofMadre(page = 1, limit = 20): Promise<{ brands: MadreBrand[]; total: number }> {
    const offset = (page - 1) * limit;

    const names = await this.brandsMadreRepository.findAllBrandsFromMadreDB(offset, limit);
    const total = await this.brandsMadreRepository.countBrandsFromMadreDB();

    const brands: MadreBrand[] = names.map((name, index) => ({
      id: offset + index + 1,
      name
    }));

    return { brands, total };
  }
}
