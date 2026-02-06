import express from "express"
import cors from "cors"
import { WebSocketServer } from "ws"
import dotenv from "dotenv";
dotenv.config();

// @ts-ignore
import yws from 'y-websocket/bin/utils';
import { createServer } from "http"

const app = express();
app.use(cors());

const httpServer = createServer(app);

app.get("/", (req, res) => {
    res.send("Woking fine !!")
})

const wss = new WebSocketServer({ server : httpServer});

wss.on("connection", (ws , req) => {
    console.log("Connected to ws server");
      ws.send('hi');

    yws.setupWSConnection(ws, req); 
});

httpServer.listen(process.env.PORT, () => {
    console.log("listing to ", process.env.PORT);
})
