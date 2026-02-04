import express from "express"
import cors from "cors"
import { WebSocketServer } from "ws"
// @ts-ignore
import yws from 'y-websocket/bin/utils';
import { createServer } from "node:http"

const app = express();
app.use(cors());

const httpServer = createServer(app);

const wss = new WebSocketServer({ server : httpServer});

wss.on("connection", (ws , req) => {
    console.log("Connected to ws server");
      ws.send('hi');

    yws.setupWSConnection(ws, req); 
});

httpServer.listen(3000, () => {
    console.log("listing to port 3000");
})
