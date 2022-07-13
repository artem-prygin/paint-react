import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';
import WSServer from 'express-ws';

const app = express();
const wsServer = WSServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, 'build/index.html');
const PORT = process.env.PORT || 5000;

const connectionHandler = (ws, msg) => {
    ws.sessionID = msg.sessionID;
    broadcastConnection(msg);
};

const broadcastConnection = (msg) => {
    wsServer.getWss().clients.forEach((client) => {
        if (client.sessionID === msg.sessionID) {
            client.send(JSON.stringify(msg));
        }
    });
};

app.ws('/', (ws, req) => {
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

    ws.on('error', console.error);
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));

    app.get('/', (req, res) => {
        res.sendFile(indexPath);
    });

    app.get('/:id', (req, res) => {
        res.sendFile(indexPath);
    });
}

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
