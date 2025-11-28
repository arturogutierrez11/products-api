import { Injectable } from '@nestjs/common';
import { SpreadSheetReader } from '../../spreadsheets/SpreadSheetReader';
import { IMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';

@Injectable()
export class SheetsMatchCategoriesRepository
  implements IMatchCategoriesRepository
{
  private readonly sheetId = process.env.SHEET_MADRE_CATEGORIAS_ID;
  private readonly sheetName = process.env.SHEET_MADRE_CATEGORIAS_NAME;

  constructor(private readonly sheetReader: SpreadSheetReader) {}

  private validateConfig() {
    if (!this.sheetId || !this.sheetName) {
      throw new Error(`Missing Google Sheet config`);
    }
  }

  async readAll(): Promise<any[]> {
    this.validateConfig();
    return this.sheetReader.readAsObject(this.sheetId!, this.sheetName!);
  }

  async write(rows: any[]): Promise<void> {
    this.validateConfig();
    if (!rows?.length) return;

    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(
          `📝 Writing ${rows.length} rows to Google Sheets (attempt ${
            attempt + 1
          }/${maxRetries})...`,
        );

        await this.sheetReader.append(this.sheetId!, this.sheetName!, rows);

        console.log(`✅ Write successful.`);
        return;
      } catch (error: any) {
        attempt++;

        const isTimeout =
          error?.name === 'TimeoutError' ||
          error?.message?.toLowerCase().includes('timeout') ||
          error?.message?.toLowerCase().includes('503') ||
          error?.message?.toLowerCase().includes('rate') ||
          error?.message?.toLowerCase().includes('limit');

        if (attempt >= maxRetries) {
          console.log('❌ Max retries reached. Giving up.');
          throw error;
        }

        const waitMs = attempt * 2000 + Math.random() * 400;
        console.log(
          `⚠️ Sheets write failed (${
            isTimeout ? 'timeout' : 'error'
          }). Retrying in ${waitMs.toFixed(0)} ms`,
        );

        await new Promise((res) => setTimeout(res, waitMs));
      }
    }
  }

  async applyResults(rows: any[]): Promise<void> {
    this.validateConfig();

    console.log(`🔄 Updating existing sheet rows...`);

    const sheetRows = await this.readAll();

    const updated = sheetRows.map((row) => {
      const match = rows.find(
        (r) => String(r.productId) === String(row.productId),
      );

      if (!match) return row;

      return {
        ...row,
        matchedCategory: match.matchedCategory,
        matchedCategoryId: match.matchedCategoryId,
        matchedCategoryPath: match.matchedCategoryPath,
        confidence: match.confidence,
        status: match.confidence >= 0.7 ? 'AUTO_MATCHED' : 'RETRY',
        processedAt: match.processedAt,
      };
    });

    console.log(`📝 Saving updated rows...`);

    await this.sheetReader.write(this.sheetId!, this.sheetName!, updated);

    console.log(`✅ Sheet updated successfully.`);
  }

  async clear(): Promise<void> {
    this.validateConfig();
    await this.sheetReader.write(this.sheetId!, this.sheetName!, []);
  }
}
