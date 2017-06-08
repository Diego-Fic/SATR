var N = require('./../../../nuve');
var Administrar = require('../Database/Users_Management');
var Habitaciones = require('../Database/Rooms_Management');
var Email = require('../Email_System/Email_Management');
var crypto = require('crypto');
var user = null;
var id = null;

module.exports = function(app){

app.get('/',function(req, res){
  if (req.cookies.sessionId == undefined){  
    if (req.session.user!= null){
      if(req.session.user.rol == 'Admin')
                {res.redirect('/admin');}
      else if(req.session.user.rol == 'Support')
                  {res.redirect('/support')} 
      } else {res.render('login');}
  } else {
        if (req.cookies.sessionId = id){
          req.session.user=user;
            if(req.session.user.rol == 'Admin')
                {res.redirect('/admin');}
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
          else if (response.rol == 'Admin'){res.redirect('/admin')}
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

app.get('/admin',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Admin'){
    res.redirect('/'); 
  } else {
    res.render('admin',{user : req.session.user});
  }
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
      res.render('admin-updateUser', {user: usuario}); 
    });  
  };
});

app.post('/admin/users/edit/:token',function(req, res){
  if (Object.keys(req.body.username).length === 0 || Object.keys(req.body.email).length === 0 || Object.keys(req.body.password).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/admin/users/create-users');
  } else {   
    Administrar.getUserbyEmail(req.body.email, function(usuario){
      if(usuario){
        req.flash('error', 'A user already exist with that email.');
        res.redirect('/admin/users/create-users');
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
    Administrar.getUserbyEmail(req.params.token, function(response){  
    
      response.remove();      
      res.redirect('/admin/users');
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
  if (Object.keys(req.body.name).length === 0 || Object.keys(req.body.limit).length === 0){
    req.flash('error', 'All fields are required.');
    res.redirect('/admin/rooms/create-rooms');
  } else {   
    Administrar.getUserbyEmail(req.body.name, function(usuario){
      if(usuario){
        Habitaciones.createRooms(req.body.name, req.body.limit, function(response){
          if(response != null){
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
  };
}); 

app.get('/support',function(req, res){
  if (req.session.user == null || req.session.user.rol != 'Support'){
    res.redirect('/'); 
  } else {
    res.render('admin');
  }
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

};

