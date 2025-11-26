export interface ClassifyResult {
  productId: number;
  sku: string;
  matchedCategoryId: string | number | null;
  matchedCategoryName: string | null;
  confidence: number;
}

export interface ClassifyResponse {
  results: ClassifyResult[];
}
