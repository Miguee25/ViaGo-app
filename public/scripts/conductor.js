// ✅ Conecta el conductor al servidor con Socket.io
const socket = io();
console.log('✅ Conductor conectado al socket');

// 🎧 Configuración del AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer = null;
let sourceNode = null;

// 🔄 Precarga del sonido al cargar la página
fetch('/sonidos/new-notification-022-370046.mp3')
  .then(res => res.arrayBuffer())
  .then(data => audioContext.decodeAudioData(data))
  .then(decoded => {
    audioBuffer = decoded;
    console.log("🔊 Sonido precargado con AudioContext");
  })
  .catch(err => console.error("❌ Error cargando el sonido:", err));

// 🔓 Desbloquear sonido al hacer clic por primera vez
document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log("🔓 AudioContext desbloqueado por clic");
    });
  }
}, { once: true });

// ▶️ Reproduce el sonido en bucle (REEMPLAZADO Y MEJORADO)
function reproducirSonidoEnLoop() {
  if (!audioBuffer) return;

  // 🧹 Limpia cualquier nodo anterior
  if (sourceNode) {
    try {
      sourceNode.stop();
      sourceNode.disconnect();
    } catch (e) {
      console.warn("⚠️ Error al detener nodo anterior:", e);
    }
    sourceNode = null;
  }

  // 🆕 Crea un nuevo nodo cada vez
  sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.loop = true;
  sourceNode.connect(audioContext.destination);
  sourceNode.start(0);

  console.log("🔊 Sonido en bucle iniciado");
}

// ⏹️ Detiene el sonido
function detenerSonido() {
  if (sourceNode) {
    sourceNode.stop();
    sourceNode.disconnect();
    sourceNode = null;
    console.log("🔇 Sonido detenido");
  }
}

// ✅ Función que cambia el estado del conductor
function cambiarEstadoConductor() {
  const btn = document.getElementById("estado-btn");

  btn.innerText = "🔴 Desconectarme";
  btn.style.backgroundColor = "#d32f2f";
  console.log("✅ Estado del conductor: conectado");
}

// 🚖 Escuchar solicitudes de viaje desde el pasajero
socket.on('solicitud-viaje', (data) => {
  console.log('🚖 Nueva solicitud de viaje recibida:', data);

  const tarjeta = document.getElementById("solicitudRecibida");
  const infoDiv = document.getElementById("infoViajeConductor");

  infoDiv.innerHTML = `
    <p><strong>🕒 Duración:</strong> ${data.duracionTexto}</p>
    <p><strong>📏 Distancia:</strong> ${data.distanciaKm.toFixed(2)} km</p>
    <p><strong>💰 Precio:</strong> ${data.precioLocal} ${data.moneda}</p>
    <p><strong>🚘 Servicio:</strong> ${data.tipoServicio}</p>
    <p><strong>➕ Recargo:</strong> ${data.recargoTexto || 'Ninguno'}</p>
    <p><strong>🌎 País:</strong> ${data.pais}</p>
  `;

  tarjeta.style.display = "block";
  reproducirSonidoEnLoop();

  // ⏳ Temporizador de 10 segundos
  let tiempo = 10;
  const temp = document.getElementById("temporizador");
  temp.innerText = `⏳ Tiempo para aceptar: ${tiempo}s`;

  const cuentaRegresiva = setInterval(() => {
    tiempo--;
    temp.innerText = `⏳ Tiempo para aceptar: ${tiempo}s`;

    if (tiempo <= 0) {
      clearInterval(cuentaRegresiva);
      tarjeta.style.display = "none";
      detenerSonido();
      alert("⛔ Tiempo agotado. No se aceptó el viaje.");
    }
  }, 1000);

  window._cuentaRegresiva = cuentaRegresiva;
  window._datosViajeRecibido = data;
});

// ✅ Función para aceptar el viaje
function aceptarViaje() {
  clearInterval(window._cuentaRegresiva);
  document.getElementById("solicitudRecibida").style.display = "none";
  alert("✅ Viaje aceptado. Puedes iniciar la ruta.");
  detenerSonido();

  // socket.emit("viaje-aceptado", window._datosViajeRecibido);
}
