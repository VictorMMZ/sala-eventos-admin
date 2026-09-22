# SalaEventos Admin

Panel de administración desarrollado con **React** para gestionar las reservas y los recursos de una aplicación de eventos infantiles.

El panel consume la API desarrollada con Laravel y proporciona una interfaz privada para la gestión de la aplicación.

## 🚀 Tecnologías

- React
- Vite
- JavaScript
- React Router
- Fetch API
- Bootstrap
- Laravel API
- Laravel Sanctum
- TOTP / Google Authenticator

## Credenciales Demo 

En el login del panel de administrador haciendo click en el boton "Cuenta demo" el programa asigna automaticamente un usuario demo de la base de datos y despues de eso se hace necesario la configuración del 2FA  mediante codigo QR


## 🔐 Autenticación

El acceso al panel está protegido mediante autenticación.

El flujo de acceso incorpora:

```text
Login
  ↓
Comprobación de credenciales
  ↓
Segundo factor de autenticación
  ↓
Acceso al panel
```

El segundo factor utiliza **TOTP**, permitiendo utilizar aplicaciones de autenticación compatibles con Google Authenticator.

Las rutas privadas del frontend están protegidas mediante componentes de control de acceso.

## 📋 Funcionalidades

### Gestión de reservas

Desde el panel administrativo se pueden gestionar las reservas realizadas desde la aplicación pública.

Entre los datos gestionados se encuentran:

- Datos de la reserva.
- Sala.
- Fecha y hora.
- Precio.
- Descuento.
- Fianza.
- Método de pago.
- Estado.
- Importe total.

### Gestión de salas

El panel permite administrar las salas disponibles para las reservas.

### Usuarios

Se dispone de gestión de usuarios y acceso restringido a las funcionalidades administrativas.

### Dashboard

El panel incluye información relacionada con las reservas y la facturación.

## 🛡️ Protección de rutas

Las rutas administrativas están protegidas en el frontend.

Un usuario que no tenga una sesión válida no puede acceder directamente a las páginas privadas del panel.

```text
Usuario
   ↓
¿Sesión válida?
   ├── No → Login
   └── Sí
        ↓
      Panel
```

La protección del frontend complementa la seguridad implementada en la API.

## 🔌 Comunicación con Laravel

El panel utiliza `fetch` para comunicarse con la API.

Las peticiones autenticadas mantienen las credenciales de sesión necesarias para que Laravel pueda identificar al usuario.

Ejemplo:

```javascript
fetch(`${API_URL}/api/reservas`, {
    credentials: "include"
});
```

La comunicación está organizada mediante servicios independientes de los componentes de React.

## ⚠️ Gestión de errores y estados

La aplicación controla diferentes situaciones durante las peticiones:

- Carga de datos.
- Errores de conexión.
- Errores de validación.
- Sesión no válida.
- Recursos inexistentes.
- Conflictos de disponibilidad.
- Respuestas correctas de la API.

## 🧪 Backend probado

La API dispone de tests automatizados para comprobar diferentes escenarios de funcionamiento y validación.

Entre los casos contemplados se encuentran:

- Operaciones CRUD.
- Validaciones.
- Disponibilidad de salas.
- Creación de reservas.
- Respuestas HTTP.
- Acceso a recursos protegidos.
- Tratamiento de errores.

## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd SalaEventos-Admin
```

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## 🔧 Configuración

Crear un archivo `.env`:

```env
VITE_API_URL=http://localhost:8000
```

La API Laravel debe estar ejecutándose para que el panel pueda realizar las operaciones correspondientes.

## 🏗️ Build

Para generar la versión de producción:

```bash
npm run build
```

Los archivos preparados para el despliegue se generan en:

```text
dist/
```

## 📁 Estructura

```text
src/
├── components/
├── pages/
├── services/
├── hooks/
└── ...

public/
```

La aplicación separa las páginas, componentes y servicios de comunicación con la API para mantener una estructura organizada.

## 🎯 Objetivo

El objetivo del proyecto es desarrollar un panel administrativo conectado a una API REST, aplicando conceptos de:

- Autenticación.
- Autorización.
- Protección de rutas.
- Consumo de APIs.
- Gestión de estados.
- Validación.
- Manejo de errores.
- Separación de responsabilidades.

---

**Proyecto desarrollado como parte de mi portfolio de desarrollo web. Victor Manuel Marrero Zayas**