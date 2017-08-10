var mongoose = require('mongoose');
    Schema = mongoose.Schema;

var eventsSchema = new Schema({
   nameUser: { type: String},	
   text: { type: String},
   start_date: { type: String},
   end_date: { type: String}},
   {collection : 'Events'}
);

module.exports = mongoose.model('Events', eventsSchema);