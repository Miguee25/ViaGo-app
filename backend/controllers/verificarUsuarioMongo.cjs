const conectarDB = require('../config/conexionDB.cjs');
const bcrypt = require('bcrypt');

async function verificarUsuarioMongo(correo, clave) {
    const db = await conectarDB();
    const usuarios = db.collection('usuarios');

    const correoLimpio = correo.trim().toLowerCase();

    const usuario = await usuarios.findOne( { correo: correoLimpio });

    if(!usuario) {
        return { exito: false, mensaje: 'Correo o clave incorrectos' };
    }

    const coincide = await bcrypt.compare(clave, usuario.clave);

    if (!coincide) {
        return { exito: false, mensaje: 'Correo o clave incorrectos' };
    }

    return {
        exito: true, 
        mensaje:'login exitoso',
        usuario: {
            nombre: usuario.nombre,
            correo: usuario.correo,
            fechaRegistro: usuario.fechaRegistro
        }



    };

}

module.exports = verificarUsuarioMongo ; 