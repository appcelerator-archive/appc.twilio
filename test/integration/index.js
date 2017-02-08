const test = require('tape');
const tapSpec = require('tap-spec');
const Arrow = require('arrow');
const request = require('request');

test.createStream()
	.pipe(tapSpec())
	.pipe(process.stdout);

var server, auth, urlToHit;

test('### Start Arrow ###', function (t) {
    startArrow(function() {		
        t.ok(server, 'Arrow has been started');
		auth = { user: server.config.apikey, password: ''},
		urlToHit = `http://localhost:${server.port}/api/message`;		
        t.end();
    });
})

test('### First ###', function (t) {	
	const options = {
        uri: urlToHit,
        method: 'GET',
        auth: auth,
        json: true
    }
    request(options, function (err, response, body) {
        t.equal(response.statusCode, 200, 'Response is ok');
        t.end();
    });
});





function startArrow(callback) {
    server = new Arrow({
        port: (Math.random() * 40000 + 1200) | 0
    });
    server.start(callback);
}

