var ACS = require('acs').ACS;
var logger = require('acs').logger;

//do ACS user login
function login(req, res) {
	var un = req.body.username;
	var pw = req.body.password;
	ACS.Users.login({login: un, password: pw}, function(data) {
		if(data.success) {
			var user = data.users[0];
			if(user.first_name && user.last_name) {
				user.name = user.first_name + ' ' + user.last_name;
			} else {
				user.name = user.username;
			}
			req.session.user = user;
			res.redirect('/');
			logger.info('User logged in: ' + user.name);
		} else {
			res.render('login', {message: data.message});
		}
	});
}

function logout(req, res) {
	delete req.session.user;
	res.redirect('/');
}