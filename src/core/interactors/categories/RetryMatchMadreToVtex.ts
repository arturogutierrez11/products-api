import { IMatchCategoriesrespoitory } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';
import { IOpenAIRepository } from 'src/core/adapters/repositories/openai/IOpenAIRepository';
import { IVtexCategoriesRepository } from 'src/core/adapters/repositories/vtex/categories/IVtexCategoriesRepository';

export class RetryMatchMadreToVtex {
  constructor(
    private readonly sheetRepo: IMatchCategoriesrespoitory,
    private readonly openAI: IOpenAIRepository,
    private readonly categoriesRepo: IVtexCategoriesRepository,
  ) {}

  async run(limit = 100) {
    console.log(`\n🔁 Retry process started`);

    const categories = this.flatten(await this.categoriesRepo.getTree());
    const sheetRows = await this.sheetRepo.readAll();

    const retryRows = sheetRows
      .filter((r) => !r.matchedCategoryId || r.confidence < 0.7)
      .slice(0, limit);

    if (!retryRows.length) {
      console.log(`✔️ No pending rows`);
      return;
    }

    console.log(`➡️ Retrying ${retryRows.length} rows`);

    const aiResults = await this.openAI.classifyBatch({
      products: retryRows.map((r) => ({
        id: r.productId,
        sku: r.sku,
        title: r.title,
        description: r.description ?? '',
      })),
      vtexCategories: categories,
    });

    if (!aiResults || !aiResults.results?.length) {
      console.log(`⚠️ AI returned no results`);
      return;
    }

    const updates = aiResults.results.map((r) => {
      const matched = categories.find(
        (c) => String(c.id) === String(r.matchedCategoryId),
      );

      return {
        productId: r.productId,
        data: {
          matchedCategory: r.matchedCategoryName ?? '',
          matchedCategoryId: matched?.id ?? null,
          matchedCategoryPath: matched?.fullPath ?? null,
          confidence: r.confidence ?? 0,
          status: r.confidence >= 0.7 && matched ? 'AUTO_MATCHED' : 'RETRY',
          processedAt: new Date().toISOString(),
        },
      };
    });

    await this.sheetRepo.updateRows(updates);

    console.log(`✔️ Updated ${updates.length} rows\n`);
  }

  private flatten(tree: any[], parent = '') {
    return tree.flatMap((node) => {
      const full = parent ? `${parent} > ${node.name}` : node.name;
      return [
        { id: node.id, name: node.name, fullPath: full },
        ...(node.children ? this.flatten(node.children, full) : []),
      ];
    });
  }
}
