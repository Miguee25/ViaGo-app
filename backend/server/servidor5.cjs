const express = require('express');
const path = require('path');
const sparkViaje = require('../controllers/ejercicio5.cjs');
const calcularPrecio = require('../controllers/calcularPrecio.cjs');
const historial = require(path.join(__dirname, '../data/historial.cjs'));
const registrarUsuarioMongo = require('../controllers/registrarNuevoUsuarioMongo.cjs');
const verificarUsuarioMongo = require('../controllers/verificarUsuarioMongo.cjs');

// 🧠 Nuevo: servidor HTTP y socket.io
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app); // ⬅️ Servidor HTTP
const io = socketio(server);           // ⬅️ WebSockets conectados

// 🛡️ Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// 🧪 Rutas funcionales
app.post('/evaluar', (req, res) => {
  const { tipoServicio, maletas, horaViaje, cantidadPasajeros } = req.body;
  const resultado = sparkViaje(tipoServicio, maletas, horaViaje, cantidadPasajeros);

  historial.guardarViaje({
    tipoServicio,
    maletas,
    horaViaje,
    cantidadPasajeros,
    resultado,
    fecha: new Date().toLocaleString()
  });

  res.json({ resultado });
});

app.post('/api/calcular-precio', async (req, res) => {
  try {
    const { pais, distanciaKm, tipoServicio } = req.body;
    const resultado = await calcularPrecio(pais, distanciaKm, tipoServicio);
    res.json(resultado);
  } catch (error) {
    console.error('❌ Error al calcular precio:', error.message);
    res.status(500).json({ error: 'No se pudo calcular el precio.' });
  }
});

// ✅ Registro de usuario (MongoDB)
app.post('/registro', registrarUsuarioMongo);

// ✅ Login de usuario (MongoDB)
app.post('/login', async (req, res) => {
  try {
    const { correo, clave } = req.body;
    const resultado = await verificarUsuarioMongo(correo, clave);
    res.json(resultado);
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor' });
  }
});

// ✅ Obtener historial
app.get('/historial', (req, res) => {
  const viajes = historial.obtenerHistorial();
  res.json(viajes);
});

// 🌐 Rutas para servir páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/pages/bienvenida.html'));
});

app.get('/mapa', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/pages/mapa.html'));
});

// 🎯 WebSocket - conexión en tiempo real
io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado al socket');

  socket.on('solicitud-viaje', (data) => {
    console.log('📨 Solicitud recibida del pasajero:', data);
    io.emit('solicitud-viaje', data); // ⬅️ reenviamos a todos los conductores
  });
});

// 🚀 Servidor en marcha
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
