// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes

const app = express();

var profiles = [];
var maxGates = 4;

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:4200');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
  next();
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));

var io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {

  console.log('user connected');
  profiles = [];

  socket.on('disconnect', function() {
      console.log('user disconnected');
  });
});


app.get('*', (req, res) => {
    io.emit('profile', profiles);
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// APIs
app.post('/add', (req, res) => {
    var isExist = false;
    profiles.forEach(p => {
        if (p.gate_no === req.body.gate_no) {
            isExist = true;
            p.first_name = req.body.first_name;
            p.last_name = req.body.last_name;
            p.class = req.body.class;
            p.photo = req.body.photo;
            p.nfc_id = req.body.nfc_id;
            p.action = req.body.action;
            p.new = true;
            p.currentSec = 0;
        }
    });
    if (!isExist && req.body.gate_no <= maxGates) {
        var profile = req.body;
        profile.currentSec = 0;
        profile.new = true;
        profiles.push(profile);
    } else if (req.body.gate_no > maxGates) {
        res.send({
            success: false,
            message: 'Max gate number should be equal to or smaller than' + maxGates
        });
    }

    io.emit('profile', profiles);
    res.send('success');
});

var timer = setInterval(function() {
    var noUpdatedNum = 0;
    profiles.forEach((p, index) => {
        p.new = false;
        if (p.currentSec > 3) {
            noUpdatedNum ++;
        } else {
            p.currentSec ++;
        }
    });
    if (noUpdatedNum == profiles.length) {
        profiles = [];
        io.emit('profile', profiles);
        noUpdatedNum = 0;
    }
}, 1000);
