// import { ProductMadre } from 'src/core/entities/products/madre/ProductMadre';
//
// export class BuildPayload {
//   static build(
//     product: ProductMadre,
//     categoryId: number,
//     brandId: number,
//     prices: { precioLista: number; precioPromocional: number }
//   ) {
//     const imagenes = product.images
//       .filter(img => !!img?.url)
//       .slice(0, 6)
//       .map((img, index) => ({
//         Posicion: index + 1,
//         UrlImagen: img.url
//       }));
//
//     return {
//       IdSeller: 389,
//       SkuSeller: product.sku,
//
//       Titulo: product.title.slice(0, 100),
//
//       DescripcionAmpliada: product.description,
//       Categoria: categoryId,
//       Marca: brandId,
//
//       PrecioLista: prices.precioLista,
//       PrecioPromocional: prices.precioPromocional,
//
//       Stock: product.stock ?? 1,
//       TipoEntrega: 1,
//       EnvioGratis: true,
//       EnvioPropio: false,
//
//       EnvioGratisZona: {
//         Amba: true,
//         Interior: true,
//         Patagonia: true,
//         EnvioGratis: true
//       },
//
//       Dimensiones: [
//         {
//           Alto: 10,
//           Ancho: 10,
//           Profundidad: 10,
//           Peso: 1
//         }
//       ],
//
//       Imagenes: imagenes,
//
//       IdTipoPublicacion: 99,
//       IdMoneda: 1,
//       AlicuotaIva: 21,
//       AlicuotaImpuestoInterno: 0,
//       GarantiaExtActiva: false,
//       GarantiaFabrica: 0
//     };
//   }
// }
