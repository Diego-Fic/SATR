show dbs

use Aplicacion

db.createCollection('Users',
  { validator: { $or:
    [
        {username: { $type: String} },
        {password: { $type: Number} },
        {email: { $type: String} },
        {recoverPassword: { $type: String} },
        {recoverPasswordExpires: { $type: Date} },
        {rol: { $in: ['Admin','Support','Client']} }
    ]
  }
});

db.Users.save({username: 'Diego', password: 1234, email: 'diegoderus@gmail.com', recoverPassword: null, recoverPasswordExpires: null ,rol: 'Admin'});
db.Users.save({username: 'Samuel', password: 1234, email: 'notengo@gmail.com', recoverPassword: null, recoverPasswordExpires: null ,rol: 'Support'});

db.createCollection('Rooms');
