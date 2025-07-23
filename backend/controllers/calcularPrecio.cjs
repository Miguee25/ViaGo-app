const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const tarifasPorPais = {
  'Colombia': { moneda: 'COP', precioPorKm: 2000 },
  'Spain': { moneda: 'EUR', precioPorKm: 1.2 },
  'United States': { moneda: 'USD', precioPorKm: 1.5 },
  'Peru': { moneda: 'PEN', precioPorKm: 2.5 },
  'Venezuela': { moneda: 'VES', precioPorKm: 59.22 },
};

// === Función para obtener tasa general desde open.er-api.com ===
async function obtenerTasaGeneral(monedaLocal) {
  try {
    const url = `https://open.er-api.com/v6/latest/USD`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.rates || !data.rates[monedaLocal]) {
      throw new Error(`Tasa no encontrada para ${monedaLocal}`);
    }

    return data.rates[monedaLocal];
  } catch (error) {
    console.error('[open.er-api.com] Error al obtener tasa:', error.message);
    return null;
  }
}

// === Función principal ===
async function calcularPrecio(pais, distanciaKm) {
  const tarifa = tarifasPorPais[pais];
  if (!tarifa) {
    throw new Error(`País no soportado: ${pais}`);
  }

  const tasaCambio = await obtenerTasaGeneral(tarifa.moneda);
  const fuente = 'open.er-api.com';

  if (!tasaCambio) {
    throw new Error(`No se pudo obtener la tasa de cambio para ${tarifa.moneda}`);
  }

  const precioLocal = tarifa.precioPorKm * distanciaKm;
  const precioUSD = precioLocal / tasaCambio;

  return {
    distancia: `${distanciaKm.toFixed(2)} km`,
    pais,
    moneda: tarifa.moneda,
    precioLocal: `${precioLocal.toFixed(2)} ${tarifa.moneda}`,
    precioUSD: `${precioUSD.toFixed(2)} USD`,
    tasaCambio: `1 USD = ${tasaCambio.toFixed(2)} ${tarifa.moneda}`,
    fuenteTasa: fuente
  };
}

// === Bloque de prueba local ===
if (require.main === module) {
  (async () => {
    try {
      const resultado = await calcularPrecio('Venezuela', 10);
      console.log(resultado);
    } catch (e) {
      console.error('Error al calcular:', e.message);
    }
  })();
}

module.exports = calcularPrecio;
