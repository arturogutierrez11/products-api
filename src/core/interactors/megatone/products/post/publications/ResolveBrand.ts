// import { ProductMadre } from 'src/core/entities/products/madre/ProductMadre';
// import { IBrandsMegatoneRepository } from 'src/core/adapters/repositories/categories/megatone/IBrandsMegatoneRepository';
// import { SavePublicationHistory } from './SavePublicationHistory';
// import { MegatonePublicationAction } from 'src/core/entities/products/megatone/MegatonePublicationHistory';
//
// interface ResolveBrandBuilder {
//   brandsRepository: IBrandsMegatoneRepository;
//   history: SavePublicationHistory;
// }
//
// interface ResolveBrandBuilder {
//   brandsRepository: IBrandsMegatoneRepository;
//   history: SavePublicationHistory;
// }
//
// export class ResolveBrand {
//   private readonly brandsRepository: IBrandsMegatoneRepository;
//   private readonly history: SavePublicationHistory;
//
//   constructor(builder: ResolveBrandBuilder) {
//     this.brandsRepository = builder.brandsRepository;
//     this.history = builder.history;
//   }
//
//   async resolve(product: ProductMadre): Promise<number | null> {
//     const brandsMap = await this.brandsRepository.getAllMatchBrands();
//     const match = brandsMap.get(product.sku);
//
//     if (!match?.brandId) {
//       await this.history.skipped({
//         sku: product.sku,
//         action: MegatonePublicationAction.PUBLISH,
//         reasonCode: 'BRAND_NOT_MAPPED',
//         reasonMessage: 'SKU sin marca Megatone asociada',
//         payload: { sku: product.sku }
//       });
//
//       return null;
//     }
//
//     return match.brandId;
//   }
// }
