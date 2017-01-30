function index(req, res) {
	res.render('index', {user: req.session.user});
}

function login(req, res) {
	res.render('login');
}

function signup(req, res) {
	res.render('signup');
}

function chatroom(req, res) {
	res.render('chatroom', {user: req.session.user});
}