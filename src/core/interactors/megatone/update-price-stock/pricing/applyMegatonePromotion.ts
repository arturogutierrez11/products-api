export function applyMegatonePromotion(listPrice: number): {
  precioLista: number;
  precioPromocional: number;
} {
  const precioLista = Math.round(listPrice);

  // 3% OFF
  const precioPromocional = Math.round(precioLista * 0.97);

  return {
    precioLista,
    precioPromocional
  };
}
