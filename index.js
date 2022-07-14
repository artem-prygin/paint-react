import express from 'express';
import * as path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import WSServer from 'express-ws';
import cors from 'cors';

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

        if (typeof parsedMsg === 'number') {
            ws.send('2');
            return;
        }

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

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));

    app.get('/', (req, res) => {
        res.sendFile(indexPath);
    });

    app.get('/:sessionID', (req, res) => {
        res.sendFile(indexPath);
    });
}

app.post('/image', (req, res) => {
    try {
        const data = req.body.image.split(';base64,')[1];
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.sessionID}.jpg`), data, 'base64')
        return res.status(200).json('загружено')
    } catch (e) {
        res.status(500).json('error');
        console.log(e.message);
    }
});

app.get('/image', (req, res) => {
    try {
        const image = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.sessionID}.jpg`));
        const data = `data:image/png;base64,${image.toString('base64')}`;
        res.json(data);
    } catch (e) {
        res.status(500).json('error');
        console.log(e.message);
    }
});

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
