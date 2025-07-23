function sparkViaje (tipoServicio, maletas, horaViaje, cantidadPasajeros){
    if (cantidadPasajeros >4 || cantidadPasajeros <1){
        return "Ingresa un valor valido entre (1/4)."
    }

    let recargoMaletas = 0

    const maletasNormalizado = maletas.trim().toLowerCase();
    if (maletasNormalizado === 'si' || maletasNormalizado === 'si'){
        recargoMaletas = 5000;
        console.log("Recargo por maletas: ", recargoMaletas.toLocaleString('es-CO', { style: "currency", currency: 'COP' }));
    } else if (maletasNormalizado !== 'no') {
        return "Opción de maletas inválida. usa 'si' o 'no'.";
    }

    let tarifaServicio = 0;

    const tipoServicioNormalizado = tipoServicio
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

    switch (tipoServicioNormalizado){
        case "carro basico":
            tarifaServicio = 1500
            console.log("Recargo por carro basico:", tarifaServicio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }));
            break;

            case "carro comfort":
                tarifaServicio = 3000
                console.log("Recargo por carro confort:", tarifaServicio.toLocaleString('es-CO', { style: 'currency', currency: 'COP'}));
                break;

                default:
                    return "tipo de servicio no valido, usa 'Carro Básico' o 'Carro comfort'";
        
    } 
    recargoHoraviaje = 0
    if (horaViaje > 20){
        recargoHoraviaje = 1500
        console.log("Tines un recargo por hora nocturna:", recargoHoraviaje.toLocaleString('es-CO', { style: 'currency', currency: 'COP'}));
    }

    let totalviaje = tarifaServicio + recargoMaletas + recargoHoraviaje
    return `El total de tu viaje es: ${totalviaje.toLocaleString('es-CO', { style: 'currency', currency: 'COP'})}`;
}

module.exports = sparkViaje;