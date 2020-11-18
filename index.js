const path = require('path');

const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const csvRead = require('./csvReader');
var currentFrameIndex = 0;

const wss = new WebSocket.Server({ server:server });
csvRead.init();

wss.on('connection', function connection(ws) {
    console.log('A new client Connected!');
    ws.send('Welcome New Client!');

    let FrameSender = setInterval(() => sendFrame(ws), (1/60)*1000);
});

function sendFrame(ws){
    if (csvRead.getFrameCount() <= currentFrameIndex){ currentFrameIndex = 0; }
    ws.send(JSON.stringify(csvRead.getFrame(currentFrameIndex, 10)));
    currentFrameIndex++;
}

app.use('/js', express.static(path.join(__dirname, '')));

app.get('/', (req, res) => res.sendFile('index.html', {root: __dirname}))

server.listen(3000, () => console.log(`Lisening on port :3000`))
