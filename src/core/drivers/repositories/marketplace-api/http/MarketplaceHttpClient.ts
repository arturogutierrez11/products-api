import axios, { AxiosInstance, AxiosError } from 'axios';
import { MarketplaceHttpError } from './errors/MarketplaceHttpError';

export class MarketplaceHttpClient {
  private readonly client: AxiosInstance;

  constructor() {
    const baseURL = process.env.MARKETPLACE_API_BASE_URL;

    if (!baseURL) {
      throw new Error('MARKETPLACE_API_BASE_URL is not defined');
    }

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        Accept: '*/*'
      }
    });
  }

  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError('GET', url, error);
    }
  }

  private handleError(method: string, url: string, error: unknown): MarketplaceHttpError {
    const err = error as AxiosError;

    if (err.response) {
      return new MarketplaceHttpError(err.response.status, err.response.data, `[MARKETPLACE ${method}] ${url}`);
    }

    return new MarketplaceHttpError(500, err.message, `[MARKETPLACE ${method}] ${url}`);
  }
}
