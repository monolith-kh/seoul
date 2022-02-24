// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const net = require('net')


let server = null;

let socketData = null;

init();

server.listen(8107, function() {
    console.log('Server listening: ' + JSON.stringify(server.address()));
    server.on('close', function(){
        console.log('Server Terminated');
    });
    server.on('error', function(err){
        console.log('Server Error: ', JSON.stringify(err));
    });
});

function writeData(socket, data){
    var success = !socket.write(data);
    if (!success){
        (function(socket, data){
            socket.once('drain', function(){
                writeData(socket, data);
            });
        })(socket, data);
    }
}

function init() {
    server = net.createServer(function(client) {
        console.log('Client connection: ');
        console.log('   local = %s:%s', client.localAddress, client.localPort);
        console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);
        client.setTimeout(500);
        client.setEncoding('utf8');
        client.on('data', function(data) {
          console.log('Received data from client on port %d: %s',
                      client.remotePort, data.toString());
          socketData.textContent = `data: ${data.toString()}`;
          console.log('  Bytes received: ' + client.bytesRead);
          writeData(client, 'Sending: ' + data.toString());
          console.log('  Bytes sent: ' + client.bytesWritten);
        });
        client.on('end', function() {
          console.log('Client disconnected');
          server.getConnections(function(err, count){
            console.log('Remaining Connections: ' + count);
          });
        });
        client.on('error', function(err) {
          console.log('Socket Error: ', JSON.stringify(err));
        });
        client.on('timeout', function() {
          console.log('Socket Timed out');
        });
      }
    );

    socketData
    socketData = document.getElementById('socket-data');
    socketData.textContent = `data: n/a`;

}