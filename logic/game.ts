const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
import { Socket } from "dgram";

var io;

let games: Array<Game> = [];

interface User {
    room: string;
    nickname: string;
    id: string;
};




export class Game {
    
    /* 
        TODO:
        - make sure all user's rooms are updated to this.room
        - make sure to store this game in an array somewhere
        - handle disconnecting
        - handle users trying to connect mid game (maybe make this an option the host can set to allow)

        Ideas:
        - Setting for have X amount of guesses allotedd per round?
        */
    public timer;
    public host: User; // user obj
    public room: string;
    public status: string;
    public round_length: number; // in ms
    public max_rounds: number;
    public max_players: number;
    public players: Array<User>;
    public words: Array<string>;
    public words_used: Array<string>;

    public correct_players: Array<User>;
    
    public current_round: number;
    public current_artist: User;
    public current_word: string;

    public player_turns: Array<User>;

    constructor(host: User, room: string, words: Array<string>, max_rounds: number){
        this.status = "lobby";
        this.host = host;
        this.room = room;
        this.round_length = 15000;
        this.max_players = 2;
        this.players = [];
        this.words = words;
        this.words_used = [];
        this.max_rounds = max_rounds;
        this.current_round = 0;
        this.lobby();
    }   
    
    lobby = () => {

        

        /* 
            TODO:
            - start game when host clicks start button
        */
    }

    startGame = () => {
        console.log('Starting game: ' + this.room);
        /* 
            TODO:
            - set status to active
            - set player_turns (randomize all of the game's players into the array)
            - run start round
            - make sure there are at least 2 players
        */

        if (this.status === "active") {
            console.error('Game is already active');
            return;
        }
        if (this.players.length < 2) {
            console.error('Not enough players');
            return; //TODO: give error to user in flash message
        }

        this.player_turns = (() => {
            const players = this.players;            
            return players.sort(() => Math.random() - 0.5);
        })();
        
        this.status = "active";
        this.startRound();
    }

    updateCorrectPlayers = (player: User) => {
        this.correct_players.push(player);
        this.updateClients();
        
        if(this.correct_players.length == this.players.length - 1){
            //this.endRound();
            
            //? FIXME: cancel timer so that the rounds ends immediately when all users guessed correctly before the timer ran out 
            //this.timer.cancel(); 
            //clearTimeout(this.timer);
        }

    }

    endRound() {
        /* 
            TODO:
            - give points to users
            - start new round
        */

        console.log('Round has ended');
        //FIXME:

        this.startRound();

    }

    startRound = async () => {
        /* 
            TODO:
            - clear board
        */

        if(this.status == "active"){
            this.clearBoards();
            this.updateCurrentRound();
            this.updateArtist();
            this.updateWord();
            this.correct_players = [];

            this.updateClients();
    
            console.log('Starting round: ' + this.current_round);
            //setTimeout(this.endRound, this.round_length);
            
            //this.timer = setTimeout(() => {console.log('???')}, this.round_length);
            //await this.timer;

            //console.log('after timer!!!!!!!!!!');
            this.timer = await new Promise(resolve => setTimeout(resolve, this.round_length)); // sleep 

            this.endRound();            
        }

    }

    

    updateCurrentRound() {
        /* 
            TODO:
            - if this.current_round + 1 > max_round, then end the game. else: increase the current_round by one
        */
       
       if((this.current_round + 1) > this.max_rounds){
           this.endGame();
        } else {
            this.current_round = this.current_round + 1;            
       }
        
    }

    updateWord() {
        /* 
            TODO:
            - choose a random word from this.words
            - make sure it hasn't be chosen before (not in this.used_words)
        */
        
        this.current_word = this.words[Math.floor(Math.random() * this.words.length)]; 
        //this.current_word = "Test";

    }

    updateArtist(){
        /* 
            TODO:
            - only allow artist to be able to draw
            - artist no longer can type in chat
            - give only artist the current word
        */
        if(this.current_artist){
            const currentArtistIndex = this.player_turns.indexOf(this.current_artist); // FIXME: make sure this works
            if(this.player_turns[currentArtistIndex + 1]){
                this.current_artist = this.player_turns[currentArtistIndex + 1];
            } else {
                this.current_artist = this.player_turns[0];
            }
        } else {
            this.current_artist = this.player_turns[0];
        }

        console.log('Current artist: ' + this.current_artist.nickname);

    }

    endGame() {
        /* 
            TODO:
            - show results
            - maybe redirect all users to Home
        */
    
        console.log('Game has ended');
        this.status = "ended";
        this.updateClients();
    }

    clearBoards() {
        io.in(this.room).emit('clear boards');
    }

    updateClients() {
        io.in(this.room).emit('game info', {
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
    }

}

export default function SiteLogic(server) {

    io = require('socket.io')(server);

    let onlineUsers = [];

    /**
     * Finds game using room id
     * Joins user to the game room.
     * Updates the game's players with the new player (user)
     * @param user 
     * @param game 
     * @param socket 
     */
    const joinGame = (user: User, room: string, socket) => {
        const game = findGame(room);

        if(!game) {
            console.error("Game not found with room ID: " + room);
            // TODO: tell user game was not found with flash message
            return;
        }

        // Check if socket is already in the game. If it is, then update that player
        let playerFound: User;
        game.players.forEach((player: User, index: number) => {
            if(player.id == socket.id) {
                playerFound == player;
                game.players[index] = user;
            }
        });
        
        // Add player if they are not already in the game
        if(!playerFound) {
            game.players.push(user);
        }

        socket.join(game.room);
        socket.emit('game joined', game);
        console.log(socket.id + " has joined room " + game.room);
    }

    /**
     * Creates a new Game (currently with preset settings)
     * Adds Game to the array games[]
     * @param user 
     * @returns game
     */
    const createNewGame = (user: User): Game => {
        const roomId = Math.floor(Math.random() * 10000);
        const NEW_GAME = new Game(user, roomId.toString(), ["word", "word 2", "word 3"], 10);
        games.push(NEW_GAME);

        return NEW_GAME;
    }

    const createGameSocket = (socket) => {
        socket.on('create room', (user: User) => {            
            const NEW_GAME = createNewGame(user);
            joinGame(user, NEW_GAME.room, socket);
        });
    }

    const joinGameSocket = (socket) => {
        socket.on('join game', (obj) => {

            joinGame(obj.user, obj.roomId, socket);

        });
    }

    const updateNicknameSocket = (socket) => {
        socket.on('send-nickname', (nickname: string) => {
            socket.nickname = nickname;  
        });
    }

    const updateCanvasSocket = (socket) => {
        socket.on('updateCanvas', (obj) => {
            console.log(obj.room + ' is being painted');
            if(obj){
                socket.to(obj.room).emit('updateAllCanvases', {
                    data: obj.data
                });
            }
            /* io.emit('updateAllCanvases', {
            id: obj.id,
            data: obj.data
            }); */
        });
    }

    const getLobbyInfoSocket = (socket) => {
        socket.on('joined lobby', (roomId: string) => {
            
            const GAME_FOUND = findGame(roomId);
            if(GAME_FOUND) {
                io.in(roomId).emit('game info', GAME_FOUND);
                //socket.emit('game info', lobby);
            }
        });
    }

    const startGameSocket = (socket) => {
        socket.on('start game', (clientGameInfo: Game) => {
            
            if(socketInGame(socket, clientGameInfo)){
                const realGame = findGame(clientGameInfo.room);
                if(socket.id === realGame.host.id){
                    realGame.startGame();
                } else {
                    console.log(socket.id + ' is not host')
                }
            } else {
                console.error(socket.id + ' is attempting to start a game they are not in (with ID ' + clientGameInfo.room + ')');
            }
            
        });
    }

    function findPlayerBySocketId(arr: Array<User>, socketId: string){
        let playerFound = null;
        arr.forEach((player: User) => {
            if(player.id == socketId){
                playerFound = player;
            }
        });

        return playerFound;
    }

    const chatMessageSocket = (socket) => {
        socket.on('send message', (obj) => {
            // do not emit receive message if the word is correct 
            
            // Object.keys(socket.rooms)[0]

            // TODO: do not allow typing if user is in correct_players
            
            const realGame: Game = findGame(obj.room);
            
            if(realGame){
                if(realGame.current_artist && realGame.current_artist.id != socket.id){

                    
                    if(obj.message === realGame.current_word){
                        if(realGame.status == "active"){                 
                            
                            const correctPlayerFound = findPlayerBySocketId(realGame.correct_players, socket.id);
                            const playerFound = findPlayerBySocketId(realGame.players, socket.id);
                            if(playerFound){
                                
                                if(!correctPlayerFound){
                                    
                                    console.log(socket.nickname + " guessed the word");
                                    io.in(obj.room).emit('receive message', {
                                        message: socket.nickname + " guessed the word!",
                                        nickname: "[Game]"
                                    });
                                    realGame.updateCorrectPlayers(playerFound);
                                    
                                }

                            } else {
                                console.log('Player not found');
                                console.log(socket.id);
                                console.log(playerFound);
                                console.log(realGame.players);
                            }


                        }
                    } else {

                        io.in(obj.room).emit('receive message', {
                            message: obj.message,
                            nickname: socket.nickname
                        });

                    }
                
                } else {
                    io.in(obj.room).emit('receive message', {
                        message: obj.message,
                        nickname: socket.nickname
                    });
                }
            }

            
        });
    }

    const handleDisconnect = (socketId: string) => {
        games.forEach((game) => {
            game.players = game.players.filter((player) => {
                if(player.id !== socketId){
                    return true;
                }
                return false;
            });
            if(game.players.length < 2){
                game.endGame();
            }
            io.in(game.room).emit('game info', game);
        });
    };

    function socketInGame(socket: any, game: Game){
        //TODO: A much more efficient way of doing this is just loop through the socket's rooms and check if room id is in there
        let userFound = null;
        game.players.forEach((player) => {
            if(player.id == socket.id) userFound = player;
        })
        return userFound;
    }

    function findGame(roomId: string){
        let gameFound = null;
        games.forEach((game) => {
            if(game.room === roomId) gameFound = game;
        });
        return gameFound;
    }

    function updateOnlineUsers(user: User){
        let userFound = null;
        console.log(onlineUsers);
        onlineUsers.forEach((onlineUser, index) => {
            if(typeof onlineUser != "undefined"){
                if(onlineUser.id === user.id){
                    onlineUsers[index] = user;
                    userFound = true;
                    console.log('Updated user: ' + user.nickname);
                }
            } else {
                console.log('User iterated is undefined');
            }
        });
        if (!userFound) onlineUsers.push(user);
    }

    const requestWordSocket = (socket) => {

        socket.on('request word', (game) => {
            const realGame: Game = findGame(game.room);
            if(realGame.current_artist){
                if(realGame.current_artist.id == socket.id){
                    socket.emit('get word', realGame.current_word);
                } else {
                    socket.emit('get word', null);
                }
            }
        });

    };


    io.on('connection', function(socket){
        
        socket.emit('sendId', socket.id);

        socket.on('disconnect', _ => handleDisconnect(socket.id));

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

module.exports.Game = SiteLogic;