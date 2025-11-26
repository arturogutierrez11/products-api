import { Controller, Post, Query } from '@nestjs/common';
import { MatchMadreToVtex } from 'src/core/interactors/categories/MatchMadreToVtex';

@Controller('api/categories')
export class SyncCategoriesController {
  constructor(private readonly matcher: MatchMadreToVtex) {}

  @Post('sync')
  async run(
    @Query('limit') limit: number = 200,
    @Query('offset') offset: number = 0,
  ) {
    this.matcher.run(limit, offset);

    return {
      status: 'processing started',
      batchSize: limit,
      startOffset: offset,
      message: 'AI classification started — check logs or Sheet for status.',
    };
  }
}
