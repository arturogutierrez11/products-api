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
    return this.getWriteCredentials(); // usan la misma
  }

  getWriteCredentials(): GoogleSheetsCredentials {
    const raw = this.getEnv('GOOGLE_WRITE_CREDENTIALS_BASE64');
    const decoded = Buffer.from(raw, 'base64').toString('utf8');

    const parsed = JSON.parse(decoded);

    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');

    return parsed;
  }

  private parseCredentials(envKey: string): GoogleSheetsCredentials {
    const encoded = this.getEnv(envKey);

    try {
      const json = Buffer.from(encoded, 'base64').toString('utf8');
      return JSON.parse(json);
    } catch (error) {
      console.error('Failed decoding Google credentials', error);
      throw new Error(`Invalid Base64 JSON in ${envKey}`);
    }
  }

  private getEnv(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`${key} environment variable is not set`);
    }
    return value;
  }
}
