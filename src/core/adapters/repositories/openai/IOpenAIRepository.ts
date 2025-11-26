import { ClassifyResponse } from 'src/core/entities/openai/OpenAiResponse';

export interface IOpenAIRepository {
  classifyBatch({
    products,
    vtexCategories,
  }: {
    products: { id: number; sku: string; title: string; description: string }[];
    vtexCategories: { id: number | string; name: string; fullPath: string }[];
  }): Promise<ClassifyResponse>;
}
export { ClassifyResponse };
