export class OncityOrderResponse {
  list: OncityOrder[];
  paging: {
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
  //facets: any[];
  //stats: any;
  //reportRecordsLimit: number;
}

export class OncityOrder {
  orderId: string;
  creationDate: string;
  clientName: string;
  //items?: any[] | null;
  totalValue: number;
  //paymentNames: string;
  //status: string;
  statusDescription: string;
  //marketPlaceOrderId: string;
  //sequence: string;
  //salesChannel: string;
  //affiliateId: string;
  //origin: string;
  // workflowInErrorState: boolean;
  // workflowInRetry: boolean;
  // lastMessageUnread: any;
  // ShippingEstimatedDate: string | null;
  // ShippingEstimatedDateMax: string | null;
  // ShippingEstimatedDateMin: string | null;
  // orderIsComplete: boolean;
  // listId: any;
  // listType: any;
  // authorizedDate: string | null;
  // callCenterOperatorName: string | null;
  totalItems: number;
  // currencyCode: string;
  // hostname: string;
  // invoiceOutput: string[] | null;
  // invoiceInput: any;
  // lastChange: string;
  // isAllDelivered: boolean;
  // isAnyDelivered: boolean;
  // giftCardProviders: any;
  // orderFormId: any;
  // paymentApprovedDate: string | null;
  // readyForHandlingDate: string | null;
  // deliveryDates: any;
  // customFieldsValues: any;
  // customFields: any[];
}

export class OncityOrderDetail {
  // --------- DATOS PRINCIPALES ----------
  orderId: string;
  sequence: string;
  marketplaceOrderId: string;
  status: string;
  statusDescription: string;
  creationDate: string;
  lastChange: string;
  isCompleted: boolean;
  value: number; // total del pedido
  affiliateId: string;
  salesChannel: string;
  origin: string;

  // --------- TOTALES ----------
  totals: {
    id: string;
    name: string;
    value: number;
  }[];

  // --------- VENDEDORES ----------
  // sellers: {
  //   id: string;
  //   name: string;
  //   logo: string;
  //   fulfillmentEndpoint: string;
  // }[];

  // --------- CLIENTE ----------
  //clientProfileData: {
  //   email: string;
  //   firstName: string;
  //   lastName: string;
  //   documentType: string;
  //   document: string;
  //   phone: string;
  // };

  // --------- MÉTODOS DE PAGO ----------
  // paymentData: {
  //   transactions: {
  //     isActive: boolean;
  //     payments: {
  //       paymentSystemName: string;
  //       value: number;
  //       installments: number;
  //     }[];
  //   }[];
  // };

  // --------- FACTURACIÓN ----------
  // invoiceData: {
  //   paymentMethods: string[];
  //   address: {
  //     postalCode: string;
  //     city: string;
  //     state: string;
  //     country: string;
  //     street: string;
  //     number: string;
  //     complement: string | null;
  //     geoCoordinates: number[];
  //   };
  // } | null;

  // --------- ITEMS ----------
  items: {
    id: string;
    productId: string;
    refId: string;
    name: string;
    price: number;
    listPrice: number;
    quantity: number;
    imageUrl: string;
    detailUrl: string;
    categories: {
      id: number;
      name: string;
    }[];
    brandName: string;
  }[];

  // --------- ENVÍO ----------
  shippingData: {
    address: {
      receiverName: string;
      postalCode: string;
      city: string;
      state: string;
      country: string;
      street: string;
      number: string;
      complement: string | null;
      geoCoordinates: number[];
    };
  };
  //
  //     logisticsInfo: {
  //       itemIndex: number;
  //       itemId: string;
  //       selectedSla: string;
  //       price: number;
  //       deliveryCompany: string;
  //       shippingEstimate: string;
  //       shippingEstimateDate: string;
  //       deliveryChannel: string;
  //       pickupStoreInfo?: {
  //         friendlyName: string | null;
  //         address?: {
  //           street: string;
  //           number: string;
  //           city: string;
  //           state: string;
  //           postalCode: string;
  //           geoCoordinates: number[];
  //         } | null;
  //       };
  //     }[];

  //   selectedAddresses: {
  //     addressType: string;
  //     receiverName: string;
  //     postalCode: string;
  //     city: string;
  //     state: string;
  //     country: string;
  //     street: string;
  //     number: string;
  //     complement: string | null;
  //     geoCoordinates: number[];
  //   }[];
  // };

  // --------- CANCELACIÓN ----------
  // cancellationData: {
  //   cancellationDate: string | null;
  //   requestedByUser: boolean;
  //   cancellationRequestId: string | null;
  //   source: string | null;
  // } | null;
}
