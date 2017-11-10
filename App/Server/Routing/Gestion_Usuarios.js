var Administrar = require('../Database/Users_Management');
var Habitaciones = require('../Database/Rooms_Management');
var Email = require('../Email_System/Email_Management');
var Eventos = require('../Database/Events_Management');
var crypto = require('crypto');
var moment = require('moment');
var conversor = require('./../../Public/js/conversor');
var TokenDB = require('../Database/Tokens_Management');

var user = null;
var id = null;

module.exports = function(app){

app.get('/admin-create',function(req,res){
  res.render('admin-updateUser');
});

app.get('/',function(req, res){
  if (req.cookies.sessionId == undefined){  
    if (req.session.user!= null){
      if(req.session.user.rol == 'Admin')
                {res.redirect('/admin/calendar/' + req.session.user.email);}
      else if(req.session.user.rol == 'Support')
                  {res.redirect('/support')} 
      } else {res.render('login');}
  } else {
        if (req.cookies.sessionId = id){
          req.session.user=user;
            if(req.session.user.rol == 'Admin')
                {res.redirect('/admin/calendar/' + req.session.user.email);}
            else if(req.session.user.rol == 'Support')
                  {res.redirect('/support')} 
         }
        else {res.render('login');}                              
    }
});

app.post('/',function(req, res){
  if(Object.keys(req.body.email).length === 0 || Object.keys(req.body.password).length === 0){
    req.flash('error', 'Enter email and password.');
    res.redirect('/');
  } else {  
    Administrar.Login(req.body.email, req.body.password, function(response){
      if(response){
        req.session.user=response;
        user = response;

        if (req.body.recuerdame == 'on'){
          Administrar.generateToken(function(token){  
            res.cookie('sessionId', token, {maxAge: 3600000});
            id = token;
            res.redirect('/');
          });
        }
        else {
          if(response.rol == 'Support'){res.redirect('/support')}
          else if (response.rol == 'Admin'){res.redirect('/admin/calendar/' + req.session.user.email)}
        }
      } else {
        req.flash('error', 'Your SATR account could not be found.');    
        res.redirect('/');
      }
    });
  }  
});

app.get('/logout',function(req, res){
  res.clearCookie('sessionId');
  req.session.user = null;
  res.redirect('/');
});

app.get('/support',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Support'){
    res.redirect('/'); 
  } else { 
    Eventos.findByUser(req.session.user.email, function(response){ 
      res.render('support',{user : req.session.user, lista:response});
    });
  }
});

app.post('/support',function(req, res){
  var data = req.body;
  var mode = data["!nativeeditor_status"];
  var sid = data.id;
  var tid = sid;

    res.setHeader("Content-Type","text/xml");
    res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>"); 
  
   
  if (mode == "updated")
    Eventos.updateEvent(req.session.user.email, data.text, data.start_date, data.end_date, function(response){
    
    });
  else if (mode == "inserted")
    Eventos.createEvent(req.session.user.email, data.text, data.start_date, data.end_date, function(response){

    });
  else if (mode == "deleted")
    Eventos.removeEvent(req.session.user.email, data.text, data.start_date, data.end_date, function(response){

    });
});

app.get('/support/rooms',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Support'){
    res.redirect('/'); 
  } else {
    Habitaciones.findAllbyName(req.session.user.email, function(response){
       
      res.render('support-rooms', {user : req.session.user, lista : response});
      
    });
  }
});

app.get('/support/rooms/create-rooms',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Support'){
    res.redirect('/'); 
  } else {
    res.render('support-createRooms',{user : req.session.user});
  }
});

app.post('/support/rooms/create-rooms',function(req, res){
  if (Object.keys(req.body.name).length === 0 || Object.keys(req.body.destination).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/support/rooms/create-rooms');
  } else {   
    Administrar.getUserbyEmail(req.body.name, function(usuario){
        if(usuario){
          Habitaciones.createRooms(req.body.name, req.body.destination, function(response){
            if(response != null){
              Eventos.createEvent(req.session.user.email, req.body.destination, conversor.changeDateInserted(new Date(),1), conversor.changeDateInserted(new Date(),0), function(response){
              });
              TokenDB.createToken(req.body.name,response.id,function(response){});
              TokenDB.createToken(req.body.destination,response.id,function(response){});
              //enviar mensaje
              Email.sendRoomConfirmation(req.body.destination,response.id, response);  
              
              req.flash('success', 'Room created successfully.');
              res.redirect('/support/rooms/create-rooms');  
              //crear tokens          
            } else {
              req.flash('error', 'An error was ocurred.');
              res.redirect('/support/rooms/create-rooms');                        
            }
          });           
        } else {         
          req.flash('error', 'There is no employee with that email.');
          res.redirect('/support/rooms/create-rooms');
        }
    });
  }  
}); 

app.get('/support/rooms/edit/:token',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Support'){
    res.redirect('/'); 
  } else {
    Habitaciones.getRoombyName(req.params.token, function(response){
      res.render('support-updateRoom', {room: response, user:req.session.user}); 
    });  
  };
});

app.post('/support/rooms/edit/:token',function(req, res){
  if (Object.keys(req.body.name).length === 0 || Object.keys(req.body.max).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/support/rooms/create-users');
  } else {   
    Habitaciones.getRoombyName(req.body.name, function(usuario){
      if(usuario){
        req.flash('error', 'An employee is already assigned.');
        res.redirect('/support/rooms/');
      } else {
        Habitaciones.getRoombyName(req.params.token, function(response){

          TokenDB.deleteToken(response.name,response.id,function(response){});
          TokenDB.deleteToken(response.destination,response.id,function(response){});
          
          Habitaciones.deleteRoom(response.id);
          response.remove();

          Habitaciones.createRooms(req.body.name, req.body.max, function(response){

            Eventos.findbyName(req.params.token, function(response){
                response.remove();
            });
            Eventos.createEvent(req.body.name, req.body.max, conversor.changeDateInserted(new Date(),1), conversor.changeDateInserted(new Date(),0), function(response){
            });

            TokenDB.createToken(req.body.name,response.id,function(response){});
            TokenDB.createToken(req.body.max,response.id,function(response){});
            //enviar mensaje
            Email.sendRoomConfirmation(req.body.max,response.id, response);  
                  
          });
          //crear nuevos tokens
          req.flash('success', 'Success! Changes has been saved.');
          res.redirect('/support/rooms');
        });
      };
    });
  };
});

app.post('/support/rooms/delete/:token',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Support'){
    res.redirect('/'); 
  } else {
    Habitaciones.getRoombyName(req.params.token, function(response){  

      Habitaciones.deleteRoom(response.id);

      response.remove();

      Eventos.findbyName(req.params.token, function(response){
        if (response!=null){
          response.remove();
        }
      });

      res.redirect('/support/rooms');
    });
  };
});

app.get('/admin/calendar/:token',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else { 
    Eventos.findByUser(req.params.token, function(response){
    res.render('admin',{user : req.session.user, lista:response, empleado:req.params.token});
    });
  }
});

app.post('/admin/calendar/:token',function(req, res){
  var data = req.body;
  var mode = data["!nativeeditor_status"];
  console.log('modo: ' + mode);
  console.log('data: ' + data.text);
  console.log('data: ' + data.start_date);
  console.log('data: ' + data.end_date);
  var sid = data.id;
  var tid = sid;

  if (mode!=undefined){
    console.log('hola');
    res.setHeader("Content-Type","text/xml");
    res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>"); 
  }

  if (mode == "updated"){
    Eventos.updateEvent(req.session.user.email, data.text, data.start_date, data.end_date, function(response){
    });
  }else if (mode == "inserted"){
    Eventos.createEvent(req.session.user.email, data.text, data.start_date, data.end_date, function(response){
    });
  }else if (mode == "deleted"){
    Eventos.removeEvent(req.session.user.email, data.text, data.start_date, data.end_date, function(response){
    });
  }else {
        if (req.body.Search!=null){
          Administrar.getUserbyEmail(req.body.Search, function(response){
            if (response!=null){    
              res.redirect('/admin/calendar/' + req.body.Search);
            }
            else {
              res.redirect('/admin/calendar/' + req.session.user.email);
            }
          });
        };
    };
});

app.get('/admin/users',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    Administrar.findAllUsers(function(response){
      res.render('admin-users', {user : req.session.user, lista : response});     
    });
  }
}); 

app.get('/admin/users/create-users',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    res.render('admin-createUsers',{user : req.session.user});
  }
});

app.post('/admin/users/create-users',function(req, res){
  if (Object.keys(req.body.username).length === 0 || Object.keys(req.body.email).length === 0 || Object.keys(req.body.password).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/admin/users/create-users');
  } else {   
    Administrar.getUserbyEmail(req.body.email, function(usuario){
      if(usuario){
        req.flash('error', 'A user already exist with that email.');
        res.redirect('/admin/users/create-users');
      } else {
        Administrar.createUser(req.body.username, req.body.email, req.body.password, req.body.takeRol, function(response){
          if (response != null){
            req.flash('success', 'User created successfully.');
            res.redirect('/admin/users/create-users');
          } else {
            req.flash('error', 'An error was ocurred.');
            res.redirect('/admin/users/create-users');
          }
        });
      };
    });
  };
}); 

app.get('/admin/users/edit/:token',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    Administrar.getUserbyEmail(req.params.token, function(usuario){
      res.render('admin-updateUser', {user : req.session.user, User: usuario}); 
    });  
  };
});

app.post('/admin/users/edit/:token',function(req, res){
  if (Object.keys(req.body.username).length === 0 || Object.keys(req.body.email).length === 0 || Object.keys(req.body.password).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/admin/users/edit/' + req.params.token);
  } else {   
    Administrar.getUserbyEmail(req.body.email, function(usuario){
      if(usuario){
        req.flash('error', 'A user already exist with that email.');
        res.redirect('/admin/users/edit/' + req.params.token);
      } else {
        Administrar.getUserbyEmail(req.params.token, function(response){
          
          response.username = req.body.username;
          response.email = req.body.email;
          response.password = req.body.password;
          response.rol = req.body.takeRol;

          response.save();
          
          req.flash('success', 'Success! Changes has been saved.');
          res.redirect('/admin/users');
        });
      };
    });
  };
});

app.post('/admin/users/delete/:token',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    Administrar.getUserbyEmail(req.params.token, function(usuario){  
      
      Habitaciones.getRoombyName(req.params.token,function(response){
        
        if(response==null){
          usuario.remove();
          Eventos.removeAllEvents(req.params.token,function(response){});      
          res.redirect('/admin/users');
        } else {
          req.flash('error', 'This user has rooms.');
          res.redirect('/admin/users');
        }  
      });
    });
  };
});

app.get('/admin/rooms',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    Habitaciones.findAllRooms(function(response){
      res.render('admin-rooms', {user : req.session.user, lista:response});
    });
  }
});      

app.get('/admin/rooms/create-rooms',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    res.render('admin-createRooms',{user : req.session.user});
  }
});

app.post('/admin/rooms/create-rooms',function(req, res){
  if (Object.keys(req.body.name).length === 0 || Object.keys(req.body.destination).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/admin/rooms/create-rooms');
  } else {
    if((moment(req.body.registration_date, "MM/DD/YYYY").isValid()) && (moment(req.body.registration_time, "HH:mm").isValid())){
      Administrar.getUserbyEmail(req.body.name, function(usuario){
          if(usuario){
            Habitaciones.createRooms(req.body.name, req.body.destination, function(response){
              if(response != null){
                Eventos.createEvent(req.body.name, req.body.destination, req.body.registration_date + ' ' +
                  req.body.registration_time , req.body.registration_date + ' ' +
                  conversor.changeDate1hoursmore(req.body.registration_time) , function(response){
                });
                TokenDB.createToken(req.body.name,response.id,function(response){});
                TokenDB.createToken(req.body.destination,response.id,function(response){});
                //enviar mensaje
                Email.sendRoomConfirmation(req.body.destination,response.id, response);  
                req.flash('success', 'Room created successfully.');
                res.redirect('/admin/rooms/create-rooms');            
              } else {
                req.flash('error', 'An error was ocurred.');
                res.redirect('/admin/rooms/create-rooms');                        
              }
            });

          } else {         
            req.flash('error', 'There is no employee with that email.');
            res.redirect('/admin/rooms/create-rooms');
          }
      });
    }
    else {
        req.flash('error', 'The format of the dates is not correct.');
        res.redirect('/admin/rooms/create-rooms');
    }  
  }  
}); 

app.get('/admin/rooms/edit/:token',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    Habitaciones.getRoombyName(req.params.token, function(response){
      res.render('admin-updateRoom', {room: response, user : req.session.user}); 
    });  
  };
});

app.post('/admin/rooms/edit/:token',function(req, res){
  if (Object.keys(req.body.name).length === 0 || Object.keys(req.body.max).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/admin/rooms/create-users');
  } else {   
    Habitaciones.getRoombyName(req.params.token, function(room){
      if(room.name != req.body.name){
        req.flash('error', 'An employee is already assigned.');
        res.redirect('/admin/rooms/');
      } else {
        Habitaciones.getRoombyName(req.params.token, function(response){

          TokenDB.deleteToken(response.name,response.id,function(response){});
          TokenDB.deleteToken(response.destination,response.id,function(response){});

          Habitaciones.deleteRoom(response.id);
          
          response.remove();

          Habitaciones.createRooms(req.body.name, req.body.max, function(response){
            
            Eventos.findbyName(req.params.token, function(response){
                response.remove();
            });
            Eventos.createEvent(req.body.name, req.body.max, conversor.changeDateInserted(new Date(),1), conversor.changeDateInserted(new Date(),0), function(response){
            });

            TokenDB.createToken(req.body.name,response.id,function(response){});
            TokenDB.createToken(req.body.max,response.id,function(response){});
            //enviar mensaje
            Email.sendRoomConfirmation(req.body.max,response.id, response);  
                
          });

          //crear nuevos tokens
          req.flash('success', 'Success! Changes has been saved.');
          res.redirect('/admin/rooms');
        });
      };
    });
  };
});

app.post('/admin/rooms/delete/:token',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    Habitaciones.getRoombyName(req.params.token, function(response){  

      console.log("Room deleted: " + response.id);
      Habitaciones.deleteRoom(response.id);
      //console.log(response);

      response.remove();
      
       Eventos.findbyName(req.params.token, function(response){
          if (response!=null){
            response.remove();
          }
       });
      
      res.redirect('/admin/rooms');
    });
  };
});
 
app.get('/recover-password',function(req, res){
  res.render('recover-password');
});

app.post('/recover-password', function(req, res){
  Administrar.getUserbyEmail(req.body.recoverEmail, function(response){
    if (response) {
      Email.generateToken(function(token){
        response.recoverPassword = token; 
        response.recoverPasswordExpires = Date.now() + 3600000;

        response.save(); 

        Email.sendMailSolicitation(response.email, token, response);

          req.flash('info', 'An e-mail has been sent to ' + req.body.recoverEmail + ' with further instructions.');
        
          res.redirect('/recover-password');
        });
    } else {
        req.flash('error', 'No account with that email address exists.');
          //enviar mensaje de error
        res.redirect('/recover-password');
      }
  });
});

app.get('/change-password/:token',function(req, res){
  Administrar.recoverPassword(req.params.token, Date.now(), function(response){
    if(response){
      res.render('change-password');
    } else {
      req.flash('error', 'Password reset token is invalid or has expired.');
      res.redirect('/change-password');
    }
  });
});

app.post('/change-password/:token', function(req, res){
  if (req.body.changedPassword != req.body.confirm) {
    req.flash('error', 'Your new password do not match.');
            
    res.redirect('/change-password/'+ req.params.token);
  } else {
    Administrar.recoverPassword(req.params.token, Date.now(), function(response){
      if (response){
        response.password = req.body.changedPassword;
        response.recoverPassword = null; 
        response.recoverPasswordExpires = null;

        response.save();

        Email.sendMailConfirmation(response.email, response);
            
          req.flash('success', 'Success! Your password has been changed.');
            
          res.redirect('/');
      }; 
    });    
  };
});


app.get('/room/:token',function(req, res){
    if (req.session.user == undefined){
      TokenDB.findTokenClient(req.params.token,function(response){
        if (response!=null){
          //console.log("ID: " + response.room);
          //console.log("Email: " +response.email);
        res.render('room3', {token:response.room , email:response.email , rol: "Client"});
        TokenDB.deleteToken(response.email,response.room,function(token){token.remove();});
        } else {res.redirect('/');}
      });
    }
    else {
      TokenDB.findToken(req.session.user.email,req.params.token,function(response){
        if(response!=null){
          //console.log("ID2: " + response.room.toString());
          //console.log("Email2: " + response.email);
        res.render('room3', {token:response.room , email:response.email, rol: req.session.user.rol});
        TokenDB.deleteToken(response.email,response.room,function(token){token.remove();});
        } else {res.redirect('/admin/rooms');}
      });
    }
});


/*
app.get('/room',function(req, res){
  res.render('room3',{token:"", email:"response.email" , rol: "Cliente"});
});
*/

};

