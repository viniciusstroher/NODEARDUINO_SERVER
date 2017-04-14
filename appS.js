var net = require('net');

console.log("[Log]iniciando servidor");
var server = net.createServer(function(socket) {
	console.log("[Log]Cliente Conectado");
	
	socket.write('[Log]CONNECTION ACEPTED\r\n');

	// Handle incoming messages from clients.
	socket.on('data', function (data) {
	    console.log('[Log]Data Socket:',data.toString('utf8'));
	    this.write('liga_luz2');
	});

	//socket.pipe(socket);
});

server.listen(8090);