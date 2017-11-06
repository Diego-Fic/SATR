# SATR

Sistema de atención técnica remota basado en tecnología WebRTC.

Remote technical assistance system based on WebRTC technology.

# Introducción
La aplicación emplea las siguiente librerias:
* [EasyRTC](https://easyrtc.com/) - Plataforma de Comunicaciones Open Source WebRTC
* [Node](https://nodejs.org/es/) - Servidor de aplicaciones
* [MongoDb](https://www.mongodb.com/es) - Base de Datos NoSQL
* [Jade](https://pugjs.org/api/getting-started.html) - HTML Templating Engine

# Prerequisitos y Instalación

Antes de instalar y probar la aplicación necesitamos realizar una serie de tareas:
* Debemos descargar la aplicación del repositorio (git clone https://github.com/Diego-Fic/SATR.git) y instalar las dependencias mediante npm init. 
* Por último creamos la base de datos ejecutando el archivo NoSQL.js mediante el comando mongo < MongodB/NoSQL.js.

Una vez hemos instalado las dependecias podemos ejecutar nuestra aplicación:
* Ejecutamos node SATR/app.js .
* Iniciamos el navegador web en https://localhost:8443
