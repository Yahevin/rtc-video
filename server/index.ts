/* eslint-disable import/named */
/* eslint-disable no-param-reassign */

import config from '../webpack.config.js';
import { SocketController } from './ws/socketController';
import { Players } from './types/parts/players';

const express = require('express');
const webpack = require('webpack');
const http = require('http');
const webSocket = require('ws');
const bodyParser = require('body-parser');
const webpackDevMiddleware = require('webpack-dev-middleware');

const compiler = webpack(config);
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }),
);
app.use(express.json());

// const roomsMap: RoomControllersPull = new Map();
// routes(app, db, roomsMap);

const server = http.createServer(app);
const wss = new webSocket.Server({ server });

const players: Players = new Map();

wss.on('connection', (ws: any) => {
  ws.controller = new SocketController(app, ws, players);

  ws.on('message', async (message: string) => {
    console.log('message', message);
    await ws.controller.reduce(JSON.parse(message));
  });

  ws.on('close', async () => {
    await ws.controller.terminate();
    console.log('close', ws.controller.room_id);
  });
});

server.listen(port, () => {
  // @ts-ignore
  console.log(`My app listening on port ${server.address().port}`);
});

app.use((req: any, res: any) => {
  res.redirect(`/#${req.url}`);
});
