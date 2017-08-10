var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var roomsSchema = new Schema({
   id: { type: String},
   name: { type: String },
   destination: { type: String}},
   {collection : 'Rooms'}
);

module.exports = mongoose.model('Rooms', roomsSchema);
