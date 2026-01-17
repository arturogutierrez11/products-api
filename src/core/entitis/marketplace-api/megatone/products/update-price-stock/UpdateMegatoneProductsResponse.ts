export interface UpdateMegatoneProductsResponse {
  status: 'UPDATED' | 'PARTIAL' | 'ERROR';
  total: number;
  success: number;
  failed: number;
  items: Array<{
    publicationId: number;
    priceUpdated: boolean;
    stockUpdated: boolean;
  }>;
}
