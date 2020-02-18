"use strict";
exports.__esModule = true;
var io;
var games = [];
;
var Game = /** @class */ (function () {
    function Game(host, room, words, max_rounds) {
        var _this = this;
        this.lobby = function () {
            /*
                TODO:
                - start game when host clicks start button
            */
        };
        this.startGame = function () {
            console.log('Starting game: ' + _this.room);
            /*
                TODO:
                - set status to active
                - set player_turns (randomize all of the game's players into the array)
                - run start round
                - make sure there are at least 2 players
            */
            if (_this.status === "active") {
                console.error('Game is already active');
                return;
            }
            if (_this.players.length < 2) {
                console.error('Not enough players');
                return; //TODO: give error to user in flash message
            }
            _this.player_turns = (function () {
                var players = _this.players;
                return players.sort(function () { return Math.random() - 0.5; });
            })();
            _this.status = "active";
            _this.startRound();
        };
        this.status = "lobby";
        this.host = host;
        this.room = room;
        this.round_length = 60;
        this.max_players = 2;
        this.players = [];
        this.words = words;
        this.words_used = [];
        this.max_rounds = max_rounds;
        this.current_round = 0;
        this.lobby();
    }
    Game.prototype.startRound = function () {
        /*
            TODO:
            - clear board
        */
        this.clearBoards();
        this.updateCurrentRound();
        this.updateArtist();
        this.updateWord();
        this.updateClients();
    };
    Game.prototype.endRound = function () {
        /*
            TODO:
            - give points to users
            - start new round
        */
        console.log('Round has ended');
    };
    Game.prototype.updateCurrentRound = function () {
        /*
            TODO:
            - if this.current_round + 1 > max_round, then end the game. else: increase the current_round by one
        */
        if ((this.current_round + 1) > this.max_rounds) {
            this.endGame();
        }
        else {
            this.current_round = this.current_round + 1;
        }
    };
    Game.prototype.updateWord = function () {
        /*
            TODO:
            - choose a random word from this.words
            - make sure it hasn't be chosen before (not in this.used_words)
        */
        //this.current_word = this.words[Math.floor(Math.random() * this.words.length)]; 
        this.current_word = "Test";
    };
    Game.prototype.updateArtist = function () {
        /*
            TODO:
            - only allow artist to be able to draw
            - artist no longer can type in chat
            - give only artist the current word
        */
        if (this.current_artist) {
            var currentArtistIndex = this.player_turns.indexOf(this.current_artist); // FIXME: make sure this works
            if (this.player_turns[currentArtistIndex + 1]) {
                this.current_artist = this.player_turns[currentArtistIndex + 1];
            }
            else {
                this.current_artist = this.player_turns[0];
            }
        }
        else {
            this.current_artist = this.player_turns[0];
        }
        console.log('Current artist: ' + this.current_artist.nickname);
    };
    Game.prototype.endGame = function () {
        /*
            TODO:
            - show results
            - maybe redirect all users to Home
        */
        console.log('Game has ended');
        this.status = "ended";
        this.updateClients();
    };
    Game.prototype.clearBoards = function () {
        io["in"](this.room).emit('clear boards');
    };
    Game.prototype.updateClients = function () {
        console.log('updateClients');
        //TODO: exclude current word from this 
        io["in"](this.room).emit('game info', {
            current_artist: this.current_artist,
            current_round: this.current_round,
            host: this.host,
            max_players: this.max_players,
            max_rounds: this.max_rounds,
            player_turns: this.player_turns,
            players: this.players,
            room: this.room,
            round_length: this.round_length,
            status: this.status
        });
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
        var game = findGame(room);
        if (!game) {
            console.error("Game not found with room ID: " + room);
            // TODO: tell user game was not found with flash message
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
        // Add player if they are not already in the game
        if (!playerFound) {
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
            console.log(obj.room + ' is being painted');
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
            if (GAME_FOUND) {
                io["in"](roomId).emit('game info', GAME_FOUND);
                //socket.emit('game info', lobby);
            }
        });
    };
    var startGameSocket = function (socket) {
        socket.on('start game', function (clientGameInfo) {
            if (socketInGame(socket, clientGameInfo)) {
                var realGame = findGame(clientGameInfo.room);
                if (socket.id === realGame.host.id) {
                    realGame.startGame();
                }
                else {
                    console.log(socket.id + ' is not host');
                }
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
            if (game.players.length < 2) {
                game.endGame();
            }
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
    var requestWordSocket = function (socket) {
        socket.on('request word', function (game) {
            var realGame = findGame(game.room);
            if (realGame.current_artist) {
                if (realGame.current_artist.id == socket.id) {
                    socket.emit('get word', realGame.current_word);
                }
                else {
                    socket.emit('get word', null);
                }
            }
        });
    };
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
        requestWordSocket(socket);
    });
}
exports["default"] = SiteLogic;
module.exports.Game = SiteLogic;
