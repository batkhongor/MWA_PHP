require("dotenv").config();
require("./api/data/db.js");

const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const routes= require("./api/routes");


let portNumber = process.env.PORT;
let startMsg = process.env.START_MSG;

const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

app.use("/api", routes);

const server = app.listen(portNumber, function(){
    let port = server.address().port;
    console.log(startMsg+port);
});