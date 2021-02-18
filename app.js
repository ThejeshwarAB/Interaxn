const express = require("express");
const app = express()

const mongodb = require("mongodb");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");

const multer = require("multer");
const crypto = require("crypto");

const upload = require('express-fileupload');
const gridfs = require('gridfs-stream');
const fs = require('fs');

const port = 3000 || process.env.port;

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

app.use(upload());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname,'index.html'));
    res.render("index", { author: "ThejeshwarAB©" });
})

// mongoose.connect('mongodb://localhost:27017/interaxn')

var db = 'mongodb://localhost:27017/interaxn';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb://localhost:27017/interaxn');
mongoose.Promise = global.Promise;

gridfs.mongo = mongoose.mongo;
/*
  Check MongoDB connection
*/
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', () => {

    var gfs = gridfs(connection.db);

    // Upload a file from local file-system to MongoDB
    app.post('/api/file/upload', (req, res) => {

        if (req.files) {
            console.log(req.files)
        }

        var file = req.files.filename;
        var filename = file.name;

        file.mv('./uploads/' + filename, function (err) {
            if (err)
                console.log(err);

        })

        var writestream = gfs.createWriteStream({ filename: req.body.random });
        fs.createReadStream(__dirname + '/uploads/' + filename).pipe(writestream);
        // fs.unlink(__dirname+'/uploads/'+filename,(err)=>{
        //     if(err)
        //     console.log(err)
        //     else
        //     return
        // })
        writestream.on('close', (file) => {
            // fs.unlink(__dirname+'/uploads/'+filename)
            console.log(file);
            res.redirect("/")
        });
    });


// Download a file from MongoDB - then save to local file-system
app.post('/api/file/download', (req, res) => {
    // Check file exist on MongoDB

    var filename = req.query.filename;

    gfs.exist({ filename: req.body.random }, (err, file) => {
        if (err || !file) {
            res.redirect("/");
        }

        var readstream = gfs.createReadStream({ filename: req.body.random });
        // gfs.remove({ filename: req.body.random }, (err) => {
        //     if (err) res.status(500).send(err);
        //     // res.redirect("/");
        // });
        readstream.pipe(res);
    });
});

app.post('/api/file/delete', (req, res) => {

    var filename = req.query.filename;

    gfs.exist({ filename: req.body.random }, (err, file) => {
        if (err || !file) {
            res.render;
            res.redirect("/");
        }

        gfs.remove({ filename: req.body.random }, (err) => {
            if (err) res.status(500).send(err);
            res.redirect("/");
        });
    });
});

// app.post('/api/file/meta', (req, res) => {

//     // var filename = req.query.filename;

//     gfs.exist({ filename: req.body.random }, (err, file) => {
//         if (err || !file) {
//             res.render("index", { author: "ThejeshwarAB©", message: "File not found!" });
//             return;
//         }

//         gfs.files.find({ filename: req.body.random }).toArray((err, files) => {
//             if (err) res.send(err);
//             res.json(files);
//         });
//     });

// })
})
