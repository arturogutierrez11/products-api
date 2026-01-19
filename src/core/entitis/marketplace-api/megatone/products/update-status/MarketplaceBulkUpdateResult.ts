export interface MarketplaceBulkUpdateResult {
  status: 'UPDATED' | 'FAILED' | 'PARTIAL';

  total: number;
  success: number;
  failed: number;

  items: {
    publicationId?: number;
    success?: boolean;
    message?: string;
  }[];
}
