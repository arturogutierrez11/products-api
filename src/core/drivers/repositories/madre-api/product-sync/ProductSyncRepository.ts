import { MadreHttpClient } from '../http/MadreHttpClient';

export class ProductSyncRepository {
  constructor(private readonly http: MadreHttpClient) {}

  start(marketplace: string) {
    return this.http.post<{ runId: string }>('/internal/product-sync/runs/start', { marketplace });
  }

  progress(runId: string, data: { batches?: number; items?: number; failed?: number }) {
    return this.http.post('/internal/product-sync/runs/progress', { runId, ...data });
  }

  finish(runId: string, status: 'SUCCESS' | 'PARTIAL') {
    return this.http.post('/internal/product-sync/runs/finish', { runId, status });
  }

  fail(runId: string, errorMessage: string) {
    return this.http.post('/internal/product-sync/runs/fail', { runId, errorMessage });
  }
}
