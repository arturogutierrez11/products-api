import { Injectable } from '@nestjs/common';
import { SpreadSheetReader } from '../../spreadsheets/SpreadSheetReader';
import { IMatchCategoriesrespoitory } from 'src/core/adapters/repositories/categories/IMatchCategoriesrespoitory';

@Injectable()
export class SheetsMatchCategoriesRepository
  implements IMatchCategoriesrespoitory
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

    const existing = await this.readAll();
    const updated = [...existing, ...rows];

    await this.sheetReader.write(this.sheetId!, this.sheetName!, updated);
  }

  async updateRows(updatedRows: any[]): Promise<void> {
    this.validateConfig();

    const sheetRows = await this.readAll();

    const rewritten = sheetRows.map((existing) => {
      const updated = updatedRows.find(
        (r) => r.productId === existing.productId,
      );
      return updated ? { ...existing, ...updated } : existing;
    });

    await this.sheetReader.write(this.sheetId!, this.sheetName!, rewritten);
  }

  async clear(): Promise<void> {
    this.validateConfig();
    await this.sheetReader.write(this.sheetId!, this.sheetName!, []);
  }
}
