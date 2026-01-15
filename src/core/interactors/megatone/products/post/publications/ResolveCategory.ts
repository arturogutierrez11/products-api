// import { ProductMadre } from 'src/core/entities/products/madre/ProductMadre';
// import { IMegatoneMatchCategoriesRepository } from 'src/core/adapters/repositories/categories/megatone/IMegatoneMatchCategoriesRepository';
// import { SavePublicationHistory } from './SavePublicationHistory';
// import { MegatonePublicationAction } from 'src/core/entities/products/megatone/MegatonePublicationHistory';
//
// interface ResolveCategoryBuilder {
//   categoriesRepository: IMegatoneMatchCategoriesRepository;
//   history: SavePublicationHistory;
// }
//
// export class ResolveCategory {
//   private readonly categoriesRepository: IMegatoneMatchCategoriesRepository;
//   private readonly history: SavePublicationHistory;
//
//   constructor(builder: ResolveCategoryBuilder) {
//     this.categoriesRepository = builder.categoriesRepository;
//     this.history = builder.history;
//   }
//
//   async resolve(product: ProductMadre): Promise<number | null> {
//     const categoriesMap = await this.categoriesRepository.getAllMatchCategoriesMap();
//
//     const match = categoriesMap.get(product.sku);
//
//     if (!match?.categoryId) {
//       await this.history.skipped({
//         sku: product.sku,
//         action: MegatonePublicationAction.PUBLISH,
//         reasonCode: 'CATEGORY_NOT_FOUND',
//         reasonMessage: 'Producto sin categoría Megatone asociada',
//         payload: {
//           sku: product.sku,
//           categoryPath: product.categoryPath
//         }
//       });
//
//       return null;
//     }
//
//     return match.categoryId;
//   }
// }
