var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var tokensSchema = new Schema({
   email: { type: String},
   room: { type: String}},
   {collection : 'Tokens'}
);

module.exports = mongoose.model('Tokens', tokensSchema);