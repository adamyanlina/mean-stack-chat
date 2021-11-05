const cors = require('cors');
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.send('Hi');
});

let userList = new Map();

io.on('connection', (socket) => {
    let userName = socket.handshake.query.userName;
    addUser(userName, socket.id);

    // Broadcast for all connections
    socket.broadcast.emit('user-list', [...userList.keys()]);

    // Only for current connection
    socket.emit('user-list', [...userList.keys()]);

    socket.on('message', (msg) => {
        socket.broadcast.emit('message-broadcast', { message: msg, userName: userName });
    });
    socket.on('disconnect', (reason) => {
        removeUser(userName, socket.id);
    });
});

function addUser(userName, id) {
    if (!userList.has(userName)) {
        userList.set(userName, new Set(id));
    } else {
        userList.get(userName).add(id);
    }
}

function removeUser(userName, id) {
    if (userList.has(userName)) {
        let userIds = userList.get(userName);
        if (userIds.size === 0) {
            userList.delete(userName);
        }
    }
}

http.listen(3000, () => console.log('Server is running on port 3000'));
