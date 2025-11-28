import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Inject, Injectable } from '@nestjs/common';
import { IGoogleSheetsConfig } from '../../../core/adapters/config/IGoogleSheetsConfig';

@Injectable()
export class SpreadSheetReader {
  constructor(
    @Inject('IGoogleSheetsConfig')
    private readonly googleSheetsConfig: IGoogleSheetsConfig,
  ) {}

  private getReadCredentials() {
    return this.googleSheetsConfig.getReadCredentials();
  }

  private getWriteCredentials() {
    return this.googleSheetsConfig.getWriteCredentials();
  }

  async readAsObject(
    spreadSheetId: string,
    sheetTitle: string,
  ): Promise<Record<string, any>[]> {
    const doc = await this.loadDocument(spreadSheetId);
    const sheet = doc.sheetsByTitle[sheetTitle];

    const rows = await sheet.getRows();
    const headers = sheet.headerValues;

    const result: Record<string, any>[] = [];

    for (const row of rows) {
      const value: Record<string, any> = {};
      for (const header of headers) {
        value[this.camelize(header)] = row.get(header);
      }
      result.push(value);
    }

    return result;
  }

  private camelize(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase(),
      )
      .replace(/\s+/g, '');
  }

  private async loadDocument(spreadSheetId: string) {
    const creds = this.getReadCredentials();

    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

    const jwt = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(spreadSheetId, jwt);
    await doc.loadInfo();
    return doc;
  }

  private async loadWriteDocument(spreadSheetId: string) {
    const creds = this.getWriteCredentials();

    const SCOPES = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ];

    const jwt = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(spreadSheetId, jwt);
    await doc.loadInfo();
    return doc;
  }

  async readAsMap(
    spreadSheetId: string,
    sheetTitle: string,
  ): Promise<Record<string, string>> {
    const doc = await this.loadDocument(spreadSheetId);
    const sheet = doc.sheetsByTitle[sheetTitle];

    const rows = await sheet.getRows({ offset: 1 });
    const headers = sheet.headerValues;

    if (headers.length !== 2) {
      throw new Error('Invalid sheets columns (expected exactly 2 columns)');
    }

    const result: Record<string, string> = {};

    for (const row of rows) {
      result[row.get(headers[0])] = row.get(headers[1]);
    }

    return result;
  }

  async readAsArray(
    spreadSheetId: string,
    sheetTitle: string,
  ): Promise<string[]> {
    const doc = await this.loadDocument(spreadSheetId);
    const sheet = doc.sheetsByTitle[sheetTitle];

    const rows = await sheet.getRows({ offset: 1 });
    const headers = sheet.headerValues;

    if (headers.length !== 1) {
      throw new Error('Invalid sheets columns (expected exactly 1 column)');
    }

    const result: string[] = [];

    for (const row of rows) {
      result.push(row.get(headers[0]));
    }

    return result;
  }

  async write(spreadSheetId: string, sheetTitle: string, data: any[]) {
    const doc = await this.loadWriteDocument(spreadSheetId);
    let sheet = doc.sheetsByTitle[sheetTitle];

    const cleanedData = (data || []).filter(
      (d) => d !== undefined && d !== null,
    );

    if (cleanedData.length === 0) {
      return;
    }

    let headers: string[] = [];

    try {
      headers = sheet.headerValues;
    } catch (_) {}

    if (!headers.length) {
      await sheet.setHeaderRow(Object.keys(cleanedData[0]));
    }

    await sheet.clearRows();
    await sheet.addRows(cleanedData);
  }
  async append(spreadSheetId: string, sheetTitle: string, rows: any[]) {
    const doc = await this.loadWriteDocument(spreadSheetId);
    const sheet = doc.sheetsByTitle[sheetTitle];

    if (!rows?.length) return;

    let headers: string[] = [];

    try {
      headers = sheet.headerValues;
    } catch (_) {}

    if (!headers || headers.length === 0) {
      await sheet.setHeaderRow(Object.keys(rows[0]));
      headers = sheet.headerValues;
    }

    const formatted = rows.map((row) =>
      headers.reduce(
        (obj, h) => {
          obj[h] = row[h] ?? '';
          return obj;
        },
        {} as Record<string, any>,
      ),
    );

    await sheet.addRows(formatted);
  }
}
