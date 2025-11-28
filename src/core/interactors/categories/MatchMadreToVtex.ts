import { ISqlProductsRepository } from 'src/core/adapters/repositories/products/ISqlProductsRepository';
import { IVtexCategoriesRepository } from 'src/core/adapters/repositories/vtex/categories/IVtexCategoriesRepository';
import {
  IOpenAIRepository,
  ClassifyResponse,
} from 'src/core/adapters/repositories/openai/IOpenAIRepository';
import { IMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';

interface MatchMadreToVtexBuilder {
  categoriesVtexRepository: IVtexCategoriesRepository;
  openAiRepository: IOpenAIRepository;
  productsRepository: ISqlProductsRepository;
  matchSheetRepository: IMatchCategoriesRepository;
}

type VtexCategory = {
  id: number;
  name: string;
  fullPath: string;
};

type MatchRow = {
  productId: number;
  sku: string;
  title: string;
  matchedCategory: string;
  matchedCategoryId: number | null;
  matchedCategoryPath: string | null;
  confidence: number;
  status: 'AUTO_MATCHED' | 'REVIEW' | 'RETRY';
  processedAt: string;
};

export class MatchMadreToVtex {
  private readonly categoriesVtexRepository: IVtexCategoriesRepository;
  private readonly openAiRepository: IOpenAIRepository;
  private readonly productsRepository: ISqlProductsRepository;
  private readonly matchSheetRepository: IMatchCategoriesRepository;

  constructor(builder: MatchMadreToVtexBuilder) {
    this.categoriesVtexRepository = builder.categoriesVtexRepository;
    this.openAiRepository = builder.openAiRepository;
    this.productsRepository = builder.productsRepository;
    this.matchSheetRepository = builder.matchSheetRepository;
  }

  async run(batchSize = 200, manualOffset?: number) {
    console.log(`\n🚀 Starting categorization of products...`);

    // Detect offset (resume last progress)
    const savedRows = await this.matchSheetRepository.readAll();
    const offset = manualOffset ?? savedRows.length;
    console.log(`📌 Starting at offset=${offset}`);

    // Cache VTEX categories in memory (1 API call)
    const rawTree = await this.categoriesVtexRepository.getTree();
    const vtexCategories = this.flattenCategories(rawTree);

    const cacheById = new Map(vtexCategories.map((c) => [String(c.id), c]));
    const cacheByName = new Map(
      vtexCategories.map((c) => [c.name.toLowerCase(), c]),
    );
    const cacheByFull = new Map(
      vtexCategories.map((c) => [c.fullPath.toLowerCase(), c]),
    );

    // Buffer to avoid rate limits
    const flushSize = 50;
    let buffer: MatchRow[] = [];

    let currentOffset = offset;

    while (true) {
      console.log(`📍 Fetching products at offset=${currentOffset}`);

      const { items, hasNext, nextOffset, total } =
        await this.productsRepository.findPaginated(batchSize, currentOffset);

      if (!items.length) {
        console.log(`🏁 No more products to process.`);
        break;
      }

      console.log(`📦 Processing ${items.length}/${total}`);

      const aiResult: ClassifyResponse =
        (await this.openAiRepository.classifyBatch({
          products: items,
          vtexCategories,
        })) ?? { results: [] };

      for (let product of items) {
        const match =
          aiResult.results?.find((r) => r.productId === product.id) ?? null;

        let matchedCategory: VtexCategory | null = null;

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

        const row: MatchRow = {
          productId: product.id,
          sku: product.sku,
          title: product.title,
          matchedCategory: match?.matchedCategoryName ?? '',
          matchedCategoryId: matchedCategory?.id ?? null,
          matchedCategoryPath: matchedCategory?.fullPath ?? null,
          confidence,
          status:
            confidence >= 0.6 && matchedCategory ? 'AUTO_MATCHED' : 'REVIEW',
          processedAt: new Date().toISOString(),
        };

        buffer.push(row);

        // Write batch to sheets
        if (buffer.length >= flushSize) {
          console.log(`📝 Writing ${buffer.length} rows to Google Sheets...`);
          await this.matchSheetRepository.write(buffer);
          buffer = [];
          await new Promise((r) => setTimeout(r, 1000)); // prevent rate limit
        }
      }

      if (!hasNext) break;

      currentOffset = nextOffset;
      console.log(`⏭ Moving to next batch → offset=${currentOffset}`);
    }

    // Final flush
    if (buffer.length > 0) {
      console.log(`📝 Final write of ${buffer.length} rows...`);
      await this.matchSheetRepository.write(buffer);
    }

    console.log(`🏁 DONE — Categorization finished.`);
  }

  private flattenCategories(tree: any[], parentPath = ''): VtexCategory[] {
    return tree.flatMap((node) => {
      const fullPath = parentPath ? `${parentPath} > ${node.name}` : node.name;
      return [
        { id: node.id, name: node.name, fullPath },
        ...(node.children?.length
          ? this.flattenCategories(node.children, fullPath)
          : []),
      ];
    });
  }
}
