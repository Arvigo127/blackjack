/*const { EventEmitter } = require("events");
const { readFile, readFileSync } = require("fs");

const eventEmitter = new EventEmitter();
const fileText = readFileSync("./hello.txt", "utf-8");

readFile("./asap.txt", "utf-8", (err, txt) => {
    console.log(txt);
});

eventEmitter.on("lunch", () => {
    //callback function
    console.log(fileText);
})

eventEmitter.emit("lunch");
*/

const express = require("express");
const { readFile } = require('fs');

const app = express();

app.use(express.static("./public"));

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

app.listen(3000, () => console.log("App available"));
