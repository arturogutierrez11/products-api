import { Injectable } from '@nestjs/common';
import { SpreadSheetReader } from '../../spreadsheets/SpreadSheetReader';
import { IMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';

@Injectable()
export class SheetsMatchCategoriesRepository
  implements IMatchCategoriesRepository
{
  private readonly sheetId = process.env.SHEET_MADRE_CATEGORIAS_ID;

  constructor(private readonly sheetReader: SpreadSheetReader) {}

  private validateConfig(sheetName: string) {
    if (!this.sheetId || !sheetName) {
      throw new Error(`Missing Google Sheet config — SheetId or SheetName`);
    }
  }

  async readAll(sheetName: string): Promise<any[]> {
    return this.sheetReader.readAsObject(this.sheetId!, sheetName);
  }

  async write(sheetName: string, rows: any[]): Promise<void> {
    if (!rows?.length) return;

    await this.sheetReader.append(this.sheetId!, sheetName, rows);
  }

  async applyResults(sheetName: string, rows: any[]): Promise<void> {
    this.validateConfig(sheetName);
    if (!rows.length) return;

    const sheetRows = await this.readAll(sheetName);

    const updatedRows = sheetRows.map((existing) => {
      const match = rows.find(
        (r) => String(r.productId) === String(existing.productId),
      );
      return match ? { ...existing, ...match } : existing;
    });

    const sorted = updatedRows.sort((a, b) => a._rowIndex - b._rowIndex);
    const cleanRows = sorted.map(({ _rowIndex, ...rest }) => rest);

    await this.sheetReader.batchUpdateValues(
      this.sheetId!,
      sheetName,
      cleanRows,
    );
  }

  async clear(sheetName: string): Promise<void> {
    await this.sheetReader.write(this.sheetId!, sheetName, []);
  }
}
