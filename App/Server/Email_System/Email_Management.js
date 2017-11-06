var crypto = require('crypto');
var nodemailer = require('nodemailer');
var smtTransports = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'satrrecovery@gmail.com',
		pass: 'SATR1234recovery'
	}
});

exports.generateToken = function(response){
	response(crypto.randomBytes(20).toString('hex'));
}

exports.sendMailSolicitation = function(email, token, response){
	var mailOptions = {
		to: email,
		from: 'satrrecovery@gmail.com',
		subject: 'SATR Password Recovery',
		text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
			'Please click on the following link or paste this into your browser to complete the process:\n\n' +
			'http://localhost:8000/change-password/' + token + '\n\n' +
			'If you did not request this, please ignore this email and your password will remain unchanged.\n'
	};

	smtTransports.sendMail(mailOptions);
};

exports.sendMailConfirmation = function(email, response){
	var mailOptions = {
		to: email,
		from: 'satrrecovery@gmail.com',
		subject: 'SATR Password Recovery',
		text:'Hello,\n' + 'This is a confirmation that the password for your account ' + email + ' has just been changed.\n' 
	};

	smtTransports.sendMail(mailOptions);
};

exports.sendRoomConfirmation = function(email,token, response){
	var mailOptions = {
		to: email,
		from: 'satrrecovery@gmail.com',
		subject: 'SATR Room Confirmation',
		text:'Hello,\n' + 'Then you have the link for the technical service conference:\n\n' +
		'http://localhost:8000/room/' + token +'\n' 
	};

	smtTransports.sendMail(mailOptions);
};












