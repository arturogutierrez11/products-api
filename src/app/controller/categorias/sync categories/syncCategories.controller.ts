import { Controller, Post, Query } from '@nestjs/common';
import { MatchMadreToVtex } from 'src/core/interactors/categories/MatchMadreToVtex';
import { RetryMatchMadreToVtex } from 'src/core/interactors/categories/RetryMatchMadreToVtex';

@Controller('api/categories')
export class SyncCategoriesController {
  constructor(
    private readonly matcher: MatchMadreToVtex,
    private readonly retryMatcher: RetryMatchMadreToVtex,
  ) {}

  @Post('sync')
  async run(
    @Query('limit') limit: number = 200,
    @Query('offset') offset: number = 0,
  ) {
    this.matcher.run(limit, offset);

    return {
      status: 'processing',
      type: 'initial_match',
      batchSize: limit,
      offset,
      message: 'Categorization started — check logs or Sheets.',
    };
  }

  @Post('sync/retry')
  async retry(@Query('limit') limit: number = 100) {
    await this.retryMatcher.run(limit);

    return {
      status: 'processing',
      type: 'retry_match',
      retryBatchSize: limit,
      message: 'Retry process started — check logs or Sheets.',
    };
  }
}
