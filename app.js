const express = require("express");
const app = express()

const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");

const multer = require("multer");
const crypto = require("crypto");

const gridfs = require('gridfs-stream');
const fs = require('fs');

const port = 3000 || process.env.port

const path = require("path");
const bodyParser = require("body-parser");

app.listen(port, (err) => {
    if (err)
        throw err;
    else
        console.log("Server is running at: " + port)
})

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static('assets'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname,'index.html'));
    res.render("index", { author: "ThejeshwarAB©" })
})
