import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import * as http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
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

const indexPath = path.join(__dirname, 'build/index.html');

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

app
    .use(express.static('build'))
    .get('/', (req, res) => {
        res.sendFile(indexPath);
    })
    .get('/:id', (req, res) => {
        res.sendFile(indexPath);
    });

server.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
