const fs = require('fs');
const path = require('path');

const rutaHistorial = path.join(__dirname, 'historial.json');

function obtenerHistorial() {
    try {
        const datos = fs.readFileSync (rutaHistorial, 'utf8');
        return JSON.parse(datos);

    } catch (error) {
        console.error ('Error leyendo historial:', error);
        return [];
        
        
    }
}

function guardarViaje(viaje) {
    const historial = obtenerHistorial();
    historial.push(viaje);
    try {
        fs.writeFileSync (rutaHistorial, JSON.stringify(historial, null, 2))
    } catch (error) {
        console.error('Error guardando viaje en el historial:', error);
    }

}

module.exports = {
    guardarViaje,
    obtenerHistorial

}