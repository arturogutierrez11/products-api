export interface IProductSyncRepository {
  start(marketplace: string);
  progress(runId: string, data: { batches?: number; items?: number; failed?: number });
  finish(runId: string, status: 'SUCCESS' | 'PARTIAL');
  fail(runId: string, errorMessage: string);
}
