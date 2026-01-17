import { MadreProductDto } from './dto/MadreProductDto';

export interface MadreProductsPaginatedResponse {
  items: MadreProductDto[];
  total: number;
  limit: number;
  offset: number;
  count: number;
  hasNext: boolean;
  nextOffset: number | null;
}
