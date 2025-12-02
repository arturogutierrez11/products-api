import { OncityOrderDetail } from 'src/core/entities/oncity/orders/OncityOrders';

export function mapVtexOrderDetail(data: any): OncityOrderDetail {
  return {
    // DATOS PRINCIPALES
    orderId: data.orderId,
    sequence: data.sequence,
    marketplaceOrderId: data.marketplaceOrderId ?? data.marketPlaceOrderId,
    status: data.status,
    statusDescription: data.statusDescription,
    creationDate: data.creationDate,
    lastChange: data.lastChange,
    isCompleted: data.isCompleted,
    value: data.value,
    affiliateId: data.affiliateId,
    salesChannel: data.salesChannel,
    origin: data.origin,

    // TOTALES
    totals:
      data.totals?.map((t: any) => ({
        id: t.id,
        name: t.name,
        value: t.value,
      })) ?? [],

    // ITEMS
    items:
      data.items?.map((i: any) => ({
        id: i.id,
        productId: i.productId,
        refId: i.refId,
        name: i.name,
        price: i.sellingPrice ?? i.price,
        listPrice: i.listPrice,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
        detailUrl: i.detailUrl,
        categories: i.additionalInfo?.categories ?? [],
        brandName: i.additionalInfo?.brandName ?? null,
      })) ?? [],

    // ENVÍO
    shippingData: data.shippingData
      ? {
          address: {
            receiverName: data.shippingData.address?.receiverName,
            postalCode: data.shippingData.address?.postalCode,
            city: data.shippingData.address?.city,
            state: data.shippingData.address?.state,
            country: data.shippingData.address?.country,
            street: data.shippingData.address?.street,
            number: data.shippingData.address?.number,
            complement: data.shippingData.address?.complement ?? null,
            geoCoordinates: data.shippingData.address?.geoCoordinates ?? [],
          },
        }
      : {
          address: {
            receiverName: '',
            postalCode: '',
            city: '',
            state: '',
            country: '',
            street: '',
            number: '',
            complement: null,
            geoCoordinates: [],
          },
        },
  };
}
