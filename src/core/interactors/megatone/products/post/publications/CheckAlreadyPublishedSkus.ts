// import { Inject, Injectable } from '@nestjs/common';
// import { IMegatonePublicationHistoryRepository } from 'src/core/adapters/repositories/products/megatone/IMegatonePublicationHistoryRepository';
//
// @Injectable()
// export class CheckAlreadyPublishedSkus {
//   constructor(
//     @Inject('IMegatonePublicationHistoryRepository')
//     private readonly historyRepo: IMegatonePublicationHistoryRepository
//   ) {}
//
//   async execute(): Promise<Set<string>> {
//     return this.historyRepo.findPublishedSkus();
//   }
// }
