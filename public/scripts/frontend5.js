document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formularioViaje');
  const divResultado = document.getElementById('resultado');

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("📤 Enviando datos al servidor...");


    const tipoServicio = document.getElementById('tipoServicio').value;
    const maletas = document.getElementById('maletas').value;
    const horaViaje = parseInt(document.getElementById('hora').value);
    const cantidadPasajeros = parseInt(document.getElementById('cantidadPasajeros').value);

    try {
      const respuesta = await fetch('/evaluar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipoServicio,
          maletas,
          horaViaje,
          cantidadPasajeros,
        }),
      });

      const data = await respuesta.json();
      divResultado.textContent = data.resultado;
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      divResultado.textContent = 'Hubo un problema al calcular el viaje.';
    }
  });
});
