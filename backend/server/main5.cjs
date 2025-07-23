const readline = require ('readline');
const sparkViaje = require ('./ejercicio5.cjs');
const { stdin, stdout } = require('process');

const rl = readline.createInterface ({
    input : process.stdin,
    output : process.stdout
})

function preguntarTipoDeServicio (){
    rl.question ("¿Que tipo de servicio deseas (carro basico/ carro confort)?", input =>{
        const tipoServicio = input.trim().toLowerCase();
        if (tipoServicio !== 'carro basico' && tipoServicio !== 'carro comfort') {
            console.log("Tipo de servicio invalido. Usa (carro basico/ carro confort).");
            return preguntarTipoDeServicio();
        }
        preguntarMaletas (tipoServicio);
     });
}

function preguntarMaletas(tipoServicio){
    rl.question("¿Llevas maletas (si/no)", inputMaletas => {
        const maletas = inputMaletas.trim().toLowerCase();

        if (maletas !== 'si' && maletas !== 'no'){
            console.log("por favor ingresa una respuesta valida (si/no).");
            preguntarMaletas (tipoServicio);
        }

        preguntarHora(tipoServicio, maletas);
    });
}

function preguntarHora (tipoServicio, maletas) {
    rl.question("¿A que horas vas a viajar? (solo numeros 0/23): ", inputHora => {
        const horaViaje = parseFloat (inputHora.trim());

        if(isNaN(horaViaje) || !Number.isInteger (horaViaje) || horaViaje <0 || horaViaje >23) {
            console.log("por favor ingresa una hora valida (entre 0 / 23).");
            return preguntarHora(tipoServicio, maletas);
        }

        preguntarCantidadPasajeros (tipoServicio, maletas, horaViaje);
    });
    
}

function preguntarCantidadPasajeros (tipoServicio, maletas, horaViaje){
    rl.question ("¿Cuantos pasajeros van a viajar? (Cantidadd maxima permitida (1/4): ", inputPasajeros => {
        const cantidadPasajeros = parseFloat (inputPasajeros.trim());

        if(isNaN(cantidadPasajeros) || !Number.isInteger(cantidadPasajeros) || cantidadPasajeros <1 || cantidadPasajeros >4){
            console.log("Por favor ingresa una cantidad de pasajeros valida (entre 1/4).");
            return preguntarCantidadPasajeros (tipoServicio, maletas, horaViaje); 
        }

        const resultado = sparkViaje (tipoServicio, maletas, horaViaje, cantidadPasajeros);
        console.log("resultado:", resultado);

        rl.close();

    });
}

preguntarTipoDeServicio();

