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
    */

    public host: User; // user obj
    public room: string;
    public status: string;
    public round_length: number; // in seconds
    public max_rounds: number;
    public max_players: number;
    public players: Array<User>;
    public words: Array<string>;
    public words_used: Array<string>;
    
    public current_round: number;
    public current_artist: User;
    public current_word: string;

    public player_turns: Array<User>;

    constructor(host: User, room: string, words: Array<string>, max_rounds: number){
        this.status = "lobby";
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
        this.lobby();
    }
    
    lobby() {
        console.log('lobby created');
        /* 
            TODO:
            - start game when host clicks start button
        */
    }

    public startGame() {
        console.log('Starting game')
        /* 
            TODO:
            - set player_turns (randomize all of the game's players into the array)
            - set status to active
            - run start round
        */
        
    }

    startRound() {
        /* 
            TODO:
            - clear board
            - update current round
            - update artist (if round == 0 then choose a random player. else: go to next User in this.player_turns)
            - update current word
        */
    }

    endRound() {
        /* 
            TODO:
            - give points to users
            - start new round
        */
    }

    updateCurrentRound() {
        /* 
            TODO:
            - if this.current_round + 1 > max_round, then end the game. else: increase the current_round by one
        */
    }

    clearBoards() {
        /* 
            TODO:
            - clear the boards of each player in this room
        */
    }

    updateWord() {
        /* 
            TODO:
            - choose a random word from this.words, make sure it hasn't be chosen before (not in this.used_words)
        */
    }

    updateArtist(){
        /* 
            TODO:
            - decide who the new artist is (if round == 0 then choose a random player. else: go to next User in this.player_turns)
            - only allow artist to be able to draw
            - artist no longer can type in chat
        */
    }

    endGame() {
        /* 
            TODO:
            - show results
            - maybe redirect all users to Home
        */
    }

}

export default function SiteLogic(server) {

    io = require('socket.io')(server);

    let onlineUsers = [];
    let rooms = [];

    const createGameSocket = (socket) => {
        socket.on('create room', (user) => {
            const roomId = Math.floor(Math.random() * 10000);
            rooms.push({
                id: roomId,
                players: []
            });
            //console.log('??: ' + roomId);
            const NEW_GAME = new Game(user, roomId.toString(), ["word", "word 2", "word 3"], 10);
            games.push(NEW_GAME); //? host, room, words, max_rounds
            //console.log(games);
            socket.join(NEW_GAME.room);
            console.log(socket.id + " has joined room " + NEW_GAME.room);
            socket.emit('game joined', NEW_GAME);
            
            //FIXME:
            //updateOnlineUsers(user);
        });
    }

    const joinGameSocket = (socket) => {
        socket.on('join game', (obj) => {
            console.log('player who joined game', obj);
            const gameFound = findGame(obj.roomId);

            if(!gameFound){
                console.log('room not found', obj.roomId);
                socket.emit('game joined', null);
            } else {
                socket.join(gameFound.room);
                gameFound.players.push(obj.user);
                console.log(socket.id + " joined room " + gameFound.room)
                socket.emit('game joined', gameFound);
            }

            // TODO: loop through users, if user is not found, then add user
            // If user is found, then update room on user to obj.roomId
            // Do this one create room as well
            
            //FIXME:
            //updateOnlineUsers(obj.user);
        });
    }

    const updateNicknameSocket = (socket) => {
        socket.on('send-nickname', (nickname: string) => {
            socket.nickname = nickname;  
        });
    }

    const updateCanvasSocket = (socket) => {
        socket.on('updateCanvas', (obj) => {
            console.log(obj.room);
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
            console.log('Searching for game with ID: ' + roomId);
            console.log('lobby found', GAME_FOUND);
            if(GAME_FOUND) {
                io.in(roomId).emit('game info', GAME_FOUND);
                //socket.emit('game info', lobby);
            }
        });
    }

    const startGameSocket = (socket) => {
        socket.on('start game', (game: Game) => {
            
            console.log(socket.id + ' is trying to start their game');
            
            if(socketInGame(socket, game)){
                /* console.log(game); */
                game.startGame();
            } else {

            }
            
        });
    }

    const chatMessageSocket = (socket) => {
        socket.on('send message', (obj) => {
            io.in(Object.keys(socket.rooms)[0]).emit('receive message', {
                message: obj.message,
                nickname: socket.nickname
            });
        });
    }

    const handleDisconnect = (socketId: string) => {
    /* 
    TODO:
    - Loop through games and remove user from them
    */
        games.forEach((game) => {
            game.players = game.players.filter((player) => {
                if(player.id !== socketId){
                    return true;
                }
                return false;
            });
            io.in(game.room).emit('game info', game);
        });
    };

    function socketInGame(socket: any, game: Game){
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

    });
    
}

module.exports.Game = SiteLogic;