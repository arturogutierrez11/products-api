// src/core/interactors/categories/MatchCategories/RetryCategoriesEngine.ts

import { ICategorySourceAdapter } from 'src/core/adapters/repositories/categories/MatchCategoriesEngine/ICategorySourceAdapter';
import { IMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';
import {
  IOpenAIRepository,
  ClassifyResponse,
} from 'src/core/adapters/repositories/openai/IOpenAIRepository';

export class RetryCategoriesEngine {
  private readonly MIN_CONFIDENCE = 0.7;
  private readonly BATCH_SIZE = 50;

  constructor(
    private readonly categorySource: ICategorySourceAdapter,
    private readonly sheetRepo: IMatchCategoriesRepository,
    private readonly openAI: IOpenAIRepository,
  ) {}

  async run(limit = 50) {
    const sheetName = this.categorySource.getSheetName();
    console.log(`\n🔁 Retry Started → Marketplace: ${sheetName}`);

    const sheetRows = await this.sheetRepo.readAll(sheetName);

    const pending = sheetRows.filter(
      (r) => !r.matchedCategoryId || r.confidence < this.MIN_CONFIDENCE,
    );

    if (!pending.length) {
      console.log(`✔️ No pending classifications.`);
      return;
    }

    console.log(`📌 Pending: ${pending.length}`);

    const categories = await this.categorySource.getCategories();
    let buffer: any[] = [];

    for (let i = 0; i < pending.length; i += limit) {
      const batch = pending.slice(i, i + limit);

      const ai = await this.callAIWithRetry(
        {
          products: batch.map((r) => ({
            id: r.productId,
            sku: r.sku,
            title: r.title,
            description: r.description ?? '',
          })),
          vtexCategories: categories,
        },
        3,
      );

      if (!ai?.results?.length) {
        console.warn('⏭️ Batch skipped (AI returned no valid results)');
        continue;
      }

      buffer.push(...ai.results);

      if (buffer.length >= this.BATCH_SIZE) {
        console.log(`💾 Flushing ${buffer.length} rows...`);
        await this.sheetRepo.applyResults?.(sheetName, buffer);
        buffer = [];
      }

      await this.sleep(300);
    }

    if (buffer.length) {
      console.log(`💾 Writing remaining ${buffer.length} rows...`);
      await this.sheetRepo.applyResults?.(sheetName, buffer);
    }

    console.log(`🎉 Retry completed.`);
  }

  private async callAIWithRetry(
    payload: any,
    maxAttempts = 3,
  ): Promise<ClassifyResponse | null> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const raw = await this.openAI.classifyBatch(payload);

        let text = typeof raw === 'string' ? raw : JSON.stringify(raw);

        // Limpieza básica
        text = text
          .replace(/[\u0000-\u0008\u000B-\u001F]+/g, '')
          .replace(/\n+/g, ' ')
          .replace(/\t+/g, ' ')
          .replace(/\r+/g, ' ')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .trim();

        // Primer intento
        try {
          return JSON.parse(text);
        } catch {
          console.warn('⚠️ JSON invalid → trying repair heuristics...');
        }

        // 🚑 Intento de reparar JSON roto
        const repaired = this.tryRepairJson(text);

        if (repaired) {
          console.log('🔧 JSON repaired successfully!');
          return repaired as unknown as ClassifyResponse;
        }

        throw new Error('JSON could not be repaired');
      } catch (err: any) {
        console.warn(
          `⚠️ OpenAI Error → ${err.message} (attempt ${attempt}/${maxAttempts})`,
        );

        if (attempt < maxAttempts) {
          await this.sleep(attempt * 1000);
          continue;
        }

        console.warn('⛔ AI returned invalid JSON after all attempts');
        return null;
      }
    }

    return null;
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
  /**
   * Repara JSON roto usando heurísticas
   */
  private tryRepairJson(text: string): string | null {
    try {
      // 1. Remover caracteres invisibles
      text = text.replace(/[\u0000-\u001F]+/g, '').trim();

      // 2. Intento de cerrar objetos o arrays abiertos
      const openBraces = (text.match(/{/g) || []).length;
      const closeBraces = (text.match(/}/g) || []).length;

      if (openBraces > closeBraces) {
        text = text + '}'.repeat(openBraces - closeBraces);
      }

      const openBrackets = (text.match(/\[/g) || []).length;
      const closeBrackets = (text.match(/]/g) || []).length;

      if (openBrackets > closeBrackets) {
        text = text + ']'.repeat(openBrackets - closeBrackets);
      }

      // 3. Comas colgantes
      text = text.replace(/,\s*([}\]])/g, '$1');

      // 4. Reintentar parseo
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}
