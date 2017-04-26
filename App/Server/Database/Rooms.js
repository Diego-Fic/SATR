var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var roomsSchema = new Schema({
   id: { type: Number},
   name: { type: String },
   max: { type: Number}
});

module.exports = mongoose.model('Rooms', clientsSchema);
