"use strict";
exports.__esModule = true;
var io;
var games = [];
;
var Game = /** @class */ (function () {
    function Game(host, room, words, max_rounds) {
        this.host = host;
        this.room = room;
        this.round_length = 60;
        this.max_players = 2;
        this.players = [];
        this.players.push(host);
        this.words = words;
        this.words_used = [];
        this.max_rounds = max_rounds;
        this.current_round = -1;
    }
    Game.prototype.lobby = function () {
        /*
            TODO:
            - start get when host clicks start button
        */
    };
    Game.prototype.startGame = function () {
        /*
            TODO:
            - set player_turns (randomize all of the game's players into the array)
            - run start round
        */
    };
    Game.prototype.startRound = function () {
        /*
            TODO:
            - clear board
            - update current round
            - update artist (if round == 0 then choose a random player. else: go to next User in this.player_turns)
            - update current word
        */
    };
    Game.prototype.endRound = function () {
        /*
            TODO:
            - give points to users
            - start new round
        */
    };
    Game.prototype.updateCurrentRound = function () {
        /*
            TODO:
            - if this.current_round + 1 > max_round, then end the game. else: increase the current_round by one
        */
    };
    Game.prototype.clearBoards = function () {
        /*
            TODO:
            - clear the boards of each player in this room
        */
    };
    Game.prototype.updateWord = function () {
        /*
            TODO:
            - choose a random word from this.words, make sure it hasn't be chosen before (not in this.used_words)
        */
    };
    Game.prototype.updateArtist = function () {
        /*
            TODO:
            - decide who the new artist is (if round == 0 then choose a random player. else: go to next User in this.player_turns)
            - only allow artist to be able to draw
            - artist no longer can type in chat
        */
    };
    Game.prototype.endGame = function () {
        /*
            TODO:
            - show results
            - maybe redirect all users to Home
        */
    };
    return Game;
}());
function SiteLogic(server) {
    io = require('socket.io')(server);
    var onlineUsers = [];
    var rooms = [];
    var createGameSocket = function (socket) {
        socket.on('create room', function (user) {
            var roomId = Math.floor(Math.random() * 10000);
            rooms.push({
                id: roomId,
                players: []
            });
            console.log('??: ' + roomId);
            games.push(new Game(user, roomId, ["a", "b", "c"], 10)); //? host, room, words, max_rounds
            console.log(games);
            socket.join(roomId);
            console.log(socket.id + " has joined room " + roomId);
            socket.emit('room joined', roomId);
            //FIXME:
            //updateOnlineUsers(user);
        });
    };
    var joinGameSocket = function (socket) {
        socket.on('join room', function (obj) {
            var roomFound = false;
            games.forEach(function (game) {
                if (game.room == obj.roomId) {
                    roomFound = true;
                    socket.join(obj.roomId);
                    console.log(socket.id + " joined room " + obj.roomId);
                    socket.emit('room joined', obj.roomId);
                }
            });
            if (!roomFound) {
                console.log('room not found', obj.roomId);
                socket.emit('room joined', null);
            }
            // TODO: loop through users, if user is not found, then add user
            // If user is found, then update room on user to obj.roomId
            // Do this one create room as well
            //FIXME:
            //updateOnlineUsers(obj.user);
        });
    };
    var updateNicknameSocket = function (socket) {
        socket.on('send-nickname', function (nickname) {
            socket.nickname = nickname;
        });
    };
    var updateCanvasSocket = function (socket) {
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
    };
    var getLobbyInfoSocket = function (socket) {
        socket.on('joined lobby', function () {
            socket.emit('lobby info', {
                players: ["a", "b"]
            });
        });
    };
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
        joinGameSocket(socket);
        createGameSocket(socket);
        updateNicknameSocket(socket);
        console.log(socket.id + ' has connected');
        updateCanvasSocket(socket);
        getLobbyInfoSocket(socket);
    });
}
exports["default"] = SiteLogic;
module.exports.Game = SiteLogic;
