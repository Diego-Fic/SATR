var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var usersSchema = new Schema({
   name: { type: String},
   passwd: { type: Number },
   rol: { type:String, enum: ['Admin','Tecnic','Normal']}
});

module.exports = mongoose.model('Users', usersSchema);
