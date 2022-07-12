import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, 'build/index.html');
const PORT = process.env.PORT || 5000;

const connectionHandler = (ws, msg) => {
    ws.sessionID = msg.sessionID;
    broadcastConnection(msg);
};

const broadcastConnection = (msg) => {
    wss.clients.forEach((client) => {
        if (client.sessionID === msg.sessionID) {
            client.send(JSON.stringify(msg));
        }
    });
};

const server = express()
    .use(express.static('build'))
    .get('/', (req, res) => {
        res.sendFile(indexPath);
    })
    .get('/:id', (req, res) => {
        res.sendFile(indexPath);
    })
    .listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);
    });

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (msg) => {
        const parsedMsg = JSON.parse(msg);

        switch (parsedMsg.method) {
            case 'connection':
                connectionHandler(ws, parsedMsg);
                break;
            case 'draw':
                broadcastConnection(parsedMsg);
                break;
        }
    });
});
