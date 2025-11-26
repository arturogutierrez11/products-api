import axios from 'axios';
import { IVtexCategoriesRepository } from 'src/core/adapters/repositories/vtex/categories/IVtexCategoriesRepository';
import { VTEXCategoryTree } from 'src/core/entities/VTEXCategory';

export class VtexCategoriesRepository implements IVtexCategoriesRepository {
  private readonly account = process.env.VTEX_ACCOUNT!;
  private readonly appKey = process.env.VTEX_APP_KEY!;
  private readonly appToken = process.env.VTEX_APP_TOKEN!;

  async getTree(): Promise<VTEXCategoryTree[]> {
    const url = `https://${this.account}.vtexcommercestable.com.br/api/catalog_system/pvt/category/tree/125`;

    try {
      const { data } = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-VTEX-API-AppKey': this.appKey,
          'X-VTEX-API-AppToken': this.appToken,
        },
      });

      return this.cleanTree(data ?? []);
    } catch (error: any) {
      throw new Error('No se pudo obtener el árbol de categorías VTEX');
    }
  }

  private cleanTree(nodes: any[]): VTEXCategoryTree[] {
    return nodes.map((node) => ({
      id: node.id,
      name: node.name,
      hasChildren: node.hasChildren,
      children:
        node.children && node.children.length > 0
          ? this.cleanTree(node.children)
          : [],
    }));
  }
}
