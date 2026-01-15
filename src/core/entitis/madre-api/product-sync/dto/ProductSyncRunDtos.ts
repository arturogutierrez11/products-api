export interface StartProductSyncRunDto {
  marketplace: string;
}

export interface StartProductSyncRunResponseDto {
  runId: string;
  status: 'RUNNING';
  startedAt: string;
}

/* ============================
   PROGRESS
============================ */

export interface UpdateProductSyncRunProgressDto {
  runId: string;
  batches?: number;
  items?: number;
  failed?: number;
}

/* ============================
   FINISH
============================ */

export interface FinishProductSyncRunDto {
  runId: string;
  status: 'SUCCESS' | 'PARTIAL';
}

/* ============================
   FAIL
============================ */

export interface FailProductSyncRunDto {
  runId: string;
  errorMessage: string;
}
