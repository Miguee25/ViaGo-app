const express = require('express');
const path = require('path');
const sparkViaje = require('../controllers/ejercicio5.cjs');
const calcularPrecio = require('../controllers/calcularPrecio.cjs');
const historial = require(path.join(__dirname, '../data/historial.cjs'));
const registrarUsuarioMongo = require('../controllers/registrarNuevoUsuarioMongo.cjs');
const verificarUsuarioMongo = require('../controllers/verificarUsuarioMongo.cjs');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

app.post('/evaluar', (req, res) => {
    const { tipoServicio, maletas, horaViaje, cantidadPasajeros } = req.body;
    const resultado = sparkViaje(tipoServicio, maletas, horaViaje, cantidadPasajeros);
    historial.guardarViaje({ tipoServicio, maletas, horaViaje, cantidadPasajeros, resultado, fecha: new Date().toLocaleString() });
    res.json({ resultado });
});

app.post('/api/calcular-precio', async (req, res) => {
  try {
    const { pais, distanciaKm, tipoServicio } = req.body; // ✅ Agregado tipoServicio
    const resultado = await calcularPrecio(pais, distanciaKm, tipoServicio);
    res.json(resultado);
  } catch (error) {
    console.error('❌ Error al calcular precio:', error.message);
    res.status(500).json({ error: 'No se pudo calcular el precio.' });
  }
});



app.post('/registro', async (req, res) => {
    const { nombre, correo, clave } = req.body;
    const resultado = await registrarUsuarioMongo(nombre, correo, clave);
    res.json(resultado);
});

app.post('/login', async (req, res) => {
    const { correo, clave } = req.body;
    const resultado = await verificarUsuarioMongo(correo, clave);
    res.json(resultado);
});

app.get('/historial', (req, res) => {
    const viajes = historial.obtenerHistorial();
    res.json(viajes);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/bienvenida.html'));
});

app.get('/mapa', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/pages/mapa.html'));
});

app.listen(3000, () => {
    console.log('servidor escuchando en http://localhost:3000');
});
