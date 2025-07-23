const fs = require('fs');
const path = require('path');

function verificarUsuario(correo, clave) {
    const ruta = path.join(__dirname, '../data/usuarios.json');
    const data = fs.readFileSync(ruta, 'utf-8');
    const usuarios = JSON.parse(data);

    const usuarioEncontrado = usuarios.find(usuario => 
        usuario.correo.trim().toLowerCase() === correo.trim().toLowerCase() &&
        usuario.clave === clave
    );

    if (usuarioEncontrado) {
        return { exito: true, mensaje: 'Login exitoso' };
    } else {
        return { exito: false, mensaje: 'Correo o clave incorrectos' };
    }
}

module.exports = verificarUsuario;