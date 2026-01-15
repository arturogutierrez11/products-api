import { ProductSyncStatus } from 'src/core/entitis/madre-api/product-sync/ProductSyncStatus';

export function mapMegatoneStatus(status?: string): ProductSyncStatus {
  if (!status) return 'ERROR';

  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case 'activo':
      return 'ACTIVE';

    case 'en_revision':
    case 'en revisión':
      return 'PENDING';

    case 'pausado':
      return 'PAUSED';

    case 'deleted':
      return 'DELETED';

    case 'pendiente_activacion':
    case 'pendiente activacion':
      return 'DELETED';

    default:
      return 'ERROR';
  }
}
