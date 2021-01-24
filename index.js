'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

let messageStatus = {
    isListening: false
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/api",require('./routes')(wss, messageStatus));
app.use("/",express.static('public'));

wss.on('connection', function (ws, request) {
    messageStatus.isListening = false;
    
    console.debug("Connected")
    ws.on('message', function (message) {
        var res = JSON.parse(message);
        switch (res.type) {
            case "PING":
                heartbeat.bind(this)();
                ws.send(JSON.stringify({type: "PONG"}));
                break;
            case "LISTEN":
                messageStatus.isListening = true;
                break;
            default:
                break;

        }
        console.debug(res);
    });

    ws.on('close', function () {
        console.debug("Closed connection")
    });
});

server.listen(8080, function () {
    console.debug('Listening on http://localhost:8080');
});


function heartbeat() {
    this.pingTimeout ? clearTimeout(this.pingTimeout) : "";
    let socket = this;

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
        console.debug("No heartbeat, Closing...")
        socket.terminate();
    }, 60000 + 1000);
}