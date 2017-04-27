var N = require('./../../../nuve');
var Administrar = require('../Database/Users_Management');

module.exports = function(app){

   app.get('/',function(req, res){
      res.render('login');       
   });

   app.post('/',function(req, res){
      Administrar.Login(req.body.username, req.body.password, function(error, result){
        if(result){
           res.redirect('/inicio');
         }
      });
   });

   app.get('logout',function(req, res){

   });
};
