import axios, { AxiosInstance, AxiosError } from 'axios';
import { MadreHttpError } from './errors/MadreHttpError';

export class MadreHttpClient {
  private readonly client: AxiosInstance;

  constructor() {
    const baseURL = process.env.MADRE_API_BASE_URL;

    if (!baseURL) {
      throw new Error('MADRE_API_BASE_URL is not defined');
    }

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
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

  async post<T>(url: string, body: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, body);
      return response.data;
    } catch (error) {
      throw this.handleError('POST', url, error);
    }
  }

  async put<T>(url: string, body: any): Promise<T> {
    try {
      const response = await this.client.put<T>(url, body);
      return response.data;
    } catch (error) {
      throw this.handleError('PUT', url, error);
    }
  }

  private handleError(method: string, url: string, error: unknown): MadreHttpError {
    const err = error as AxiosError;

    if (err.response) {
      return new MadreHttpError(err.response.status, err.response.data, `[MADRE ${method}] ${url}`);
    }

    return new MadreHttpError(500, err.message, `[MADRE ${method}] ${url}`);
  }
}
