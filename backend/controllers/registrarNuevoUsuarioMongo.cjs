const conectarDB = require('../config/conexionDB.cjs');
const bcrypt = require('bcrypt');

async function registrarUsuarioMongo (nombre, correo, clave) {
    const db = await conectarDB();
    const usuarios = db.collection('usuarios');

    const correoLimpio = correo.trim().toLowerCase();
    const existe = await usuarios.findOne ({ correo: correoLimpio });

    if (existe) {
        return { exito: false, mensaje: 'El correo ya esta registrado' };

    }

    const claveEncriptada = await bcrypt.hash(clave, 10);

    const nuevoUsuario = {
        nombre,
        correo: correoLimpio,
        clave: claveEncriptada,
        fechaRegistro: new Date(),
    };



    await usuarios.insertOne(nuevoUsuario);

    return { exito: true, mensaje: 'Usuario registrado exitosamente'};
}

module.exports = registrarUsuarioMongo ;