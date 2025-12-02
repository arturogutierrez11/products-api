import { ISqlProductsRepository } from 'src/core/adapters/repositories/products/ISqlProductsRepository';
import {
  IOpenAIRepository,
  ClassifyResponse,
} from 'src/core/adapters/repositories/openai/IOpenAIRepository';
import { IMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';
import {
  ICategorySourceAdapter,
  NormalizedCategory,
} from 'src/core/adapters/repositories/categories/MatchCategoriesEngine/ICategorySourceAdapter';

type MatchRow = {
  productId: number;
  sku: string;
  title: string;
  matchedCategory: string;
  matchedCategoryId: string | number | null;
  matchedCategoryPath: string | null;
  confidence: number;
  status: 'AUTO_MATCHED' | 'REVIEW' | 'RETRY';
  processedAt: string;
};

export class MatchCategoriesEngine {
  constructor(
    private readonly categorySource: ICategorySourceAdapter,
    private readonly openAiRepository: IOpenAIRepository,
    private readonly productsRepository: ISqlProductsRepository,
    private readonly matchSheetRepository: IMatchCategoriesRepository,
  ) {}

  async run(batchSize = 200, manualOffset?: number) {
    console.log(
      `\n🚀 Starting category mapping with: ${this.categorySource.constructor.name}`,
    );

    // Resume mode reading sheet
    const savedRows = await this.matchSheetRepository.readAll(
      this.categorySource.getSheetName(),
    );
    const offset = manualOffset ?? savedRows.length;

    // Load marketplace categories
    console.log(`📂 Loading marketplace categories...`);
    const categories = await this.categorySource.getCategories();

    // Build lookup caches
    const cacheById = new Map(categories.map((c) => [String(c.id), c]));
    const cacheByName = new Map(
      categories.map((c) => [c.name.toLowerCase(), c]),
    );
    const cacheByFull = new Map(
      categories.map((c) => [c.fullPath.toLowerCase(), c]),
    );

    let buffer: MatchRow[] = [];
    let currentOffset = offset;

    while (true) {
      console.log(`📦 Fetching products offset=${currentOffset}`);

      const { items, hasNext, nextOffset, total } =
        await this.productsRepository.findPaginated(batchSize, currentOffset);

      if (!items.length) {
        console.log(`🏁 No more products to process.`);
        break;
      }

      console.log(`🔍 Processing ${items.length}/${total}`);

      const aiResult = await this.safeClassify(items, categories);

      for (const product of items) {
        const match =
          aiResult.results?.find((r) => r.productId === product.id) ?? null;

        let matchedCategory: NormalizedCategory | null = null;

        if (match?.matchedCategoryId) {
          matchedCategory =
            cacheById.get(String(match.matchedCategoryId)) ?? null;
        }

        if (!matchedCategory && match?.matchedCategoryName) {
          const normalized = match.matchedCategoryName.toLowerCase().trim();
          matchedCategory =
            cacheByFull.get(normalized) || cacheByName.get(normalized) || null;
        }

        const confidence = match?.confidence ?? 0;

        buffer.push({
          productId: product.id,
          sku: product.sku,
          title: product.title,
          matchedCategory: matchedCategory?.name ?? '',
          matchedCategoryId: matchedCategory?.id ?? null,
          matchedCategoryPath: matchedCategory?.fullPath ?? null,
          confidence,
          status:
            confidence >= 0.6 && matchedCategory ? 'AUTO_MATCHED' : 'REVIEW',
          processedAt: new Date().toISOString(),
        });

        if (buffer.length >= 100) {
          await this.flush(buffer);
          buffer = [];
        }
      }

      if (!hasNext) break;
      currentOffset = nextOffset;
    }

    if (buffer.length) {
      await this.flush(buffer);
    }

    console.log(`🎉 Mapping completed.`);
  }

  /** -----------------------------------
   * 🛡 SAFE OPENAI CLASSIFICATION
   * ----------------------------------*/
  private async safeClassify(
    items: any[],
    categories: any[],
  ): Promise<ClassifyResponse> {
    const MAX_RETRY = 3;

    const cleanText = (raw: any): string => {
      let txt = typeof raw === 'string' ? raw : JSON.stringify(raw);

      return txt
        .replace(/[\u0000-\u001F]+/g, '') // remove control chars
        .replace(/\r?\n|\r/g, ' ') // remove line breaks
        .replace(/\t/g, ' ') // remove tabs
        .trim();
    };

    const extractJson = (text: string): string => {
      const first = text.indexOf('{');
      const last = text.lastIndexOf('}');
      if (first === -1 || last === -1) return '{}';
      return text.substring(first, last + 1);
    };

    for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
      try {
        const raw = await this.openAiRepository.classifyBatch({
          products: items,
          vtexCategories: categories, // keep key name for compatibility
        });

        const cleaned = extractJson(cleanText(raw));
        return JSON.parse(cleaned);
      } catch (err: any) {
        console.warn(
          `⚠️ OpenAI Error (attempt ${attempt}/${MAX_RETRY}): ${err.message}`,
        );

        if (attempt === MAX_RETRY) {
          console.warn(
            `❌ Failed after ${MAX_RETRY} attempts → fallback empty result`,
          );
          return { results: [] };
        }

        await new Promise((res) => setTimeout(res, attempt * 500)); // exponential wait
      }
    }

    return { results: [] };
  }

  /** -----------------------------------
   * 💾 Write to sheet in batches
   * ----------------------------------*/
  private async flush(buffer: MatchRow[]) {
    const sheetName = this.categorySource.getSheetName();
    console.log(`📝 Writing ${buffer.length} rows → Sheet: ${sheetName}`);

    await this.matchSheetRepository.write(sheetName, buffer);
    await new Promise((r) => setTimeout(r, 500));
  }
}
