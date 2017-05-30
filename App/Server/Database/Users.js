var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var usersSchema = new Schema({
   username: { type: String},
   password: { type: Number },
   email: {type: String},
   recoverPassword: {type: String},
   recoverPasswordExpires: {type: Date},
   rol: { type:String, enum: ['Admin','Support','Client']}},
   {collection : 'Users'}
);

module.exports = mongoose.model('Users', usersSchema);
