# SATR

Sistema de atención técnica remota basado en tecnología WebRTC.

Remote technical assistance system based on WebRTC technology.

# Introducción
La aplicación emplea las siguiente librerias:
* [Licode](http://lynckia.com/licode/) - Plataforma de Comunicaciones Open Source WebRTC
* [Node](https://nodejs.org/es/) - Servidor de aplicaciones - versión 6.10
* [MongoDb](https://www.mongodb.com/es) - Base de Datos NoSQL - versión 2.6.12
* [Jade](https://pugjs.org/api/getting-started.html) - HTML Templating Engine - 1.11

# Prerequisitos y Instalación

Antes de instalar y probar la aplicación necesitamos realizar una serie de tareas:
* Debemos descargar la aplicación del repositorio ($git clone https://github.com/Diego-Fic/SATR.git) y instalar las dependencias mediante $npm init. 
* A continuación debemos descargar Licode($ git clone https://github.com/ging/licode.git) y instalar las dependencias de Licode localizadas en licode/scripts.
* Debemos arrancar ./installUbuntuDepsh, seguido de ./installErizo.sh y de ./installNuve.sh.
* Por último creamos la base de datos ejecutando el archivo NoSQL.js mediante el comando mongo < MongodB/NoSQL.js.

Una vez hemos instalado las dependecias podemos ejecutar nuestra aplicación:
* Ejecutamos node SATR/app.js .
* Iniciamos el navegador web en http://localhost:8000 .
