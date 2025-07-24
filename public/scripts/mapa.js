mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWktMjUiLCJhIjoiY21kNjloMml6MDcyazJtb2xjNWNlcjJqYyJ9.IwxuSLB-7rc-c4jHaYKITg';

let map;
let puntoA = null;
let puntoBs = [];
let marcadorA = null;
let marcadoresB = [];
let rutaSourceId = 'ruta';

// ✅ Función segura para setear texto si el elemento existe
function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

// ✅ Función segura para mostrar bloques si existen
function safeShow(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

// ✅ Función segura para ocultar bloques si existen
function safeHide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

navigator.geolocation.getCurrentPosition(
  async function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [lng, lat],
      zoom: 15
    });

    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setText('Estás aquí 📍'))
      .addTo(map);

    map.on('click', async (e) => {
      const lngLat = [e.lngLat.lng, e.lngLat.lat];

      if (!puntoA) {
        puntoA = lngLat;

        if (marcadorA) marcadorA.remove();

        marcadorA = new mapboxgl.Marker({ color: 'green', draggable: true })
          .setLngLat(puntoA)
          .addTo(map);

        marcadorA.on('dragend', () => {
          const nuevaPos = marcadorA.getLngLat();
          puntoA = [nuevaPos.lng, nuevaPos.lat];
          actualizarRuta();
          obtenerDireccion(nuevaPos.lng, nuevaPos.lat).then(dir => {
            document.getElementById('origen').value = dir;
          });
        });

        const direccionA = await obtenerDireccion(lngLat[0], lngLat[1]);
        document.getElementById('origen').value = direccionA;

      } else {
        puntoBs.push(lngLat);

        const marcadorB = new mapboxgl.Marker({ color: 'red', draggable: true })
          .setLngLat(lngLat)
          .addTo(map);

        marcadoresB.push(marcadorB);

        marcadorB.on('dragend', () => {
          const nuevaPos = marcadorB.getLngLat();
          const index = marcadoresB.indexOf(marcadorB);
          if (index !== -1) {
            puntoBs[index] = [nuevaPos.lng, nuevaPos.lat];
            actualizarRuta();
          }
        });

        marcadorB.getElement().addEventListener('dblclick', () => {
          const index = marcadoresB.indexOf(marcadorB);
          if (index !== -1) {
            marcadorB.remove();
            marcadoresB.splice(index, 1);
            puntoBs.splice(index, 1);
            actualizarRuta();
          }
        });

        const direccionB = await obtenerDireccion(lngLat[0], lngLat[1]);
        document.getElementById('destino').value = direccionB;

        actualizarRuta();
      }
    });

  },
  function (error) {
    alert('No se pudo obtener tu ubicación. ¿Tienes el GPS activo y aceptaste permisos?');
    console.error(error);
  }
);

async function actualizarRuta() {
  if (!puntoA || puntoBs.length === 0) {
    if (map.getLayer(rutaSourceId)) map.removeLayer(rutaSourceId);
    if (map.getSource(rutaSourceId)) map.removeSource(rutaSourceId);
    safeHide("viajeInfo");
    safeHide("btnSolicitar");
    return;
  }

  const coordenadas = [puntoA, ...puntoBs].map(p => `${p[0]},${p[1]}`).join(';');
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordenadas}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const route = data.routes[0].geometry.coordinates;
    const distanciaKm = data.routes[0].distance / 1000;

    const duracionSegundos = data.routes[0].duration;
    const minutos = Math.floor(duracionSegundos / 60);
    const segundos = Math.floor(duracionSegundos % 60);
    const duracionTexto = `${minutos} min ${segundos} s`;

const pais = await obtenerPaisDesdeCoords(puntoA[1], puntoA[0]);

let distanciaTexto = '';
if (pais.toLowerCase().includes('united states') || pais.toLowerCase().includes('estados unidos')) {
  const millas = distanciaKm * 0.621371;
  distanciaTexto = `${millas.toFixed(2)} miles`;
} else {
  distanciaTexto = `${distanciaKm.toFixed(2)} km`;
}

const tipoServicio = document.getElementById("servicio")?.value || 'basico';

const resPrecio = await fetch('/api/calcular-precio', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pais, distanciaKm, tipoServicio }) // ✅ agregado
});



const datos = await resPrecio.json();
console.log("💡 Respuesta del backend:", datos);

// Mostrar en pantalla
safeSetText("pais", `🌎 País: ${datos.pais}`);
safeSetText("distancia", `📏 Distancia: ${distanciaTexto}`);
safeSetText("distanciaInfo", `📏 Distancia: ${distanciaTexto}`);
safeSetText("moneda", `💰 Moneda: ${datos.moneda}`);
safeSetText("precioLocal", `🏷 Precio local: ${datos.precioLocal}`);
safeSetText("precioUSD", `💵 Precio en USD: ${datos.precioUSD}`);
safeSetText("tasa", `🔁 Tasa de cambio: ${datos.tasaCambio}`);
safeSetText("duracion", `⏱ Duración: ${duracionTexto}`);
safeSetText("tipoServicioInfo", `🚘 Tipo de servicio: ${tipoServicio.charAt(0).toUpperCase() + tipoServicio.slice(1)}`);

if (datos.recargoConfortValor > 0) {
  safeSetText("recargo", `➕ Recargo Confort: ${datos.recargoConfortTexto}`);
} else {
  safeSetText("recargo", ""); // limpia si no aplica recargo
}




    safeShow("viajeInfo");
    safeShow("btnSolicitar");

    const ruta = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };

    if (map.getSource(rutaSourceId)) {
      map.getSource(rutaSourceId).setData(ruta);
    } else {
      map.addSource(rutaSourceId, {
        type: 'geojson',
        data: ruta
      });

      map.addLayer({
        id: rutaSourceId,
        type: 'line',
        source: rutaSourceId,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#00ff99', 'line-width': 4 }
      });
    }
  } catch (err) {
    console.error("❌ Error obteniendo ruta o precio:", err);
  }
}

window.eliminarUltimoDestino = function () {
  if (marcadoresB.length > 0) {
    const ultimoMarcador = marcadoresB.pop();
    ultimoMarcador.remove();
    puntoBs.pop();
    document.getElementById('destino').value = "";
    actualizarRuta();
    safeSetText("distancia", "");
  }
};

window.reiniciarMapa = function () {
  if (marcadorA) marcadorA.remove();
  marcadorA = null;
  puntoA = null;

  marcadoresB.forEach(m => m.remove());
  marcadoresB = [];
  puntoBs = [];

  if (map.getLayer(rutaSourceId)) map.removeLayer(rutaSourceId);
  if (map.getSource(rutaSourceId)) map.removeSource(rutaSourceId);

  document.getElementById('origen').value = "";
  document.getElementById('destino').value = "";
};

async function obtenerDireccion(lng, lat) {
  try {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
    const data = await response.json();
    return data.features?.[0]?.place_name || "Dirección no encontrada";
  } catch (error) {
    console.error("Error obteniendo dirección:", error);
    return "Error al obtener dirección";
  }
}

async function obtenerPaisDesdeCoords(lat, lng) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=country&access_token=${mapboxgl.accessToken}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.features?.[0]?.text || null;
}

async function buscarDireccionYColocar(direccion, tipo) {
  try {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(direccion)}.json?access_token=${mapboxgl.accessToken}`);
    const data = await response.json();

    if (data.features?.length) {
      const [lng, lat] = data.features[0].center;

      if (tipo === 'origen') {
        puntoA = [lng, lat];
        if (marcadorA) marcadorA.remove();
        marcadorA = new mapboxgl.Marker({ color: 'green', draggable: true }).setLngLat(puntoA).addTo(map);
        marcadorA.on('dragend', () => {
          const nuevaPos = marcadorA.getLngLat();
          puntoA = [nuevaPos.lng, nuevaPos.lat];
          actualizarRuta();
        });
        map.flyTo({ center: puntoA, zoom: 15 });

      } else if (tipo === 'destino') {
        const nuevaCoord = [lng, lat];
        puntoBs.push(nuevaCoord);
        const marcadorB = new mapboxgl.Marker({ color: 'red', draggable: true }).setLngLat(nuevaCoord).addTo(map);
        marcadoresB.push(marcadorB);
        marcadorB.on('dragend', () => {
          const nuevaPos = marcadorB.getLngLat();
          const index = marcadoresB.indexOf(marcadorB);
          if (index !== -1) {
            puntoBs[index] = [nuevaPos.lng, nuevaPos.lat];
            actualizarRuta();
          }
        });
        marcadorB.getElement().addEventListener('dblclick', () => {
          const index = marcadoresB.indexOf(marcadorB);
          if (index !== -1) {
            marcadorB.remove();
            marcadoresB.splice(index, 1);
            puntoBs.splice(index, 1);
            actualizarRuta();
          }
        });
        map.flyTo({ center: nuevaCoord, zoom: 15 });
      }

      actualizarRuta();
    } else {
      alert("Dirección no encontrada");
    }
  } catch (error) {
    console.error("Error al buscar dirección:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('origen')?.addEventListener('change', (e) => {
    const dir = e.target.value.trim();
    if (dir) buscarDireccionYColocar(dir, 'origen');
  });

  document.getElementById('destino')?.addEventListener('change', (e) => {
    const dir = e.target.value.trim();
    if (dir) buscarDireccionYColocar(dir, 'destino');
  });

  document.getElementById('servicio')?.addEventListener('change', () => {
  actualizarRuta(); // 👈 vuelve a recalcular todo si cambias el tipo de servicio
});
});
