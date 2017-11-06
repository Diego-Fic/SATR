show dbs

use Aplicacion

db.createCollection('Users');

db.Users.save({username: 'Diego', password: 1234, email: 'diegoderus@gmail.com', recoverPassword: null, recoverPasswordExpires: null ,rol: 'Admin'});
db.Users.save({username: 'Samuel', password: 1234, email: 'notengo@gmail.com', recoverPassword: null, recoverPasswordExpires: null ,rol: 'Support'});

db.createCollection('Rooms');
db.createCollection('Events');
db.createCollection('Tokens');