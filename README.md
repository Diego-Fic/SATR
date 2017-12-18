# SATR

Sistema de atención técnica remota basado en tecnología WebRTC.

Remote technical assistance system based on WebRTC technology.

# Introducción
La aplicación emplea las siguientes librerias:
* [EasyRTC](https://easyrtc.com/) - Plataforma de Comunicaciones Open Source WebRTC
* [Node](https://nodejs.org/es/) - Servidor de aplicaciones
* [MongoDb](https://www.mongodb.com/es) - Base de Datos NoSQL
* [Jade](https://pugjs.org/api/getting-started.html) - HTML Templating Engine

# Prerequisitos y Instalación

Antes de instalar y probar la aplicación necesitamos realizar una serie de tareas:
* Necesitamos un sistema operativo Ubuntu 14.04, a ser posible una instalación por defecto. 
* Disponer de un navegador Chrome, a ser posible con una versión anterior a la 56.
* Instalar el plugin para Chrome https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk.
* Instalar MongoDB con el comando "sudo apt-get install mongodb".
* Despues debemos descargar el manejador de paquetes para Node.js con el comando "sudo apt-get install npm".
* A continuación instalamos Node.js, este paso es importante pues necesitamos instalar un versón superior a la 6.1 de este. Introducimos los siguientes comandos "curl -sL https://deb.nodesource.com/setup 6.x | sudo -E bash - y sudo apt-get install -y nodejs".
* Debemos descargar la aplicación del repositorio (git clone https://github.com/Diego-Fic/SATR.git), cd SATR/ e instalar las dependencias mediante npm install. 
* Por último creamos la base de datos ejecutando el archivo NoSQL.js mediante el comando mongo < MongodB/NoSQL.js.

Una vez hemos instalado las dependencias podemos ejecutar nuestra aplicación:
* Ejecutamos node SATR/app.js .
* Iniciamos el navegador web en https://localhost:8443
