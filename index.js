const express = require("express");
const { readFile } = require('fs');
const expressWS = require('express-ws');
const http = require('http');

const app = express();

app.use(express.static("./public"));
let server = http.createServer(app).listen(3000);

expressWS(app, server);

app.get('/', (request, response) => {
    console.log("New request from ", request.ip);
    readFile("./frontend/html/index.html", "utf-8", (err, html) => {
        if(err) {
            response.status(500).send("Out of order");
            console.log(err);
        }
        response.send(html);
    });
});

app.ws('/ws', async function(ws, req) {
    ws.on("message", async function(msg) {
        console.log(msg);
    });
});



