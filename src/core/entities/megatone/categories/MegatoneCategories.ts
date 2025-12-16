export class MegatoneCategory {
  external_id: number;
  name: string;
}

export interface MegatoneCategoryMatch {
  id: number;
  sku: string;
  matched_category: string;
  id_category: number;
}
