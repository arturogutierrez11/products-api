import { Injectable } from '@nestjs/common';
import {
  IOpenAIRepository,
  ClassifyResponse,
} from 'src/core/adapters/repositories/openai/IOpenAIRepository';
import axios from 'axios';

@Injectable()
export class OpenaiMatchCategoriesRepository implements IOpenAIRepository {
  private readonly apiKey = process.env.OPENAI_API_KEY!;
  private readonly model = 'gpt-4o-mini'; // 🚀 estable y rápido

  async classifyBatch({ products, vtexCategories }): Promise<ClassifyResponse> {
    const payload = {
      model: this.model,
      temperature: 0,
      response_format: { type: 'json_object' },
      max_tokens: 500, // 🚦 CONTROL
      messages: [
        {
          role: 'system',
          content: `
Clasifica productos en categorías VTEX.
Responde SOLO JSON válido.

Formato esperado:

{
 "results":[
   {
     "productId": number,
     "sku": string,
     "matchedCategoryId": string | null,
     "matchedCategoryName": string | null,
     "confidence": number (0-1)
   }
 ]
}
`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            categories: vtexCategories.map((c) => ({
              id: c.id,
              name: c.name,
            })),
            products: products.map((p) => ({
              id: p.id,
              sku: p.sku,
              text: `${p.title}`.substring(0, 80),
            })),
          }),
        },
      ],
    };

    try {
      const { data } = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
          timeout: 15000,
        },
      );

      const raw = data.choices?.[0]?.message?.content;

      if (!raw) return { results: [] };

      return JSON.parse(raw);
    } catch (err) {
      console.log(`⚠️ OpenAI Error → ${err.message}`);
      return { results: [] }; // ❌ NO RE-INTENTA → SE SALTA
    }
  }
}
