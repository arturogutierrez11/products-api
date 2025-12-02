import { MatchCategoriesEngine } from './MatchCategoriesEngine';
import { RetryCategoriesEngine } from './RetryCategoriesEngine';
import { OncityCategorySourceAdapter } from './OncityCategorySourceAdapter';
import { MegatoneCategorySourceAdapter } from './MegatoneCategorySourceAdapter';

export enum MappingSource {
  ONCITY = 'ONCITY',
  MEGATONE = 'MEGATONE',
}

type FactoryDeps = {
  oncityRepo: any;
  megatoneRepo: any;
  openAiRepo: any;
  productsRepo: any;
  sheetRepo: any;
};

export class CategoryMappingFactory {
  /** 🧠 MAIN MAPPER ENGINE (initial run) */
  static create(source: MappingSource, deps: FactoryDeps) {
    let adapter;

    switch (source) {
      case MappingSource.ONCITY:
        adapter = new OncityCategorySourceAdapter(deps.oncityRepo);
        break;

      case MappingSource.MEGATONE:
        adapter = new MegatoneCategorySourceAdapter(deps.megatoneRepo);
        break;

      default:
        throw new Error(`Unknown mapping source: ${source}`);
    }

    return new MatchCategoriesEngine(
      adapter,
      deps.openAiRepo,
      deps.productsRepo,
      deps.sheetRepo,
    );
  }

  static createRetry(source: MappingSource, deps: FactoryDeps) {
    let adapter;

    switch (source) {
      case MappingSource.ONCITY:
        adapter = new OncityCategorySourceAdapter(deps.oncityRepo);
        break;

      case MappingSource.MEGATONE:
        adapter = new MegatoneCategorySourceAdapter(deps.megatoneRepo);
        break;

      default:
        throw new Error(`Unknown mapping source: ${source}`);
    }

    return new RetryCategoriesEngine(
      adapter, // 👈 ahora sí categorySource es el adapter correcto
      deps.sheetRepo,
      deps.openAiRepo,
    );
  }
}
