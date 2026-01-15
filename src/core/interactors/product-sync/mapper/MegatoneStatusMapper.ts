import { ProductSyncStatus } from 'src/core/entitis/madre-api/product-sync/ProductSyncStatus';

export function mapMegatoneStatus(status?: string): ProductSyncStatus {
  if (!status) return 'ERROR';

  const normalized = normalizeStatus(status);

  switch (normalized) {
    case 'activo':
      return 'ACTIVE';

    case 'en_revision':
      return 'PENDING';

    case 'pausado':
      return 'PAUSED';

    case 'pendiente_activacion':
    case 'deleted':
      return 'DELETED';

    default:
      return 'ERROR';
  }
}

function normalizeStatus(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .replace(/[\s-]+/g, '_'); // espacios y guiones → _
}
