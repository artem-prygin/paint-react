import express from 'express';
import WSServer from 'express-ws';

const app = express();
const wsServer = WSServer(app);
const aWss = wsServer.getWss();
const PORT = process.env.PORT || 5000;

const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach((client) => {
        if (client.id === msg.id) {
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
                broadcastConnection(ws, parsedMsg);
                break;
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
