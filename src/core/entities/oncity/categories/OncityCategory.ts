export interface OncityCategory {
  id: number;
  name: string;
  hasChildren?: boolean;
  children?: OncityCategory[];
}

export interface OncityCategoryMatch {
  id: number;
  sku: string;
  matched_category: string;
  id_category: number;
}
