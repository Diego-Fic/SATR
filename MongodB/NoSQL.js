show dbs

use Aplicacion

db.createUser(
	{
		user:"Diego",
		pwd:"1234",
		roles:[ "readWrite", "dbAdmin" ]
	}
);

db.auth("Diego","1234");

db.createCollection('Clientes');
db.createCollection('Habitaciones');
