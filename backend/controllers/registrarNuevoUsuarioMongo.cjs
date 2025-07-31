const conectarDB = require('../config/conexionDB.cjs');
const bcrypt = require('bcrypt');

async function registrarNuevoUsuario(req, res) {
  try {
    const db = await conectarDB();
    const { nombre, correo, contraseña, tipo } = req.body;

    const existente = await db.collection('usuarios').findOne({ correo });

    if (existente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El usuario ya existe'
      });
    }

    const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = {
      nombre,
      correo,
      contraseña: contraseñaEncriptada,
      tipo
    };

    await db.collection('usuarios').insertOne(nuevoUsuario);

    res.status(200).json({
      exito: true,
      mensaje: 'Registro exitoso'
    });

  } catch (error) {
    console.error('❌ Error registrando usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
}

module.exports = registrarNuevoUsuario;
