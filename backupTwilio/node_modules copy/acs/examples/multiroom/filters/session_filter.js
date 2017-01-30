function checkSession(req, res, next) {
	if(!req.session.user) {
		res.render('login', {message: 'Please login first.'});
		return;
	}
	next();
}