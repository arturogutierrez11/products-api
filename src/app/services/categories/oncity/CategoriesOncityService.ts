import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOncityMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/oncity/IOncityMatchCategoriesRepository';
import { OncityCategoryMatch } from 'src/core/entities/oncity/categories/OncityCategory';

@Injectable()
export class CategoriesOncityService {
  private readonly logger = new Logger(CategoriesOncityService.name);

  constructor(
    @Inject('IOncityMatchCategoriesRepository')
    private readonly oncityMatchRepository: IOncityMatchCategoriesRepository
  ) {}

  async listAllCategoriesOfOncityMatch(page = 1, limit = 20): Promise<{ match: OncityCategoryMatch[]; total: number }> {
    const offset = (page - 1) * limit;

    const match = await this.oncityMatchRepository.findAllCategoriesMatch(limit, offset);

    const total = await this.oncityMatchRepository.countCategoriesMatch();

    return { match, total };
  }
}
