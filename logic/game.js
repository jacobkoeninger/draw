"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var util = require('util');
var setTimeoutPromise = util.promisify(setTimeout);
var io;
var games = [];
;
var NOTIFICATION;
(function (NOTIFICATION) {
    NOTIFICATION["WARNING"] = "warning";
    NOTIFICATION["INFO"] = "info";
    NOTIFICATION["ERROR"] = "error";
    NOTIFICATION["SUCCESS"] = "success";
})(NOTIFICATION || (NOTIFICATION = {}));
function notifySocket(type, message, description, socketId) {
    io.to(socketId).emit('notification', {
        type: type,
        message: message,
        description: description
    });
}
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "active";
    STATUS["LOBBY"] = "lobby";
    STATUS["ENDED"] = "ended";
})(STATUS || (STATUS = {}));
var Game = /** @class */ (function () {
    function Game(host, room, words, max_rounds, max_players, round_length, isPrivate) {
        var _this = this;
        this.lobby = function () {
            console.log('Private: ' + _this.isPrivate);
        };
        this.startGame = function () {
            console.log('Starting game: ' + _this.room);
            _this.players.forEach(function (player) { return player.points = 0; });
            if (_this.status === STATUS.ACTIVE) {
                notifySocket(NOTIFICATION.ERROR, "Game is already active", "", _this.host.id);
                return;
            }
            if (_this.players.length < 2) {
                notifySocket(NOTIFICATION.ERROR, 'Unable to start game', 'Not enough players. At least 2 players needed', _this.host.id);
                return;
            }
            _this.player_turns = (function () {
                var players = _this.players;
                return players.sort(function () { return Math.random() - 0.5; });
            })();
            _this.status = STATUS.ACTIVE;
            _this.startRound();
        };
        this.updateCorrectPlayers = function (player) {
            var guesser_award = Math.floor(100 / _this.correct_players.length);
            player.points += guesser_award;
            notifySocket(NOTIFICATION.SUCCESS, "You've received " + guesser_award.toString() + " points!", "", player.id);
            //TODO: award points to the artist.. maybe based off the time when the guess happened (faster = more points)
            if (_this.correct_players.length == _this.players.length - 1) {
                //this.endRound();
                //? FIXME: cancel timer so that the rounds ends immediately when all users guessed correctly before the timer ran out 
                //this.timer.cancel(); 
                clearTimeout(_this.timer); // doesn't work
            }
            _this.correct_players.push(player);
            _this.updateClients();
        };
        this.startRound = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.status === STATUS.ACTIVE)) return [3 /*break*/, 2];
                        this.clearBoards();
                        this.updateCurrentRound();
                        this.updateArtist();
                        this.updateWord();
                        this.correct_players = [];
                        this.updateClients();
                        console.log('Starting round: ' + this.current_round);
                        io["in"](this.room).emit('round started', this.round_length);
                        _a = this;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.round_length); })];
                    case 1:
                        _a.timer = _b.sent(); // sleep 
                        this.endRound();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        this.status = STATUS.LOBBY;
        this.isPrivate = isPrivate;
        this.host = host;
        this.room = room;
        this.round_length = round_length * 1000;
        this.max_players = max_players;
        this.players = [];
        this.words = words;
        this.words_used = [];
        this.max_rounds = max_rounds;
        this.current_round = 0;
        this.lobby();
    }
    Game.prototype.endRound = function () {
        var _this = this;
        this.correct_players.forEach(function (player) {
            io["in"](_this.room).emit('receive message', {
                message: player.nickname + " - " + player.points,
                nickname: "[Game]"
            });
        });
        console.log('Round has ended');
        this.startRound();
    };
    Game.prototype.updateCurrentRound = function () {
        if ((this.current_round + 1) > this.max_rounds) {
            this.endGame();
        }
        else {
            this.current_round = this.current_round + 1;
        }
    };
    Game.prototype.updateWord = function () {
        this.current_word = this.words[Math.floor(Math.random() * this.words.length)];
    };
    Game.prototype.updateArtist = function () {
        if (this.current_artist) {
            var currentArtistIndex = this.player_turns.indexOf(this.current_artist);
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
        notifySocket(NOTIFICATION.INFO, "It's your turn to draw!", "", this.current_artist.id);
    };
    Game.prototype.endGame = function () {
        console.log('Game has ended');
        this.status = STATUS.ENDED;
        this.players.forEach(function (player) { return notifySocket(NOTIFICATION.INFO, 'Game over!', 'The game has ended. Returning home.', player.id); });
        this.updateClients();
        // Remove game from games array
        games.splice(games.indexOf(this), 1);
        io.emit('active games', games.length);
    };
    Game.prototype.clearBoards = function () {
        io["in"](this.room).emit('clear boards');
    };
    Game.prototype.updateClients = function () {
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
            status: this.status,
            correct_players: this.correct_players
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
            notifySocket(NOTIFICATION.ERROR, 'Unable to join game', "Game not found with id \"" + room + "\".", socket.id);
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
    function getUniqueRoomId() {
        // Recursively generate ids until one is created that is not taken
        var id;
        function getRandomId() {
            var roomId = Math.floor(Math.random() * 50000);
            games.forEach(function (game) {
                if (game.room === roomId.toString()) {
                    getRandomId();
                }
            });
            id = roomId.toString();
        }
        getRandomId();
        return id;
    }
    /**
     * Creates a new Game (currently with preset settings)
     * Adds Game to the array games[]
     * @param user
     * @returns game
     */
    var createGameSocket = function (socket) {
        socket.on('create game', function (obj) {
            var roomId = getUniqueRoomId();
            var NEW_GAME = new Game(obj.user, roomId.toString(), ["critic", "crop", "cross", "crowd", "crown", "cruel", "crush", "cry", "cultivate", "cultivation", "cultivator", "cup", "cupboard", "cure", "curious", "curl", "current", "curse", "curtain", "curve", "cushion", "custom", "customary", "customer", "cut", "daily", "damage", "damp", "dance", "danger", "dare", "dark", "darken", "date", "daughter", "day", "daylight", "dead", "deaf", "deafen", "deal", "dear", "death", "debt", "decay", "deceit", "deceive", "decide", "decision", "decisive", "declare", "decrease", "deed", "deep", "deepen", "deer", "defeat", "defend", "defendant", "defense", "degree", "delay", "delicate", "delight", "deliver", "delivery", "demand", "department", "depend", "dependence", "dependent", "depth", "descend", "descendant", "descent", "describe", "description", "desert", "deserve", "desire", "desk", "despair", "destroy", "destruction", "destructive", "detail", "determine", "develop", "devil", "diamond", "dictionary", "die", "difference", "different", "difficult", "difficulty", "dig", "dine", "dinner", "dip", "direct", "direction", "director", "dirt", "disagree", "disappear", "disappearance", "disappoint", "disapprove", "discipline", "discomfort", "discontent", "discover", "discovery", "discuss", "discussion", "disease", "disgust", "dish", "dismiss", "disregard", "disrespect", "dissatisfaction", "dissatisfy", "distance", "distant", "distinguish", "district", "disturb", "ditch", "dive", "divide", "division", "do", "doctor", "dog", "dollar", "donkey", "door", "dot", "double", "doubt", "down", "dozen", "drag", "draw", "drawer", "dream", "dress", "drink", "drive", "drop", "drown", "drum", "dry", "duck", "due", "dull", "during", "dust", "duty", "each", "eager", "ear", "early", "earn", "earnest", "earth", "ease", "east", "eastern", "easy", "eat", "edge", "educate", "education", "educator", "effect", "effective", "efficiency", "efficient", "effort", "egg", "either", "elastic", "elder", "elect", "election", "electric", "electrician", "elephant", "else", "elsewhere",], obj.max_rounds, obj.max_players, obj.round_length, obj.isPrivate);
            games.push(NEW_GAME);
            joinGame(obj.user, NEW_GAME.room, socket);
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
            console.log(obj.room + " is being painted");
            if (obj) {
                socket.to(obj.room).emit('updateAllCanvases', {
                    data: obj.data
                });
            }
        });
    };
    var getLobbyInfoSocket = function (socket) {
        socket.on('joined lobby', function (roomId) {
            var GAME_FOUND = findGame(roomId);
            if (GAME_FOUND) {
                if (GAME_FOUND.host.id !== socket.id) {
                    notifySocket(NOTIFICATION.INFO, "[" + socket.nickname + "] has joined your lobby", '', GAME_FOUND.host.id);
                }
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
                    console.log(socket.id + " is not host");
                }
            }
            else {
                notifySocket(NOTIFICATION.ERROR, 'Unable to start game.', 'Please refresh and try again.', socket.id);
                //console.error(socket.id + ' is attempting to start a game they are not in (with ID ' + clientGameInfo.room + ')');
            }
        });
    };
    function findPlayerBySocketId(arr, socketId) {
        var playerFound = null;
        arr.forEach(function (player) {
            if (player.id == socketId) {
                playerFound = player;
            }
        });
        return playerFound;
    }
    var chatMessageSocket = function (socket) {
        socket.on('send message', function (obj) {
            var realGame = findGame(obj.room);
            if (realGame) {
                var playerFound = findPlayerBySocketId(realGame.players, socket.id);
                if (!((realGame.current_artist) && realGame.current_artist.id === socket.id && realGame.status === STATUS.ACTIVE)) {
                    if (realGame.status === STATUS.ACTIVE && obj.message.toLowerCase() === realGame.current_word.toLowerCase()) {
                        if (realGame.status === STATUS.ACTIVE) {
                            var correctPlayerFound = findPlayerBySocketId(realGame.correct_players, socket.id);
                            if (playerFound) {
                                if (!correctPlayerFound) {
                                    io["in"](obj.room).emit('receive message', {
                                        message: socket.nickname + " guessed the word!",
                                        nickname: "[Game]"
                                    });
                                    //FIXME: emit notification to user telling them how many points they received for guessing the word
                                    realGame.updateCorrectPlayers(playerFound);
                                }
                            }
                        }
                    }
                    else {
                        if (obj.message != "") {
                            io["in"](obj.room).emit('receive message', {
                                message: obj.message,
                                nickname: socket.nickname
                            });
                        }
                        else {
                            notifySocket(NOTIFICATION.ERROR, 'Action not allowed', 'Message cannot not be blank.', socket.id);
                        }
                    }
                }
                else {
                    notifySocket(NOTIFICATION.ERROR, 'Action not allowed', 'The artist cannot send messages.', playerFound.id);
                }
            }
        });
    };
    function kickPlayer(game, socketId) {
        game.players = game.players.filter(function (player) {
            if (player.id !== socketId) {
                return true;
            }
            return false;
        });
    }
    var handleDisconnect = function (socketId) {
        // FIXME: Only update the game the user was connected to
        games.forEach(function (game) {
            game.players.forEach(function (player) {
                if (player.id === socketId) {
                    kickPlayer(game, socketId);
                    io["in"](game.room).emit('game info', game);
                    if (game.players.length < 2 && game.status == STATUS.ACTIVE) {
                        game.endGame();
                    }
                    else if (game.players.length < 1) {
                        game.endGame();
                    }
                }
            });
        });
        /* games.forEach((game) => {
            
            if(game.players.length < 2 && game.status === STATUS.ACTIVE){
                game.endGame();
            }
            io.in(game.room).emit('game info', game);
        }); */
    };
    function socketInGame(socket, game) {
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
        socket.score = 0;
        socket.emit('sendId', socket.id);
        socket.emit('active games', games.length);
        socket.on('disconnect', function (_) { return handleDisconnect(socket.id); });
        joinGameSocket(socket);
        createGameSocket(socket);
        updateNicknameSocket(socket);
        console.log(socket.id + " has connected");
        updateCanvasSocket(socket);
        getLobbyInfoSocket(socket);
        startGameSocket(socket);
        chatMessageSocket(socket);
        requestWordSocket(socket);
    });
}
exports["default"] = SiteLogic;
module.exports.Game = SiteLogic;
