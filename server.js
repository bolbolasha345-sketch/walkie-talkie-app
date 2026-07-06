const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, 'www')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('مستخدم متصل: ' + socket.id);
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    });
    socket.on('audio-stream', (data, roomId) => {
        if (roomId) {
            socket.to(roomId).emit('audio-stream', data);
        } else {
            socket.broadcast.emit('audio-stream', data);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(process.env.PORT || PORT, () => {
    console.log(`السيرفر شغال على المنفذ ${PORT}`);
});
