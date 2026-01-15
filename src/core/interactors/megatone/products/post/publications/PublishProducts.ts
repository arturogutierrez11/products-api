// import { ISqlProductsRepository } from 'src/core/adapters/repositories/products/madre/ISqlProductsRepository';
// import { IMegatonePublicationsRepository } from 'src/core/adapters/repositories/products/megatone/IMegatonePublicationsRepository';
// import { ResolveCategory } from './ResolveCategory';
// import { ResolveBrand } from './ResolveBrand';
// import { ResolveMegatonePrices } from './pricing/ResolveMegatonePrices';
// import { BuildPayload } from './BuildPayload';
// import { SavePublicationHistory } from './SavePublicationHistory';
// import { CheckAlreadyPublishedSkus } from './CheckAlreadyPublishedSkus';
// import { MegatonePublicationAction } from 'src/core/entities/products/megatone/MegatonePublicationHistory';
//
// interface SkuPayloadEntry {
//   payload: any;
//   categoryId: number;
//   brandId: number;
// }
//
// export class PublishProducts {
//   private readonly BATCH_SIZE = 45;
//
//   constructor(
//     private readonly productsRepository: ISqlProductsRepository,
//     private readonly resolveCategory: ResolveCategory,
//     private readonly resolveBrand: ResolveBrand,
//     private readonly resolvePrices: ResolveMegatonePrices,
//     private readonly history: SavePublicationHistory,
//     private readonly checkAlreadyPublished: CheckAlreadyPublishedSkus,
//     private readonly megatonePublicationsRepo: IMegatonePublicationsRepository
//   ) {}
//
//   async execute(): Promise<void> {
//     let offset = 0;
//
//     const alreadyPublishedSkus = await this.checkAlreadyPublished.execute();
//
//     while (true) {
//       const page = await this.productsRepository.findAll({
//         limit: this.BATCH_SIZE,
//         offset
//       });
//
//       if (!page.items.length) break;
//
//       const bulk: any[] = [];
//       const skuIndex = new Map<string, SkuPayloadEntry>();
//
//       for (const product of page.items) {
//         /* ⛔ YA PUBLICADO */
//         if (alreadyPublishedSkus.has(product.sku)) {
//           if (alreadyPublishedSkus.has(product.sku)) {
//             await this.history.skipped({
//               sku: product.sku,
//               action: MegatonePublicationAction.PUBLISH,
//               reasonCode: 'ALREADY_PUBLISHED',
//               reasonMessage: 'El producto ya se encuentra publicado en Megatone'
//             });
//             continue;
//           }
//           continue;
//         }
//
//         const categoryId = await this.resolveCategory.resolve(product);
//         if (!categoryId) continue;
//
//         const brandId = await this.resolveBrand.resolve(product);
//         if (!brandId) continue;
//
//         const prices = this.resolvePrices.resolve(product.price);
//         const payload = BuildPayload.build(product, categoryId, brandId, prices);
//
//         bulk.push(payload);
//         skuIndex.set(product.sku, { payload, categoryId, brandId });
//       }
//
//       if (bulk.length > 0) {
//         await this.publishBulk(bulk, skuIndex);
//       }
//
//       if (!page.hasNext) break;
//       offset = page.nextOffset!;
//     }
//   }
//
//   /* ======================================================
//      PUBLICACIÓN BULK + HISTORY (LÓGICA DEFINITIVA)
//   ====================================================== */
//   private async publishBulk(bulk: any[], skuIndex: Map<string, SkuPayloadEntry>): Promise<void> {
//     const processedSkus = new Set<string>();
//
//     const response = await this.megatonePublicationsRepo.createBulk({
//       MasivaBulks: bulk
//     });
//
//     /* =========================
//        ✅ PUBLICADOS
//     ========================= */
//     for (const pub of response.Publicacion ?? []) {
//       const entry = skuIndex.get(pub.SkuSeller);
//       if (!entry) continue;
//
//       processedSkus.add(pub.SkuSeller);
//
//       await this.history.success({
//         sku: pub.SkuSeller,
//         action: MegatonePublicationAction.PUBLISH,
//         megatonePublicationId: pub.IdPublicacion,
//         categoryId: entry.categoryId,
//         brandId: entry.brandId,
//         price: entry.payload.PrecioLista,
//         stock: entry.payload.Stock,
//         payload: entry.payload,
//         response: pub
//       });
//     }
//
//     /* =========================
//        ❌ / ⚠️ ERRORES POR SKU
//     ========================= */
//     for (const error of response.Errors ?? []) {
//       const sku = error.SkuSeller;
//       const entry = skuIndex.get(sku);
//       if (!entry) continue;
//
//       processedSkus.add(sku);
//
//       const message = (error as any).ErrorMesage ?? (error as any).Message ?? 'Error Megatone';
//
//       const target = (error as any).Target;
//
//       /* ⚠️ SKU YA EXISTE → SKIPPED */
//       if (target === 'SkuSeller' && typeof message === 'string' && message.includes('ya existe')) {
//         await this.history.skipped({
//           sku,
//           action: MegatonePublicationAction.PUBLISH,
//           reasonCode: 'ALREADY_EXISTS',
//           reasonMessage: message,
//           payload: entry.payload
//         });
//         continue;
//       }
//
//       /* ❌ ERROR REAL */
//       await this.history.failed({
//         sku,
//         action: MegatonePublicationAction.PUBLISH,
//         errorMessage: message,
//         payload: entry.payload,
//         response: error
//       });
//     }
//
//     /* =========================
//        ❌ SKUs SIN RESPUESTA
//     ========================= */
//     for (const [sku, entry] of skuIndex.entries()) {
//       if (processedSkus.has(sku)) continue;
//
//       await this.history.failed({
//         sku,
//         action: MegatonePublicationAction.PUBLISH,
//         errorMessage: 'MEGATONE_API_ERROR: Megatone no devolvió estado para este SKU',
//         payload: entry.payload,
//         response
//       });
//     }
//   }
// }
