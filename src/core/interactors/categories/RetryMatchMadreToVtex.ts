import { IMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';
import { IOpenAIRepository } from 'src/core/adapters/repositories/openai/IOpenAIRepository';
import { IVtexCategoriesRepository } from 'src/core/adapters/repositories/vtex/categories/IVtexCategoriesRepository';

export class RetryMatchMadreToVtex {
  constructor(
    private readonly sheetRepo: IMatchCategoriesRepository,
    private readonly openAI: IOpenAIRepository,
    private readonly categoriesRepo: IVtexCategoriesRepository,
  ) {}

  async run(limit = 5) {
    console.log(`\n🔁 Retry started (Batch size: ${limit})`);

    const categories = this.flatten(await this.categoriesRepo.getTree());
    const sheetRows = await this.sheetRepo.readAll();

    // 👉 tomamos TODOS los que cumplen condición
    const pending = sheetRows.filter(
      (r) => !r.matchedCategoryId || r.confidence < 0.7,
    );

    if (!pending.length) {
      console.log(`✔️ Nothing pending`);
      return;
    }

    console.log(`📌 Total pending: ${pending.length}`);

    let processedCount = 0;

    // 👉 procesar en bloques
    for (let i = 0; i < pending.length; i += limit) {
      const batch = pending.slice(i, i + limit);
      console.log(`⚙️ Batch ${i / limit + 1} (${batch.length} items)`);

      let ai: Awaited<ReturnType<IOpenAIRepository['classifyBatch']>> | null =
        null;
      let attempts = 0;

      // 🔁 retry inteligente para OpenAI (máximo 3 intentos)
      while (attempts < 3) {
        try {
          ai = await this.openAI.classifyBatch({
            products: batch.map((r) => ({
              id: r.productId,
              sku: r.sku,
              title: r.title,
              description: r.description ?? '',
            })),
            vtexCategories: categories,
          });

          if (ai?.results?.length) break;
        } catch (err) {
          console.log(`⚠️ OpenAI failed (attempt ${attempts + 1}/3)`);
        }

        attempts++;
        await new Promise((res) => setTimeout(res, 2000 + attempts * 1000));
      }

      if (!ai?.results?.length) {
        console.log(`⏭️ Skipping batch (failed after 3 attempts)`);
        continue;
      }

      const updates = ai.results.map((r) => {
        const matched = categories.find(
          (c) => String(c.id) === String(r.matchedCategoryId),
        );

        return {
          productId: r.productId,
          matchedCategory: r.matchedCategoryName ?? '',
          matchedCategoryId: matched?.id ?? null,
          matchedCategoryPath: matched?.fullPath ?? null,
          confidence: r.confidence ?? 0,
          status: r.confidence >= 0.7 && matched ? 'AUTO_MATCHED' : 'RETRY',
          processedAt: new Date().toISOString(),
        };
      });

      await this.sheetRepo.applyResults(updates);
      processedCount += updates.length;

      // 🧘 anti-SPAM para OpenAI
      await new Promise((res) => setTimeout(res, 800));
    }

    console.log(`\n✅ Finished. Updated: ${processedCount} rows.`);
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
