"use strict";
exports.__esModule = true;
function Game(server) {
    var io = require('socket.io')(server);
    var onlineUsers = [];
    var rooms = [];
    function updateOnlineUsers(user) {
        var userFound = null;
        console.log(onlineUsers);
        onlineUsers.forEach(function (onlineUser, index) {
            if (typeof onlineUser != "undefined") {
                if (onlineUser.id === user.id) {
                    onlineUsers[index] = user;
                    userFound = true;
                    console.log('Updated user: ' + user.nickname);
                }
            }
            else {
                console.log('User iterated is undefined');
            }
        });
        if (!userFound)
            onlineUsers.push(user);
    }
    io.on('connection', function (socket) {
        socket.on('join room', function (obj) {
            socket.join(obj.roomId);
            console.log(socket.id + " joined room " + obj.roomId);
            socket.emit('room joined', obj.roomId);
            // TODO: loop through users, if user is not found, then add user
            // If user is found, then update room on user to obj.roomId
            // Do this one create room as well
            //FIXME:
            //updateOnlineUsers(obj.user);
            console.log('online users:', onlineUsers);
        });
        /* Maybe give room id on socket emit room joined */
        socket.on('create room', function (user) {
            var roomId = Math.floor(Math.random() * 10000);
            rooms.push({
                id: roomId,
                players: []
            });
            socket.join(roomId);
            console.log(socket.id + " has joined room " + roomId);
            socket.emit('room joined', roomId);
            //FIXME:
            //updateOnlineUsers(user);
        });
        socket.on('send-nickname', function (nickname) {
            socket.nickname = nickname;
        });
        console.log('a user connected');
        socket.on('updateCanvas', function (obj) {
            console.log(obj.room);
            if (obj) {
                socket.to(obj.room).emit('updateAllCanvases', {
                    data: obj.data
                });
            }
            /* io.emit('updateAllCanvases', {
            id: obj.id,
            data: obj.data
            }); */
        });
    });
}
exports["default"] = Game;
module.exports.Game = Game;
