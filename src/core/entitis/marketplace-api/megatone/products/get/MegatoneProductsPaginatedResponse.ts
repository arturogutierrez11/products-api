import { MegatoneProduct } from './MegatoneProduct';

export interface MegatoneProductsPaginatedResponse {
  items: MegatoneProduct[];
  total: number;
  limit: number;
  offset: number;
  count: number;
  hasNext: boolean;
  nextOffset: number;
}
