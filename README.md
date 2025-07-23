# 🚗 ViaGo - Plataforma de Solicitud de Viajes

Este es un proyecto web que simula una aplicación tipo Uber. Permite a los usuarios registrarse, iniciar sesión y solicitar un viaje desde un punto A hasta un punto B con múltiples destinos.

---

### 🌍 Características principales:

- Registro e inicio de sesión de usuarios con conexión a **MongoDB**
- **Cifrado de contraseñas con bcrypt** para proteger los datos del usuario
- Mapa interactivo con ubicación en tiempo real (API de **Mapbox**)
- Cálculo automático de ruta, distancia y duración del viaje
- Conversión de moneda automática según el país donde se abra la app (Colombia, USA, Perú, etc.)
- Precio dinámico basado en el tipo de servicio: **Básico** o **Confort**
- Resumen del viaje: país, distancia (en millas y km), duración, moneda local, precio en USD, tasa de cambio
- Botones para eliminar el último destino, reiniciar el mapa o solicitar el viaje

---

### 💻 Tecnologías utilizadas:

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Base de datos:** MongoDB
- **Autenticación y seguridad:** `bcrypt` para encriptar contraseñas
- **APIs externas:** Mapbox (geolocalización y rutas)
- **Comunicación cliente-servidor:** `fetch()` y `res.json()`
- **Modularización:** CommonJS (`module.exports`, `require()`)

---

### 📂 Estructura del proyecto:

/backend
├── config
├── controllers
├── data
├── routes
└── server
/public
├── assets
├── pages
└── scripts
/styles

yaml
Copiar
Editar

---

### 🚀 Próximas funcionalidades:

- Panel para conductores
- Calificación del viaje
- Historial de viajes del usuario
- Migración a **React Native** para versión móvil

---

### 👨‍💻 Autor

**Miguel Daniel Pérez Cárdenas**  
Desarrollador autodidacta en formación, apasionado por la programación web y las soluciones que conectan a las personas.

---

📌 Este proyecto es parte de mi camino hacia un perfil **junior developer profesional**.