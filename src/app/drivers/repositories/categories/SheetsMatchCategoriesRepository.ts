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
      throw new Error(
        `Missing Google Sheet config: SHEET_MADRE_CATEGORIAS_ID or SHEET_MADRE_CATEGORIAS_NAME`,
      );
    }
  }

  async write(rows: any[]): Promise<void> {
    this.validateConfig();

    if (!rows || rows.length === 0) {
      return;
    }

    // 1️⃣ Leer lo existente
    const existingRows = await this.sheetReader.readAsObject(
      this.sheetId!,
      this.sheetName!,
    );

    // 2️⃣ Concatenar nuevo + existente
    const updatedRows = [...existingRows, ...rows];

    // 3️⃣ Reescribir todo ya acumulado
    await this.sheetReader.write(this.sheetId!, this.sheetName!, updatedRows);
  }

  async clear(): Promise<void> {
    this.validateConfig();
    await this.sheetReader.write(this.sheetId!, this.sheetName!, []);
  }
}
