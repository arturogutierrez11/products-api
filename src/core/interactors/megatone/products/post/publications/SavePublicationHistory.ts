// import { Inject } from '@nestjs/common';
// import { IMegatonePublicationHistoryRepository } from 'src/core/adapters/repositories/products/megatone/IMegatonePublicationHistoryRepository';
// import {
//   MegatonePublicationHistory,
//   MegatonePublicationAction,
//   MegatonePublicationStatus
// } from 'src/core/entities/products/megatone/MegatonePublicationHistory';
//
// export class SavePublicationHistory {
//   constructor(
//     @Inject('IMegatonePublicationHistoryRepository')
//     private readonly repository: IMegatonePublicationHistoryRepository
//   ) {}
//
//   async save(entry: MegatonePublicationHistory): Promise<void> {
//     await this.repository.save({
//       ...entry,
//       createdAt: new Date()
//     });
//   }
//
//   async skipped(params: {
//     sku: string;
//     action: MegatonePublicationAction;
//     reasonCode: string;
//     reasonMessage: string;
//     payload?: any;
//   }) {
//     await this.save({
//       sku: params.sku,
//       action: params.action,
//       status: MegatonePublicationStatus.SKIPPED,
//       errorCode: params.reasonCode,
//       errorMessage: params.reasonMessage,
//       payload: params.payload
//     });
//   }
//
//   async success(params: {
//     sku: string;
//     action: MegatonePublicationAction;
//     megatonePublicationId?: number;
//     megatoneSku?: string;
//     categoryId?: number;
//     brandId?: number;
//     price?: number;
//     stock?: number;
//     payload?: any;
//     response?: any;
//   }) {
//     await this.save({
//       ...params,
//       status: MegatonePublicationStatus.SUCCESS
//     });
//   }
//
//   async failed(params: {
//     sku: string;
//     action: MegatonePublicationAction;
//     errorCode?: string;
//     errorMessage: string;
//     payload?: any;
//     response?: any;
//   }) {
//     await this.save({
//       ...params,
//       status: MegatonePublicationStatus.FAILED
//     });
//   }
// }
