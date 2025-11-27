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

  async run(batchSize = 200, startOffset = 0) {
    console.log(
      `\n🚀 Starting categorization of products using AI + VTEX mapping...`,
    );

    // Obtener categorías una sola vez
    const rawTree = await this.categoriesVtexRepository.getTree();
    const vtexCategories = this.flattenCategories(rawTree);

    // Índices rápidos
    const byFullPath = new Map(
      vtexCategories.map((c) => [c.fullPath.toLowerCase(), c]),
    );
    const byName = new Map(
      vtexCategories.map((c) => [c.name.toLowerCase(), c]),
    );
    const byId = new Map(vtexCategories.map((c) => [String(c.id), c]));

    let offset = startOffset;

    while (true) {
      console.log(`📍 Fetching products at offset=${offset}`);

      const { items, hasNext, nextOffset, total } =
        await this.productsRepository.findPaginated(batchSize, offset);

      if (!items.length) {
        console.log(`🏁 No more products to process.`);
        break;
      }

      console.log(`📦 Processing ${items.length}/${total}`);

      // 🧠 OpenAI batch con fallback
      const result: ClassifyResponse =
        (await this.openAiRepository.classifyBatch({
          products: items,
          vtexCategories,
        })) ?? { results: [] };

      const rowsToWrite: MatchRow[] = [];

      for (let i = 0; i < items.length; i++) {
        const product = items[i];

        const classification =
          result?.results?.find(
            (r) => r.productId === product.id && r.sku === product.sku,
          ) ??
          result?.results?.[i] ??
          null;

        if (!classification) {
          rowsToWrite.push({
            productId: product.id,
            sku: product.sku,
            title: product.title,
            matchedCategory: '',
            matchedCategoryId: null,
            matchedCategoryPath: null,
            confidence: 0,
            status: 'RETRY',
            processedAt: new Date().toISOString(),
          });
          continue;
        }

        const {
          matchedCategoryId,
          matchedCategoryName,
          confidence = 0,
        } = classification;

        let matched: VtexCategory | null = null;

        // Intentar match por ID
        if (matchedCategoryId)
          matched = byId.get(String(matchedCategoryId)) ?? null;

        // Intentar match por nombre o fullpath
        if (!matched && matchedCategoryName) {
          const normalized = matchedCategoryName.toLowerCase().trim();
          matched =
            byFullPath.get(normalized) || byName.get(normalized) || null;
        }

        const status: MatchRow['status'] =
          confidence >= 0.6 && matched ? 'AUTO_MATCHED' : 'REVIEW';

        rowsToWrite.push({
          productId: product.id,
          sku: product.sku,
          title: product.title,
          matchedCategory: matchedCategoryName ?? '',
          matchedCategoryId: matched?.id ?? null,
          matchedCategoryPath: matched?.fullPath ?? null,
          confidence,
          status,
          processedAt: new Date().toISOString(),
        });
      }

      console.log(`📝 Writing ${rowsToWrite.length} rows to Google Sheets...`);
      await this.matchSheetRepository.write(rowsToWrite);

      if (!hasNext) {
        console.log(`🎉 Completed processing all ${total} products.`);
        break;
      }

      offset = nextOffset;
      console.log(`⏭ Moving to next batch...\n`);
    }

    console.log(`\n🏁 DONE! Categorization completed.`);
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
