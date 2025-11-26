// const zones = [
//   {
//     from: 1000,
//     to: 1499,
//     list: undefined,
//     exceptions: [],
//     hour: '17:00:00',
//   },
//   {
//     from: 1500,
//     to: 1900,
//     list: undefined,
//     exceptions: [1727, 1746, 1748, 1814, 1862, 1864, 1865],
//     hour: '12:00:00',
//   },
//   {
//     from: undefined,
//     to: undefined,
//     list: [
//       1727, 1746, 1748, 1814, 1862, 1864, 1865, 1900, 1923, 1925, 2800, 2804,
//       6700,
//     ],
//     exceptions: [],
//     hour: '12:00:00',
//   },
// ];
// export function buildCacheManager<T>(
//   key: string,
//   data: T | T[],
//   compoundName = false,
// ): Record<string, T> | Record<string, T>[] {
//   const makeKey = (value: T) =>
//     compoundName ? `${key}_${String(value)}` : key;
//
//   // Caso especial: key específica
//   if (key === 'sameDay_zones') {
//     // @ts-expect-error: zonas no es del tipo T, pero se fuerza para compatibilidad
//     return [{ [key]: zones }];
//   }
//
//   if (key === 'holidays' || key === 'postalCode') {
//     // @ts-expect-error: zonas no es del tipo T, pero se fuerza para compatibilidad
//     return [{ [key]: data }];
//   }
//
//   if (key === 'presale') return presale(data, makeKey);
//
//   if (key === 'price_same_day') return costSameDay(data, makeKey);
//
//   if (Array.isArray(data)) {
//     return data.map((value) => ({
//       [makeKey(value)]: value,
//     }));
//   }
//
//   return {
//     [makeKey(data)]: data,
//   };
// }
//
// const presale = (data, makeKey) => {
//   return data.map((value) => ({
//     [makeKey(value.sku)]: value.manufacturing,
//   }));
// };
//
// const costSameDay = (data, makeKey) => {
//   return data.map((value) => ({
//     [makeKey(value.cp)]: value.price,
//   }));
// };
//
// export const mockHolidays = (): string[] => {
//   const now = new Date();
//   return ['2025-12-25', '2025-01-12', now.toISOString().split('T')[0]];
// };
