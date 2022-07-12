// import express from 'express';
// import WSServer from 'express-ws';
// import * as path from 'path';
// import { fileURLToPath } from 'url';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// const app = express();
// const wsServer = WSServer(app);
// const aWss = wsServer.getWss();
// const PORT = process.env.PORT || 5000;
//
// const connectionHandler = (ws, msg) => {
//     ws.id = msg.id;
//     broadcastConnection(ws, msg);
// };
//
// const broadcastConnection = (ws, msg) => {
//     aWss.clients.forEach((client) => {
//         if (client.id === msg.id) {
//             client.send(JSON.stringify(msg));
//         }
//     });
// };
//
// app.use(express.static('build'));
//
// app.ws('/', (ws, req) => {
//     ws.on('message', (msg) => {
//         const parsedMsg = JSON.parse(msg);
//
//         switch (parsedMsg.method) {
//             case 'connection':
//                 connectionHandler(ws, parsedMsg);
//                 break;
//             case 'draw':
//                 broadcastConnection(ws, parsedMsg);
//                 break;
//         }
//     });
// });
//
// app.listen(PORT, () => {
//     console.log(`Server started on PORT ${PORT}`);
// });
//
// const indexPath = path.join(__dirname, 'build/index.html');
//
// app.get('*', (req, res) => {
//     res.send('test')
//     // console.log('sending index.html');
//     // res.sendFile(indexPath);
// });

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
