import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IGoogleSheetsConfig,
  GoogleSheetsCredentials,
} from '../../../core/adapters/config/IGoogleSheetsConfig';

@Injectable()
export class GoogleSheetsConfigService implements IGoogleSheetsConfig {
  constructor(private readonly configService: ConfigService) {}

  getReadCredentials(): GoogleSheetsCredentials {
    return this.loadCredentials();
  }

  getWriteCredentials(): GoogleSheetsCredentials {
    return this.loadCredentials();
  }

  private loadCredentials(): GoogleSheetsCredentials {
    const encoded = this.getEnv('GOOGLE_WRITE_CREDENTIALS_BASE64');

    let decoded: string;
    try {
      decoded = Buffer.from(encoded, 'base64').toString('utf8');
    } catch (error) {
      throw new Error('Invalid base64 in GOOGLE_WRITE_CREDENTIALS_BASE64');
    }

    let credentials: GoogleSheetsCredentials;
    try {
      credentials = JSON.parse(decoded);
    } catch (error) {
      throw new Error('Invalid JSON in GOOGLE_WRITE_CREDENTIALS_BASE64');
    }

    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

    return credentials;
  }

  private getEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }
}
