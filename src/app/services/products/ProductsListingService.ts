import { Injectable } from '@nestjs/common';
import { SQLProductRepository } from '../../drivers/repositories/SQLQuerys/SQLProductRepository';

@Injectable()
export class ProductsListingService {
  constructor(private readonly productRepository: SQLProductRepository) {}

  async listProductsBatch(limit = 500, offset = 0) {
    const [products, total] = await Promise.all([
      this.productRepository.findAllProducts(limit, offset),
      this.productRepository.countAllProducts(),
    ]);

    const items = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      title: p.titulo,
      description: p.descripcion,
    }));

    const nextOffset = offset + limit;
    const hasNext = nextOffset < total;

    return {
      total,
      limit,
      offset,
      count: items.length,
      hasNext,
      nextOffset: hasNext ? nextOffset : null,
      items,
    };
  }
}
