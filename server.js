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
const users = [
    { id: `Anna-${Math.floor((Math.random() * 100) + 1)}`, role: 'customer', fullName: 'Anna Karapetyan' },
    { id: `Marry-${Math.floor((Math.random() * 100) + 1)}`, role: 'customer', fullName: 'Marry Ohanyan' },
    { id: `Lilith-${Math.floor((Math.random() * 100) + 1)}`, role: 'seller', fullName: 'Lilith Papoyan' },
    { id: `Karen-${Math.floor((Math.random() * 100) + 1)}`, role: 'customer', fullName: 'Karen Simonyan' },
    { id: `David-${Math.floor((Math.random() * 100) + 1)}`, role: 'seller', fullName: 'David Aghayan' },
];

io.on('connection', (socket) => {
    let senderId = socket.handshake.query.id;
    console.log('current user id(senderId): ', senderId);
    addUser(senderId, socket.id);

    // Broadcast for all connections
    socket.broadcast.emit('user-list', [...userList.keys()]);

    // Only for current connection
    socket.emit('user-list', [...userList.keys()]);

    socket.on('message', (msg) => {
        socket.broadcast.emit('message-broadcast', { message: msg, senderId: senderId, recipientId: users[1].id });
    });

    socket.on('disconnect', (reason) => {
        removeUser(senderId, socket.id);
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
