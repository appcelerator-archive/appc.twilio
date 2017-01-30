function receiveMessage(data, socket) {
	socket.broadcast.emit('message', data);
}