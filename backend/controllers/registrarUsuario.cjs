const fs = require ('fs');
const path = require ('path');

function registrarUsuario (nombre, correo, clave) {

    const ruta = path.join (__dirname, '../data/usuarios.json');

    const data = fs.readFileSync(ruta, 'utf-8');

    const usuarios = JSON.parse(data);

    const yaExiste = usuarios.find(usuario => usuario.correo === correo);

    if(yaExiste){
        return { exito: false, mensaje: 'Ese correo ya está registrado.'};

    }

    const nuevoUsuario = {
        nombre: nombre,
        correo: correo,
        clave: clave
    };

    usuarios.push(nuevoUsuario);

    fs.writeFileSync(ruta, JSON.stringify(usuarios, null,2));

    return { exito: true, mensaje: 'Registro exitoso'};
}

module.exports = registrarUsuario;
