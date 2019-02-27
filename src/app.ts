import * as express from 'express';
import * as path from 'path';
import sio = require('socket.io');
import http = require('http');

let sockets = [];

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'game')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/game/index.html');
});

const server = http.createServer(app);
const io = sio(server);

io.on('connection', (socket) => {
    if (!sockets[0]) {
        sockets[0] = socket.id;
        socket.emit('playerNumber', 1);
        console.log('playernumber')
    } else if (!sockets[1]) {
        sockets[1] = socket.id;
        socket.emit('playerNumber', 2);
        console.log('playernumber')
    } else {
        socket.emit('playerNumber', 3);
    }
    console.log(sockets);
    // Handle an ArrowKey event
    console.log('a user connected');
    socket.on('PaddleMove', function (msg) {
        socket.broadcast.emit('PaddleMove', msg);
    });

    socket.on('BallMove', function(msg){
        if(sockets[0] === socket.id){
            socket.broadcast.emit('BallMove', msg);
        }
    });

    socket.on('points', function(msg){
        if(sockets[0] === socket.id){
            socket.broadcast.emit('points', msg);
        }
    })

    socket.on('disconnect', function(){
        if(sockets[0] === socket.id){
            sockets[0] = null;
        }else if(sockets[1] === socket.id){
            sockets[1] = null;
        }
        console.log(sockets);
        console.log('user disconnected');
        
    });
});

const port = 8081;
server.listen(port, () => console.log(`Server is listening on port ${port}...`));