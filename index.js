import express from 'express';
import WSServer from 'express-ws';
import cors from 'cors';
import * as path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const wsServer = WSServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, 'build/index.html');
const PORT = process.env.PORT || 9999;

const connectionHandler = (ws, msg) => {
    ws.sessionID = msg.sessionID;
    ws.userID = msg.userID;
    ws.username = msg.username;

    const message = {
        ...msg,
        isNew: true,
    }
    broadcastExceptOwner(message);
};

const broadcastExceptOwner = (msg) => {
    wsServer.getWss().clients.forEach((client) => {
        if (client.sessionID === msg.sessionID && client.userID !== msg.userID) {
            client.send(JSON.stringify(msg));
        }
    });
}

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
            default:
                broadcastExceptOwner(parsedMsg);
                break;
        }
    });

    ws.on('close', () => {
        const message = {
            method: 'closedConnection',
            username: ws.username,
            userID: ws.userID,
            sessionID: ws.sessionID,
            isNew: false,
        }

        broadcastExceptOwner(message);
    })

    ws.on('error', console.error);
});

app.use(cors());
app.use(express.json({ limit: '1000kb' }));

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
        const imagePath = path.resolve(__dirname, 'files', `${req.query.sessionID}.jpg`);
        fs.writeFileSync(imagePath, data, 'base64');
        return res.status(200).json('loaded successfully');
    } catch (e) {
        res.status(500).json('error');
        console.log(e.message);
    }
});

app.get('/image', (req, res) => {
    try {
        const imagePath = path.resolve(__dirname, 'files', `${req.query.sessionID}.jpg`);
        if (!fs.existsSync(imagePath)) {
            return res.status(200).json('file doesn\'t exist');
        }
        const image = fs.readFileSync(imagePath);
        const data = `data:image/png;base64,${image.toString('base64')}`;
        res.json(data);
    } catch (e) {
        res.status(500).json('error');
        console.log(e.message);
    }
});

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
