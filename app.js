const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
let mysql = require('mysql');

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(__dirname + '/'))

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

con.connect(function(error) {
  if (error) throw error;
  console.log("Connected to db!");
  con.query('CREATE DATABASE IF NOT EXISTS `grid`', function (error, _, _) {
    if (error) throw error;
  });
  con.query('USE `grid`', function (error, _, _) {
    if (error) throw error;
  });
  con.query('CREATE TABLE IF NOT EXISTS scores(`id` INT NOT NULL AUTO_INCREMENT,`nick` VARCHAR(50) NOT NULL,`score` DOUBLE NOT NULL, PRIMARY KEY(id))', function (error, _, _) {
    if (error) throw error;
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/add-score', function(req, res) {
  con.query('INSERT INTO `scores`(`nick`, `score`) VALUES("'+req.body.nick+'", '+req.body.score+')', function (error, results, fields) {
    if (error) throw error;
    console.log("Added score of "+req.body.nick+"("+req.body.score+")");
  })
  res.send('Added score');
});


const server = http.createServer(app);

server.listen(port, (err) => {
    if (err) {
        return console.log('something went wrong');
    }
})