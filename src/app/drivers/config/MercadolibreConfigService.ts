// import { IMercadolibreConfigService } from '@core/adapters/config/IMercadolibreConfigService';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
//
// @Injectable()
// export class MercadolibreConfigService implements IMercadolibreConfigService {
//   constructor(private readonly configService: ConfigService) {}
//
//   isStaging(): boolean {
//     return this.getEnv('MERCADOLIBRE_MODE') === 'test';
//   }
//
//   private getEnv(key: string): string {
//     const value = this.configService.get<string>(key);
//     if (!value) {
//       throw new Error(`${key} environment variable is not set`);
//     }
//     return value;
//   }
// }
