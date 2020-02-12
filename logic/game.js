"use strict";
exports.__esModule = true;
var io;
var games = [];
;
var Game = /** @class */ (function () {
    function Game(host, room, words, max_rounds) {
        this.lobby = function () {
            console.log('test');
            /*
                TODO:
                - start game when host clicks start button
            */
        };
        this.startGame = function () {
            console.log('Starting game');
            console.log('Starting game');
            console.log('Starting game');
            console.log('Starting game');
            console.log('Starting game');
            console.log('Starting game');
            /*
                TODO:
                - set player_turns (randomize all of the game's players into the array)
                - set status to active
                - run start round
            */
        };
        this.status = "lobby";
        this.host = host;
        this.room = room;
        this.round_length = 60;
        this.max_players = 2;
        this.players = [];
        //this.players.push(host);
        this.words = words;
        this.words_used = [];
        this.max_rounds = max_rounds;
        this.current_round = -1;
        this.lobby();
        this.test = function () {
            return 'test';
        };
    }
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
exports.Game = Game;
function SiteLogic(server) {
    io = require('socket.io')(server);
    var onlineUsers = [];
    /**
     * Finds game using room id
     * Joins user to the game room.
     * Updates the game's players with the new player (user)
     * @param user
     * @param game
     * @param socket
     */
    var joinGame = function (user, room, socket) {
        console.log('attempting to join game with roomid: ' + room);
        var game = findGame(room);
        if (!game) {
            console.error("Game not found with room ID: " + room);
            return;
        }
        // Check if socket is already in the game. If it is, then update that player
        var playerFound;
        game.players.forEach(function (player, index) {
            if (player.id == socket.id) {
                playerFound == player;
                game.players[index] = user;
            }
        });
        if (!playerFound) {
            console.log('Player not found');
            game.players.push(user);
        }
        socket.join(game.room);
        socket.emit('game joined', game);
        console.log(socket.id + " has joined room " + game.room);
    };
    /**
     * Creates a new Game (currently with preset settings)
     * Adds Game to the array games[]
     * @param user
     * @returns game
     */
    var createNewGame = function (user) {
        var roomId = Math.floor(Math.random() * 10000);
        var NEW_GAME = new Game(user, roomId.toString(), ["word", "word 2", "word 3"], 10);
        console.log(NEW_GAME);
        NEW_GAME.startGame();
        games.push(NEW_GAME);
        return NEW_GAME;
    };
    var createGameSocket = function (socket) {
        socket.on('create room', function (user) {
            var NEW_GAME = createNewGame(user);
            joinGame(user, NEW_GAME.room, socket);
        });
    };
    var joinGameSocket = function (socket) {
        socket.on('join game', function (obj) {
            joinGame(obj.user, obj.roomId, socket);
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
        socket.on('joined lobby', function (roomId) {
            var GAME_FOUND = findGame(roomId);
            console.log('Searching for game with ID: ' + roomId);
            console.log('lobby found', GAME_FOUND);
            if (GAME_FOUND) {
                io["in"](roomId).emit('game info', GAME_FOUND);
                //socket.emit('game info', lobby);
            }
        });
    };
    var startGameSocket = function (socket) {
        socket.on('start game', function (clientGameInfo) {
            console.log(socket.id + ' is trying to start their game');
            if (socketInGame(socket, clientGameInfo)) {
                var realGame = findGame(clientGameInfo.room);
                realGame.startGame();
            }
            else {
                console.error(socket.id + ' is attempting to start a game they are not in (with ID ' + clientGameInfo.room + ')');
            }
        });
    };
    var chatMessageSocket = function (socket) {
        socket.on('send message', function (obj) {
            io["in"](Object.keys(socket.rooms)[0]).emit('receive message', {
                message: obj.message,
                nickname: socket.nickname
            });
        });
    };
    var handleDisconnect = function (socketId) {
        games.forEach(function (game) {
            game.players = game.players.filter(function (player) {
                if (player.id !== socketId) {
                    return true;
                }
                return false;
            });
            io["in"](game.room).emit('game info', game);
        });
    };
    function socketInGame(socket, game) {
        //TODO: A much more efficient way of doing this is just loop through the socket's rooms and check if room id is in there
        var userFound = null;
        game.players.forEach(function (player) {
            if (player.id == socket.id)
                userFound = player;
        });
        return userFound;
    }
    function findGame(roomId) {
        var gameFound = null;
        games.forEach(function (game) {
            if (game.room === roomId)
                gameFound = game;
        });
        return gameFound;
    }
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
        socket.emit('sendId', socket.id);
        socket.on('disconnect', function (_) { return handleDisconnect(socket.id); });
        joinGameSocket(socket);
        createGameSocket(socket);
        updateNicknameSocket(socket);
        console.log(socket.id + ' has connected');
        updateCanvasSocket(socket);
        getLobbyInfoSocket(socket);
        startGameSocket(socket);
        chatMessageSocket(socket);
    });
}
exports["default"] = SiteLogic;
module.exports.Game = SiteLogic;
