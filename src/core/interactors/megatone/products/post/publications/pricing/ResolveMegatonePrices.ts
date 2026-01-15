export class ResolveMegatonePrices {
  resolve(precioLista: number): {
    precioLista: number;
    precioPromocional: number;
  } {
    if (!precioLista || precioLista <= 0) {
      throw new Error('Precio lista inválido');
    }

    const descuento = precioLista * 0.135;
    const recargo = precioLista * 0.12;

    let precioPromocional = Math.round(precioLista - descuento + recargo);

    if (precioPromocional >= precioLista) {
      precioPromocional = precioLista - 1;
    }

    return {
      precioLista,
      precioPromocional
    };
  }
}
