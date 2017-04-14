
var net = require('net');

var client = new net.Socket();
client.connect(8090, '192.168.0.20', function() {
	console.log('[Log]Connected');
	//client.write('ler_luminosidade');

	
	client.write('ler_temperatura');
	client.write('ler_temperatura');

	//client.write('ler_movimentacao');
	
	
});

client.on('data', function(data) {
	console.log('[Log]Received: ',data.toString('utf8'));
});

client.on('close', function() {
	console.log('[Log]Connection closed');
});