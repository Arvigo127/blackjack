const express = require("express");
const { readFile } = require('fs');
const expressWS = require('express-ws');
const http = require('http');

const app = express();

app.use(express.static("./public"));
app.use(express.static("./f"));

let server = http.createServer(app).listen(3000);

expressWS(app, server);

app.get('/', (request, response) => {
    console.log("New request from ", request.ip);
    readFile("./public/index.html", "utf-8", (err, html) => {
        if(err) {
            response.status(500).send("Out of order");
            console.log(err);
        }
        response.send(html);
    });
});

app.get('/test', (request, response) => {
    readFile("./f/test.html", "utf-8", (err, html) => {
        if(err) {
            response.status(500).send('out of order');
            console.log(err);
        }
        response.send(html);
    })
})

app.ws('/ws', function(ws, req) {
    ws.on("message", function(msg) {
        console.log(msg);
        ws.send("hey lady");
    });
    
});



