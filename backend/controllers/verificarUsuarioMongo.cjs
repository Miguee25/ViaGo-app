const conectarDB = require('../config/conexionDB.cjs');
const bcrypt = require('bcrypt');

async function verificarUsuarioMongo(correo, clave) {
  try {
    const db = await conectarDB();
    const usuarios = db.collection('usuarios');

    const correoLimpio = correo.trim().toLowerCase();
    const claveLimpia = clave.trim();

    const usuario = await usuarios.findOne({ correo: correoLimpio });

    if (!usuario || !usuario.contraseña) {
      return { exito: false, mensaje: 'Correo o clave incorrectos' };
    }

    const coincide = await bcrypt.compare(claveLimpia, usuario.contraseña);

    if (!coincide) {
      return { exito: false, mensaje: 'Correo o clave incorrectos' };
    }

    return {
      exito: true,
      mensaje: 'Login exitoso',
      tipo: usuario.tipo,
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        fechaRegistro: usuario.fechaRegistro || null
      }
    };
  } catch (error) {
    console.error('❌ Error en login:', error);
    return {
      exito: false,
      mensaje: 'Error interno del servidor'
    };
  }
}

module.exports = verificarUsuarioMongo;
